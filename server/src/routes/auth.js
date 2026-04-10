const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { JWT_SECRET } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * POST /api/auth/login
 * Đăng nhập và trả về JWT token
 */
router.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const account = await prisma.account.findUnique({
    where: { username },
    include: {
      staff: true,
      customer: true,
    },
  });

  if (!account) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  if (account.status !== 'active') {
    return res.status(403).json({ error: 'Account is disabled' });
  }

  // So sánh password (hỗ trợ cả plain text demo và bcrypt hash)
  let passwordMatch = false;
  if (account.password.startsWith('$2')) {
    passwordMatch = await bcrypt.compare(password, account.password);
  } else {
    passwordMatch = account.password === password;
  }

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  // Cập nhật lastLogin
  await prisma.account.update({
    where: { id: account.id },
    data: { lastLogin: new Date() },
  });

  // Build payload
  const profileId = account.staff?.id || account.customer?.id || null;
  const fullName = account.staff?.fullName || account.customer?.fullName || account.username;

  const payload = {
    accountId: account.id,
    username: account.username,
    role: account.role,
    profileId,
    fullName,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

  res.json({
    token,
    user: payload,
  });
}));

/**
 * POST /api/auth/logout
 * Đăng xuất (client xóa token)
 */
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

/**
 * GET /api/auth/me
 * Lấy thông tin tài khoản hiện tại từ token
 */
router.get('/me', asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const account = await prisma.account.findUnique({
    where: { id: decoded.accountId },
    select: {
      id: true,
      username: true,
      role: true,
      status: true,
      createdAt: true,
      lastLogin: true,
      staff: { select: { id: true, fullName: true, position: true, phone: true, email: true } },
      customer: { select: { id: true, fullName: true, phone: true, email: true, points: true } },
    },
  });

  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  res.json(account);
}));

/**
 * PUT /api/auth/change-password
 * Đổi mật khẩu
 */
router.put('/change-password', asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'currentPassword and newPassword are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  const account = await prisma.account.findUnique({ where: { id: decoded.accountId } });
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  let passwordMatch = false;
  if (account.password.startsWith('$2')) {
    passwordMatch = await bcrypt.compare(currentPassword, account.password);
  } else {
    passwordMatch = account.password === currentPassword;
  }

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.account.update({
    where: { id: decoded.accountId },
    data: { password: hashed },
  });

  res.json({ message: 'Password changed successfully' });
}));

module.exports = router;
