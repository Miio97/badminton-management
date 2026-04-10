const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * GET /api/invoices
 * Danh sách hóa đơn
 */
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { customerId, staffId, startDate, endDate, paymentMethod, page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {};

  if (req.user.role === 'customer') {
    where.customerId = req.user.profileId;
  } else {
    if (customerId) where.customerId = Number(customerId);
    if (staffId) where.staffId = Number(staffId);
  }

  if (paymentMethod) where.paymentMethod = paymentMethod;
  if (startDate || endDate) {
    where.invoiceDate = {};
    if (startDate) where.invoiceDate.gte = new Date(startDate);
    if (endDate) where.invoiceDate.lte = new Date(endDate);
  }

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: {
        customer: { select: { id: true, fullName: true, phone: true } },
        staff: { select: { id: true, fullName: true } },
        promotion: true,
        details: {
          include: {
            court: { include: { type: true } },
            product: true,
          },
        },
      },
      orderBy: { invoiceDate: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.invoice.count({ where }),
  ]);

  res.json({ data: invoices, total, page: Number(page), limit: Number(limit) });
}));

/**
 * GET /api/invoices/:id
 * Chi tiết hóa đơn
 */
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, fullName: true, phone: true, email: true, points: true } },
      staff: { select: { id: true, fullName: true } },
      booking: {
        include: { details: { include: { court: { include: { type: true } } } } },
      },
      promotion: true,
      details: {
        include: {
          court: { include: { type: true } },
          product: true,
        },
      },
      pointHistory: true,
    },
  });

  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  if (req.user.role === 'customer' && invoice.customerId !== req.user.profileId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json(invoice);
}));

/**
 * POST /api/invoices
 * Tạo hóa đơn (Cashier tạo khi thanh toán)
 */
router.post('/', authenticate, authorize('admin', 'manager', 'cashier'), asyncHandler(async (req, res) => {
  const {
    customerId,
    bookingId,
    promotionId,
    paymentMethod,
    totalAmount,
    details, // [{ courtId, productId, startTime, endTime, amount, unitPrice, hourlyPrice }]
    earnPoints, // số điểm tích lũy
    usePoints,  // số điểm dùng để giảm giá
  } = req.body;

  const staffId = req.user.profileId;

  if (!paymentMethod || totalAmount === undefined || !details?.length) {
    return res.status(400).json({ error: 'paymentMethod, totalAmount, and details are required' });
  }

  // Tạo hóa đơn
  const invoice = await prisma.invoice.create({
    data: {
      staffId: Number(staffId),
      customerId: customerId ? Number(customerId) : null,
      bookingId: bookingId ? Number(bookingId) : null,
      promotionId: promotionId ? Number(promotionId) : null,
      paymentMethod,
      totalAmount: Number(totalAmount),
      details: {
        create: details.map(d => ({
          courtId: d.courtId ? Number(d.courtId) : null,
          productId: d.productId ? Number(d.productId) : null,
          startTime: d.startTime ? new Date(d.startTime) : null,
          endTime: d.endTime ? new Date(d.endTime) : null,
          amount: Number(d.amount),
          unitPrice: d.unitPrice ? Number(d.unitPrice) : null,
          hourlyPrice: d.hourlyPrice ? Number(d.hourlyPrice) : null,
        })),
      },
    },
    include: {
      customer: { select: { id: true, fullName: true, phone: true } },
      staff: { select: { id: true, fullName: true } },
      promotion: true,
      details: {
        include: {
          court: { include: { type: true } },
          product: true,
        },
      },
    },
  });

  // Tích điểm cho khách hàng
  if (customerId && earnPoints && earnPoints > 0) {
    await Promise.all([
      prisma.customer.update({
        where: { id: Number(customerId) },
        data: { points: { increment: Number(earnPoints) } },
      }),
      prisma.pointHistory.create({
        data: {
          customerId: Number(customerId),
          invoiceId: invoice.id,
          points: Number(earnPoints),
          method: 'Tích điểm',
        },
      }),
    ]);
  }

  // Dùng điểm (điểm âm)
  if (customerId && usePoints && usePoints > 0) {
    await Promise.all([
      prisma.customer.update({
        where: { id: Number(customerId) },
        data: { points: { decrement: Number(usePoints) } },
      }),
      prisma.pointHistory.create({
        data: {
          customerId: Number(customerId),
          invoiceId: invoice.id,
          points: -Number(usePoints),
          method: 'Dùng điểm',
        },
      }),
    ]);
  }

  // Cập nhật trạng thái sân về available nếu đây là thanh toán sân
  const courtDetails = details.filter(d => d.courtId);
  if (courtDetails.length > 0) {
    await prisma.court.updateMany({
      where: { id: { in: courtDetails.map(d => Number(d.courtId)) } },
      data: { status: 'available' },
    });
  }

  res.status(201).json(invoice);
}));

/**
 * GET /api/invoices/summary/stats
 * Thống kê nhanh doanh thu
 */
router.get('/summary/stats', authenticate, authorize('admin', 'manager', 'owner'), asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const where = {};
  if (startDate || endDate) {
    where.invoiceDate = {};
    if (startDate) where.invoiceDate.gte = new Date(startDate);
    if (endDate) where.invoiceDate.lte = new Date(endDate);
  }

  const [totalRevenue, invoiceCount, byPaymentMethod] = await Promise.all([
    prisma.invoice.aggregate({
      where,
      _sum: { totalAmount: true },
      _avg: { totalAmount: true },
    }),
    prisma.invoice.count({ where }),
    prisma.invoice.groupBy({
      by: ['paymentMethod'],
      where,
      _sum: { totalAmount: true },
      _count: true,
    }),
  ]);

  res.json({
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    averageInvoice: totalRevenue._avg.totalAmount || 0,
    invoiceCount,
    byPaymentMethod,
  });
}));

/**
 * GET /api/invoices/summary/daily
 * Doanh thu theo ngày trong khoảng thời gian
 */
router.get('/summary/daily', authenticate, authorize('admin', 'manager', 'owner'), asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const where = {};
  if (startDate) where.invoiceDate = { gte: new Date(startDate) };
  if (endDate) {
    where.invoiceDate = { ...(where.invoiceDate || {}), lte: new Date(endDate) };
  }

  const invoices = await prisma.invoice.findMany({
    where,
    select: { invoiceDate: true, totalAmount: true },
    orderBy: { invoiceDate: 'asc' },
  });

  // Group by date
  const dailyMap = {};
  for (const inv of invoices) {
    const day = inv.invoiceDate.toISOString().split('T')[0];
    if (!dailyMap[day]) dailyMap[day] = { date: day, revenue: 0, count: 0 };
    dailyMap[day].revenue += inv.totalAmount;
    dailyMap[day].count += 1;
  }

  res.json(Object.values(dailyMap));
}));

module.exports = router;
