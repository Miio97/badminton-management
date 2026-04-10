const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * GET /api/promotions
 * Danh sách khuyến mãi (Public)
 */
router.get('/', asyncHandler(async (req, res) => {
  const { status, type } = req.query;
  const now = new Date();

  const where = {};
  if (status === 'active') {
    where.status = 'active';
    where.startDate = { lte: now };
    where.endDate = { gte: now };
  } else if (status) {
    where.status = status;
  }
  if (type) where.type = type;

  const promotions = await prisma.promotion.findMany({
    where,
    orderBy: { startDate: 'desc' },
  });

  res.json(promotions);
}));

/**
 * GET /api/promotions/:id
 * Chi tiết khuyến mãi
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const promotion = await prisma.promotion.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!promotion) return res.status(404).json({ error: 'Promotion not found' });
  res.json(promotion);
}));

/**
 * POST /api/promotions
 * Tạo khuyến mãi mới (Manager, Admin, Owner)
 */
router.post('/', authenticate, authorize('admin', 'manager', 'owner'), asyncHandler(async (req, res) => {
  const { name, notes, type, value, startDate, endDate, conditions } = req.body;

  if (!name || !type || value === undefined || !startDate || !endDate) {
    return res.status(400).json({ error: 'name, type, value, startDate, endDate are required' });
  }

  const promotion = await prisma.promotion.create({
    data: {
      name,
      notes,
      type,
      value: Number(value),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      conditions,
      status: 'active',
    },
  });

  res.status(201).json(promotion);
}));

/**
 * PUT /api/promotions/:id
 * Cập nhật khuyến mãi
 */
router.put('/:id', authenticate, authorize('admin', 'manager', 'owner'), asyncHandler(async (req, res) => {
  const { name, notes, type, value, startDate, endDate, conditions, status } = req.body;

  const promotion = await prisma.promotion.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(name && { name }),
      ...(notes !== undefined && { notes }),
      ...(type && { type }),
      ...(value !== undefined && { value: Number(value) }),
      ...(startDate && { startDate: new Date(startDate) }),
      ...(endDate && { endDate: new Date(endDate) }),
      ...(conditions !== undefined && { conditions }),
      ...(status && { status }),
    },
  });

  res.json(promotion);
}));

/**
 * DELETE /api/promotions/:id
 * Hủy khuyến mãi (soft delete)
 */
router.delete('/:id', authenticate, authorize('admin', 'manager', 'owner'), asyncHandler(async (req, res) => {
  const promotion = await prisma.promotion.update({
    where: { id: Number(req.params.id) },
    data: { status: 'inactive' },
  });
  res.json({ message: 'Promotion deactivated', promotion });
}));

/**
 * POST /api/promotions/validate
 * Kiểm tra khuyến mãi áp dụng được không
 */
router.post('/validate', asyncHandler(async (req, res) => {
  const { promotionId, totalAmount } = req.body;

  if (!promotionId) {
    return res.status(400).json({ error: 'promotionId is required' });
  }

  const promotion = await prisma.promotion.findUnique({
    where: { id: Number(promotionId) },
  });

  if (!promotion) {
    return res.status(404).json({ valid: false, error: 'Promotion not found' });
  }

  const now = new Date();
  if (promotion.status !== 'active' || now < promotion.startDate || now > promotion.endDate) {
    return res.json({ valid: false, error: 'Promotion is not active or expired' });
  }

  // Tính giảm giá
  let discount = 0;
  if (promotion.type === 'Percentage') {
    discount = (Number(totalAmount || 0) * promotion.value) / 100;
  } else if (promotion.type === 'Fixed') {
    discount = promotion.value;
  }

  res.json({
    valid: true,
    promotion,
    discount,
    finalAmount: Math.max(0, Number(totalAmount || 0) - discount),
  });
}));

module.exports = router;
