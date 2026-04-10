const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * GET /api/bookings
 * Danh sách đặt sân
 */
router.get('/', authenticate, asyncHandler(async (req, res) => {
  const { customerId, staffId, startDate, endDate, page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {};

  // Customer chỉ thấy booking của họ
  if (req.user.role === 'customer') {
    where.customerId = req.user.profileId;
  } else {
    if (customerId) where.customerId = Number(customerId);
    if (staffId) where.staffId = Number(staffId);
  }

  if (startDate || endDate) {
    where.bookingDate = {};
    if (startDate) where.bookingDate.gte = new Date(startDate);
    if (endDate) where.bookingDate.lte = new Date(endDate);
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        customer: { select: { id: true, fullName: true, phone: true } },
        staff: { select: { id: true, fullName: true } },
        details: {
          include: { court: { include: { type: true } } },
        },
        invoices: { select: { id: true, totalAmount: true, paymentMethod: true, invoiceDate: true } },
      },
      orderBy: { bookingDate: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.booking.count({ where }),
  ]);

  res.json({ data: bookings, total, page: Number(page), limit: Number(limit) });
}));

/**
 * GET /api/bookings/:id
 * Chi tiết đặt sân
 */
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, fullName: true, phone: true, email: true, points: true } },
      staff: { select: { id: true, fullName: true } },
      details: { include: { court: { include: { type: true } } } },
      invoices: true,
    },
  });

  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  // Customer chỉ xem booking của họ
  if (req.user.role === 'customer' && booking.customerId !== req.user.profileId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json(booking);
}));

/**
 * POST /api/bookings
 * Tạo đặt sân mới
 */
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const { customerId, deposit, details } = req.body;
  const staffId = req.user.profileId;

  if (!customerId || !details || !details.length) {
    return res.status(400).json({ error: 'customerId and details are required' });
  }

  // Kiểm tra xem sân có available không
  for (const detail of details) {
    const conflictingBooking = await prisma.bookingDetail.findFirst({
      where: {
        courtId: Number(detail.courtId),
        date: new Date(detail.date),
        OR: [
          {
            startTime: { lt: new Date(detail.endTime) },
            endTime: { gt: new Date(detail.startTime) },
          },
        ],
      },
    });

    if (conflictingBooking) {
      return res.status(409).json({
        error: `Court ${detail.courtId} is already booked for this time slot`,
      });
    }
  }

  const booking = await prisma.booking.create({
    data: {
      customerId: Number(customerId),
      // Schema yêu cầu staffId (bắt buộc), nên nếu là Customer đặt thì gán cho NV mặc định (ID: 22)
      staffId: req.user.role === 'customer' ? 22 : Number(staffId),
      deposit: Number(deposit || 0),
      details: {
        create: details.map(d => ({
          courtId: Number(d.courtId),
          date: new Date(d.date),
          startTime: new Date(d.startTime),
          endTime: new Date(d.endTime),
        })),
      },
    },
    include: {
      customer: { select: { id: true, fullName: true, phone: true } },
      staff: { select: { id: true, fullName: true } },
      details: { include: { court: { include: { type: true } } } },
    },
  });

  res.status(201).json(booking);
}));

/**
 * PUT /api/bookings/:id
 * Cập nhật đặt sân
 */
router.put('/:id', authenticate, authorize('admin', 'manager', 'cashier'), asyncHandler(async (req, res) => {
  const { deposit } = req.body;

  const booking = await prisma.booking.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(deposit !== undefined && { deposit: Number(deposit) }),
    },
    include: {
      customer: { select: { id: true, fullName: true, phone: true } },
      staff: { select: { id: true, fullName: true } },
      details: { include: { court: { include: { type: true } } } },
    },
  });

  res.json(booking);
}));

/**
 * DELETE /api/bookings/:id
 * Hủy đặt sân
 */
router.delete('/:id', authenticate, authorize('admin', 'manager', 'cashier', 'customer'), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const booking = await prisma.booking.findUnique({ where: { id } });

  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  if (req.user.role === 'customer' && booking.customerId !== req.user.profileId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  // Xóa details trước (cascade)
  await prisma.bookingDetail.deleteMany({ where: { bookingId: id } });
  await prisma.booking.delete({ where: { id } });

  res.json({ message: 'Booking cancelled successfully' });
}));

/**
 * GET /api/bookings/available-slots
 * Kiểm tra slot trống theo ngày và sân
 */
router.get('/check/available-slots', asyncHandler(async (req, res) => {
  const { courtId, date } = req.query;

  if (!courtId || !date) {
    return res.status(400).json({ error: 'courtId and date are required' });
  }

  const targetDate = new Date(date);
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  const bookedSlots = await prisma.bookingDetail.findMany({
    where: {
      courtId: Number(courtId),
      date: { gte: startOfDay, lte: endOfDay },
    },
    select: {
      startTime: true,
      endTime: true,
    },
  });

  res.json({ bookedSlots, date: new Date(date).toISOString().split('T')[0] });
}));

module.exports = router;
