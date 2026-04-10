const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * GET /api/customers
 * Danh sách khách hàng
 */
router.get('/', authenticate, authorize('admin', 'manager', 'cashier', 'owner'), asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = search
    ? {
        OR: [
          { fullName: { contains: search } },
          { phone: { contains: search } },
          { email: { contains: search } },
        ],
      }
    : {};

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      include: {
        account: { select: { id: true, username: true, role: true, status: true, lastLogin: true } },
      },
      orderBy: { id: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.customer.count({ where }),
  ]);

  res.json({ data: customers, total, page: Number(page), limit: Number(limit) });
}));

/**
 * GET /api/customers/:id
 * Chi tiết khách hàng
 */
router.get('/:id', authenticate, authorize('admin', 'manager', 'cashier', 'owner', 'customer'), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  // Customer chỉ được xem thông tin của mình
  if (req.user.role === 'customer' && req.user.profileId !== id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      account: { select: { id: true, username: true, role: true, status: true, lastLogin: true } },
      pointHistory: { orderBy: { id: 'desc' }, take: 20 },
    },
  });

  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  res.json(customer);
}));

/**
 * POST /api/customers
 * Tạo khách hàng mới (Admin, Cashier, Manager)
 */
router.post('/', authenticate, authorize('admin', 'manager', 'cashier'), asyncHandler(async (req, res) => {
  const { fullName, phone, email, username, password } = req.body;
  if (!fullName) {
    return res.status(400).json({ error: 'fullName is required' });
  }

  let customer;
  if (username && password) {
    // Tạo kèm account
    customer = await prisma.customer.create({
      data: {
        fullName,
        phone,
        email,
        account: {
          create: {
            username,
            password,
            role: 'customer',
          },
        },
      },
      include: { account: { select: { id: true, username: true, role: true, status: true } } },
    });
  } else {
    customer = await prisma.customer.create({
      data: { fullName, phone, email },
    });
  }

  res.status(201).json(customer);
}));

/**
 * PUT /api/customers/:id
 * Cập nhật khách hàng
 */
router.put('/:id', authenticate, authorize('admin', 'manager', 'cashier', 'customer'), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (req.user.role === 'customer' && req.user.profileId !== id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { fullName, phone, email } = req.body;

  const customer = await prisma.customer.update({
    where: { id },
    data: {
      ...(fullName && { fullName }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
    },
  });
  res.json(customer);
}));

/**
 * GET /api/customers/:id/points
 * Lịch sử điểm tích lũy
 */
router.get('/:id/points', authenticate, authorize('admin', 'manager', 'cashier', 'customer'), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (req.user.role === 'customer' && req.user.profileId !== id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const history = await prisma.pointHistory.findMany({
    where: { customerId: id },
    include: { invoice: { select: { id: true, invoiceDate: true, totalAmount: true } } },
    orderBy: { id: 'desc' },
  });

  const customer = await prisma.customer.findUnique({
    where: { id },
    select: { points: true },
  });

  res.json({ currentPoints: customer?.points || 0, history });
}));

/**
 * POST /api/customers/:id/add-points
 * Cộng điểm thủ công (Cashier, Manager)
 */
router.post('/:id/add-points', authenticate, authorize('admin', 'manager', 'cashier'), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { points, method, invoiceId } = req.body;

  if (!points || !method) {
    return res.status(400).json({ error: 'points and method are required' });
  }

  const customer = await prisma.customer.update({
    where: { id },
    data: { points: { increment: Number(points) } },
  });

  if (invoiceId) {
    await prisma.pointHistory.create({
      data: {
        customerId: id,
        invoiceId: Number(invoiceId),
        points: Number(points),
        method,
      },
    });
  }

  res.json({ message: 'Points added', currentPoints: customer.points });
}));

/**
 * GET /api/customers/:id/bookings
 * Lịch sử đặt sân của khách hàng
 */
router.get('/:id/bookings', authenticate, authorize('admin', 'manager', 'cashier', 'customer'), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (req.user.role === 'customer' && req.user.profileId !== id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const bookings = await prisma.booking.findMany({
    where: { customerId: id },
    include: {
      details: { include: { court: { include: { type: true } } } },
      invoices: { select: { id: true, totalAmount: true, paymentMethod: true, invoiceDate: true } },
    },
    orderBy: { bookingDate: 'desc' },
  });

  res.json(bookings);
}));

module.exports = router;
