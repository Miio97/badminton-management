const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * GET /api/products
 * Danh sách sản phẩm
 */
router.get('/', asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 100 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {};
  if (status) where.status = status;
  if (search) {
    where.name = { contains: search };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { id: 'asc' },
      skip,
      take: Number(limit),
    }),
    prisma.product.count({ where }),
  ]);

  res.json({ data: products, total, page: Number(page), limit: Number(limit) });
}));

/**
 * GET /api/products/:id
 * Chi tiết sản phẩm
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
}));

/**
 * POST /api/products
 * Tạo sản phẩm mới (Warehouse, Manager, Admin)
 */
router.post('/', authenticate, authorize('admin', 'manager', 'warehouse'), asyncHandler(async (req, res) => {
  const { name, unit, price, status } = req.body;

  if (!name || !unit || price === undefined) {
    return res.status(400).json({ error: 'name, unit, and price are required' });
  }

  const product = await prisma.product.create({
    data: {
      name,
      unit,
      price: Number(price),
      status: status || 'active',
    },
  });

  res.status(201).json(product);
}));

/**
 * PUT /api/products/:id
 * Cập nhật sản phẩm
 */
router.put('/:id', authenticate, authorize('admin', 'manager', 'warehouse'), asyncHandler(async (req, res) => {
  const { name, unit, price, status } = req.body;

  const product = await prisma.product.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(name && { name }),
      ...(unit && { unit }),
      ...(price !== undefined && { price: Number(price) }),
      ...(status && { status }),
    },
  });

  res.json(product);
}));

/**
 * DELETE /api/products/:id
 * Xóa sản phẩm (soft delete - đổi status)
 */
router.delete('/:id', authenticate, authorize('admin', 'manager', 'warehouse'), asyncHandler(async (req, res) => {
  const product = await prisma.product.update({
    where: { id: Number(req.params.id) },
    data: { status: 'inactive' },
  });
  res.json({ message: 'Product deactivated', product });
}));

// =================== SUPPLIERS ===================

/**
 * GET /api/products/suppliers/list
 * Danh sách nhà cung cấp
 */
router.get('/suppliers/list', authenticate, authorize('admin', 'manager', 'owner', 'warehouse'), asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { phone: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({
      where,
      orderBy: { id: 'asc' },
      skip,
      take: Number(limit),
    }),
    prisma.supplier.count({ where }),
  ]);

  res.json({ data: suppliers, total, page: Number(page), limit: Number(limit) });
}));

/**
 * POST /api/products/suppliers
 * Tạo nhà cung cấp mới
 */
router.post('/suppliers', authenticate, authorize('admin', 'manager', 'warehouse'), asyncHandler(async (req, res) => {
  const { name, phone, address, email } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  const supplier = await prisma.supplier.create({
    data: { name, phone, address, email },
  });

  res.status(201).json(supplier);
}));

/**
 * PUT /api/products/suppliers/:id
 * Cập nhật nhà cung cấp
 */
router.put('/suppliers/:id', authenticate, authorize('admin', 'manager', 'warehouse'), asyncHandler(async (req, res) => {
  const { name, phone, address, email, status } = req.body;

  const supplier = await prisma.supplier.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(name && { name }),
      ...(phone !== undefined && { phone }),
      ...(address !== undefined && { address }),
      ...(email !== undefined && { email }),
      ...(status && { status }),
    },
  });

  res.json(supplier);
}));

/**
 * DELETE /api/products/suppliers/:id
 * Xóa nhà cung cấp (soft delete)
 */
router.delete('/suppliers/:id', authenticate, authorize('admin', 'manager', 'warehouse'), asyncHandler(async (req, res) => {
  const supplier = await prisma.supplier.update({
    where: { id: Number(req.params.id) },
    data: { status: 'inactive' },
  });
  res.json({ message: 'Supplier deactivated', supplier });
}));

// =================== STOCK RECEIPTS (NHẬP KHO) ===================

/**
 * GET /api/products/stock-receipts
 * Danh sách phiếu nhập kho
 */
router.get('/stock-receipts/list', authenticate, authorize('admin', 'manager', 'owner', 'warehouse'), asyncHandler(async (req, res) => {
  const { supplierId, staffId, startDate, endDate, page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {};
  if (supplierId) where.supplierId = Number(supplierId);
  if (staffId) where.staffId = Number(staffId);
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const [receipts, total] = await Promise.all([
    prisma.stockReceipt.findMany({
      where,
      include: {
        supplier: true,
        staff: { select: { id: true, fullName: true } },
        details: { include: { product: true } },
      },
      orderBy: { date: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.stockReceipt.count({ where }),
  ]);

  res.json({ data: receipts, total, page: Number(page), limit: Number(limit) });
}));

/**
 * GET /api/products/stock-receipts/:id
 * Chi tiết phiếu nhập kho
 */
router.get('/stock-receipts/:id', authenticate, authorize('admin', 'manager', 'owner', 'warehouse'), asyncHandler(async (req, res) => {
  const receipt = await prisma.stockReceipt.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      supplier: true,
      staff: { select: { id: true, fullName: true } },
      details: { include: { product: true } },
    },
  });

  if (!receipt) return res.status(404).json({ error: 'Stock receipt not found' });
  res.json(receipt);
}));

/**
 * POST /api/products/stock-receipts
 * Tạo phiếu nhập kho
 */
router.post('/stock-receipts', authenticate, authorize('admin', 'manager', 'warehouse'), asyncHandler(async (req, res) => {
  const { supplierId, notes, details } = req.body;
  const staffId = req.user.profileId;

  if (!supplierId || !details || !details.length) {
    return res.status(400).json({ error: 'supplierId and details are required' });
  }

  const receipt = await prisma.stockReceipt.create({
    data: {
      supplierId: Number(supplierId),
      staffId: Number(staffId),
      notes,
      details: {
        create: details.map(d => ({
          productId: Number(d.productId),
          quantity: Number(d.quantity),
          unitPrice: Number(d.unitPrice),
          unit: d.unit || 'Cái',
        })),
      },
    },
    include: {
      supplier: true,
      staff: { select: { id: true, fullName: true } },
      details: { include: { product: true } },
    },
  });

  res.status(201).json(receipt);
}));

module.exports = router;
