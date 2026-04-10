const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * GET /api/courts
 * Lấy danh sách sân (Public - dành cho cashier, customer đặt sân)
 */
router.get('/', asyncHandler(async (req, res) => {
  const { status, typeId } = req.query;
  const where = {};
  if (status) where.status = status;
  if (typeId) where.typeId = Number(typeId);

  const courts = await prisma.court.findMany({
    where,
    include: { type: true },
    orderBy: { id: 'asc' },
  });
  res.json(courts);
}));

/**
 * GET /api/courts/types
 * Lấy danh sách loại sân
 */
router.get('/types', asyncHandler(async (req, res) => {
  const types = await prisma.courtType.findMany({ orderBy: { id: 'asc' } });
  res.json(types);
}));

/**
 * GET /api/courts/:id
 * Lấy thông tin chi tiết 1 sân
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const court = await prisma.court.findUnique({
    where: { id: Number(req.params.id) },
    include: { type: true },
  });
  if (!court) return res.status(404).json({ error: 'Court not found' });
  res.json(court);
}));

/**
 * POST /api/courts
 * Tạo sân mới (Admin, Manager)
 */
router.post('/', authenticate, authorize('admin', 'manager', 'owner'), asyncHandler(async (req, res) => {
  const { name, typeId, status, notes } = req.body;
  if (!name || !typeId) {
    return res.status(400).json({ error: 'name and typeId are required' });
  }

  const court = await prisma.court.create({
    data: { name, typeId: Number(typeId), status: status || 'available', notes },
    include: { type: true },
  });
  res.status(201).json(court);
}));

/**
 * PUT /api/courts/:id
 * Cập nhật thông tin sân
 */
router.put('/:id', authenticate, authorize('admin', 'manager', 'owner', 'cashier'), asyncHandler(async (req, res) => {
  const { name, typeId, status, notes } = req.body;

  const court = await prisma.court.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(name && { name }),
      ...(typeId && { typeId: Number(typeId) }),
      ...(status && { status }),
      ...(notes !== undefined && { notes }),
    },
    include: { type: true },
  });
  res.json(court);
}));

/**
 * PATCH /api/courts/:id/status
 * Cập nhật trạng thái sân nhanh (open/close/maintenance)
 */
router.patch('/:id/status', authenticate, authorize('admin', 'manager', 'cashier'), asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['available', 'in_use', 'maintenance'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${validStatuses.join(', ')}` });
  }

  const court = await prisma.court.update({
    where: { id: Number(req.params.id) },
    data: { status },
    include: { type: true },
  });
  res.json(court);
}));

/**
 * DELETE /api/courts/:id
 * Xóa sân (Admin only)
 */
router.delete('/:id', authenticate, authorize('admin', 'owner'), asyncHandler(async (req, res) => {
  await prisma.court.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: 'Court deleted successfully' });
}));

/**
 * POST /api/courts/types
 * Tạo loại sân mới
 */
router.post('/types', authenticate, authorize('admin', 'manager', 'owner'), asyncHandler(async (req, res) => {
  const { name, hourlyPrice } = req.body;
  if (!name || hourlyPrice === undefined) {
    return res.status(400).json({ error: 'name and hourlyPrice are required' });
  }

  const type = await prisma.courtType.create({
    data: { name, hourlyPrice: Number(hourlyPrice) },
  });
  res.status(201).json(type);
}));

/**
 * PUT /api/courts/types/:id
 * Cập nhật loại sân
 */
router.put('/types/:id', authenticate, authorize('admin', 'manager', 'owner'), asyncHandler(async (req, res) => {
  const { name, hourlyPrice } = req.body;
  const type = await prisma.courtType.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(name && { name }),
      ...(hourlyPrice !== undefined && { hourlyPrice: Number(hourlyPrice) }),
    },
  });
  res.json(type);
}));

module.exports = router;
