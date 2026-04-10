const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * GET /api/accounts
 * Danh sách tài khoản (Admin only)
 */
router.get('/', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { role, status, search, page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {};
  if (role) where.role = role;
  if (status) where.status = status;
  if (search) where.username = { contains: search };

  const [accounts, total] = await Promise.all([
    prisma.account.findMany({
      where,
      select: {
        id: true,
        username: true,
        role: true,
        status: true,
        createdAt: true,
        lastLogin: true,
        staff: { select: { id: true, fullName: true, position: true } },
        customer: { select: { id: true, fullName: true } },
      },
      orderBy: { id: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.account.count({ where }),
  ]);

  res.json({ data: accounts, total, page: Number(page), limit: Number(limit) });
}));

/**
 * PATCH /api/accounts/:id/status
 * Bật/tắt tài khoản (Admin only)
 */
router.patch('/:id/status', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['active', 'inactive'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
  }

  const account = await prisma.account.update({
    where: { id: Number(req.params.id) },
    data: { status },
    select: {
      id: true,
      username: true,
      role: true,
      status: true,
    },
  });

  res.json(account);
}));

/**
 * PATCH /api/accounts/:id/reset-password
 * Reset mật khẩu (Admin only)
 */
router.patch('/:id/reset-password', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'newPassword must be at least 6 characters' });
  }

  await prisma.account.update({
    where: { id: Number(req.params.id) },
    data: { password: newPassword },
  });

  res.json({ message: 'Password reset successfully' });
}));

/**
 * PATCH /api/accounts/:id/role
 * Cập nhật quyền tài khoản (Admin only)
 */
router.patch('/:id/role', authenticate, authorize('admin'), asyncHandler(async (req, res) => {
  const { role } = req.body;
  const validRoles = ['admin', 'owner', 'manager', 'warehouse', 'cashier', 'customer'];

  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ error: `role must be one of: ${validRoles.join(', ')}` });
  }

  const account = await prisma.account.update({
    where: { id: Number(req.params.id) },
    data: { role },
    select: { id: true, username: true, role: true, status: true },
  });

  res.json(account);
}));

/**
 * GET /api/accounts/salary-configs
 * Danh sách cấu hình lương
 */
router.get('/salary-configs', authenticate, authorize('admin', 'manager', 'owner'), asyncHandler(async (req, res) => {
  const configs = await prisma.salaryConfig.findMany({ orderBy: { id: 'asc' } });
  res.json(configs);
}));

/**
 * POST /api/accounts/salary-configs
 * Tạo cấu hình lương
 */
router.post('/salary-configs', authenticate, authorize('admin', 'manager'), asyncHandler(async (req, res) => {
  const { baseSalary, hourlyRate, allowance } = req.body;

  if (baseSalary === undefined || hourlyRate === undefined || allowance === undefined) {
    return res.status(400).json({ error: 'baseSalary, hourlyRate, allowance are required' });
  }

  const config = await prisma.salaryConfig.create({
    data: {
      baseSalary: Number(baseSalary),
      hourlyRate: Number(hourlyRate),
      allowance: Number(allowance),
    },
  });

  res.status(201).json(config);
}));

/**
 * PUT /api/accounts/salary-configs/:id
 * Cập nhật cấu hình lương
 */
router.put('/salary-configs/:id', authenticate, authorize('admin', 'manager'), asyncHandler(async (req, res) => {
  const { baseSalary, hourlyRate, allowance } = req.body;

  const config = await prisma.salaryConfig.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(baseSalary !== undefined && { baseSalary: Number(baseSalary) }),
      ...(hourlyRate !== undefined && { hourlyRate: Number(hourlyRate) }),
      ...(allowance !== undefined && { allowance: Number(allowance) }),
    },
  });

  res.json(config);
}));

module.exports = router;
