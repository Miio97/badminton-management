const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * GET /api/dashboard/stats
 * Thống kê public cho trang chủ (Landing page)
 */
router.get('/stats', asyncHandler(async (req, res) => {
  const [
    totalCourts,
    courtsAvailable,
  ] = await Promise.all([
    prisma.court.count(),
    prisma.court.count({ where: { status: 'available' } }),
  ]);

  res.json({
    totalCourts,
    availableCourts: courtsAvailable,
    openingHours: '06:00 - 22:00',
    operatingDays: 7
  });
}));

/**
 * GET /api/dashboard/public-courts
 * Danh sách sân và trạng thái public
 */
router.get('/public-courts', asyncHandler(async (req, res) => {
  const { date } = req.query;
  const targetDate = date ? new Date(date) : new Date();
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  const courts = await prisma.court.findMany({
    include: { type: true },
    orderBy: { id: 'asc' }
  });

  const bookedSlots = await prisma.bookingDetail.findMany({
    where: { date: { gte: startOfDay, lte: endOfDay } },
    select: { courtId: true, startTime: true, endTime: true }
  });

  // Calculate timeslots (e.g., 06:00, 08:00, 10:00, 14:00, 16:00, 18:00, 20:00)
  const defaultSlots = ['06:00', '08:00', '10:00', '14:00', '16:00', '18:00', '20:00'];
  
  const formattedCourts = courts.map(c => {
    const courtBookings = bookedSlots.filter(b => b.courtId === c.id);
    const timeSlots = defaultSlots.map(timeStr => {
      const [hours, mins] = timeStr.split(':');
      const slotTime = new Date(targetDate);
      slotTime.setHours(Number(hours), Number(mins), 0, 0);

      // check if any booking overlaps with this slot (assuming 2 hours slot for simplicity or exact start)
      const isBooked = courtBookings.some(b => {
        return b.startTime <= slotTime && b.endTime > slotTime;
      });

      return { time: timeStr, available: !isBooked };
    });

    return {
      id: c.id.toString(),
      name: c.name,
      status: c.status,
      type: c.type?.name || 'Thường',
      price: c.type?.hourlyPrice ? `${c.type.hourlyPrice.toLocaleString('vi-VN')}đ/giờ` : '100.000đ/giờ',
      image: (c.type?.name?.toLowerCase().includes('cao cấp') || c.type?.name?.toLowerCase().includes('máy lạnh')) 
             ? '/assets/images/court-vip.png' 
             : '/assets/images/court-normal.png',
      timeSlots
    };
  });

  res.json(formattedCourts);
}));

/**
 * GET /api/dashboard/reviews
 * Danh sách đánh giá và thống kê public cho trang chủ
 */
router.get('/reviews', asyncHandler(async (req, res) => {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { date: 'desc' },
    take: 20,
  });

  const total = feedbacks.length;
  const avgRating = total > 0 
    ? feedbacks.reduce((s, f) => s + f.rating, 0) / total 
    : 0;
  const satisfiedPct = total > 0 
    ? Math.round(feedbacks.filter(f => f.rating >= 4).length / total * 100)
    : 0;

  const reviews = feedbacks.map(f => ({
    id: f.id.toString(),
    name: f.customerName,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(f.customerName)}`,
    rating: f.rating,
    comment: f.comment,
    courtName: f.courtName || '',
    date: f.date,
    likes: f.likes,
  }));

  res.json({
    reviews,
    stats: {
      avgRating: parseFloat(avgRating.toFixed(1)),
      totalReviews: total,
      satisfiedPct,
    }
  });
}));

/**
 * GET /api/dashboard/overview
 * Tổng quan Dashboard (Admin, Owner, Manager)
 */
router.get('/overview', authenticate, authorize('admin', 'owner', 'manager'), asyncHandler(async (req, res) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [
    totalCourts,
    courtsInUse,
    courtsAvailable,
    courtsMaintenance,
    totalCustomers,
    totalStaff,
    todayRevenue,
    monthRevenue,
    todayInvoiceCount,
    monthInvoiceCount,
    todayBookings,
    totalProducts,
  ] = await Promise.all([
    prisma.court.count(),
    prisma.court.count({ where: { status: 'in_use' } }),
    prisma.court.count({ where: { status: 'available' } }),
    prisma.court.count({ where: { status: 'maintenance' } }),
    prisma.customer.count(),
    prisma.staff.count({ where: { status: 'active' } }),
    prisma.invoice.aggregate({
      where: { invoiceDate: { gte: todayStart, lte: todayEnd } },
      _sum: { totalAmount: true },
    }),
    prisma.invoice.aggregate({
      where: { invoiceDate: { gte: monthStart, lte: monthEnd } },
      _sum: { totalAmount: true },
    }),
    prisma.invoice.count({ where: { invoiceDate: { gte: todayStart, lte: todayEnd } } }),
    prisma.invoice.count({ where: { invoiceDate: { gte: monthStart, lte: monthEnd } } }),
    prisma.booking.count({ where: { bookingDate: { gte: todayStart, lte: todayEnd } } }),
    prisma.product.count({ where: { status: 'active' } }),
  ]);

  res.json({
    courts: {
      total: totalCourts,
      inUse: courtsInUse,
      available: courtsAvailable,
      maintenance: courtsMaintenance,
    },
    customers: { total: totalCustomers },
    staff: { total: totalStaff },
    revenue: {
      today: todayRevenue._sum.totalAmount || 0,
      month: monthRevenue._sum.totalAmount || 0,
    },
    invoices: {
      today: todayInvoiceCount,
      month: monthInvoiceCount,
    },
    bookings: { today: todayBookings },
    products: { total: totalProducts },
  });
}));

/**
 * GET /api/dashboard/revenue-chart
 * Dữ liệu biểu đồ doanh thu 30 ngày gần nhất
 */
router.get('/revenue-chart', authenticate, authorize('admin', 'owner', 'manager'), asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 30;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);

  const invoices = await prisma.invoice.findMany({
    where: { invoiceDate: { gte: startDate, lte: endDate } },
    select: { invoiceDate: true, totalAmount: true, paymentMethod: true },
    orderBy: { invoiceDate: 'asc' },
  });

  const dailyMap = {};
  for (let i = 0; i < days; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const key = d.toISOString().split('T')[0];
    dailyMap[key] = { date: key, revenue: 0, count: 0 };
  }

  for (const inv of invoices) {
    const key = inv.invoiceDate.toISOString().split('T')[0];
    if (dailyMap[key]) {
      dailyMap[key].revenue += inv.totalAmount;
      dailyMap[key].count += 1;
    }
  }

  res.json(Object.values(dailyMap));
}));

/**
 * GET /api/dashboard/top-courts
 * Sân được sử dụng nhiều nhất
 */
router.get('/top-courts', authenticate, authorize('admin', 'owner', 'manager'), asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Number(days));

  const courtStats = await prisma.invoiceDetail.groupBy({
    by: ['courtId'],
    where: {
      courtId: { not: null },
      invoice: { invoiceDate: { gte: startDate } },
    },
    _sum: { amount: true },
    _count: true,
    orderBy: { _sum: { amount: 'desc' } },
    take: 10,
  });

  const courtsWithInfo = await Promise.all(
    courtStats.map(async (stat) => {
      if (!stat.courtId) return null;
      const court = await prisma.court.findUnique({
        where: { id: stat.courtId },
        include: { type: true },
      });
      return {
        court,
        totalRevenue: stat._sum.amount || 0,
        usageCount: stat._count,
      };
    })
  );

  res.json(courtsWithInfo.filter(Boolean));
}));

/**
 * GET /api/dashboard/top-products
 * Sản phẩm bán chạy nhất
 */
router.get('/top-products', authenticate, authorize('admin', 'owner', 'manager'), asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Number(days));

  const productStats = await prisma.invoiceDetail.groupBy({
    by: ['productId'],
    where: {
      productId: { not: null },
      invoice: { invoiceDate: { gte: startDate } },
    },
    _sum: { amount: true },
    _count: true,
    orderBy: { _count: 'desc' },
    take: 10,
  });

  const productsWithInfo = await Promise.all(
    productStats.map(async (stat) => {
      if (!stat.productId) return null;
      const product = await prisma.product.findUnique({ where: { id: stat.productId } });
      return {
        product,
        totalRevenue: stat._sum.amount || 0,
        soldCount: stat._count,
      };
    })
  );

  res.json(productsWithInfo.filter(Boolean));
}));

/**
 * GET /api/dashboard/warehouse
 * Dashboard kho hàng (Warehouse staff)
 */
router.get('/warehouse', authenticate, authorize('admin', 'manager', 'owner', 'warehouse'), asyncHandler(async (req, res) => {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalProducts, activeProducts, monthReceipts, supplierCount] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: 'active' } }),
    prisma.stockReceipt.count({ where: { date: { gte: monthStart } } }),
    prisma.supplier.count({ where: { status: 'active' } }),
  ]);

  // Tổng giá trị nhập kho tháng này
  const monthReceiptValue = await prisma.stockReceiptDetail.aggregate({
    where: { receipt: { date: { gte: monthStart } } },
    _sum: { unitPrice: true },
  });

  const recentReceipts = await prisma.stockReceipt.findMany({
    take: 5,
    orderBy: { date: 'desc' },
    include: {
      supplier: true,
      staff: { select: { id: true, fullName: true } },
      details: { include: { product: true } },
    },
  });

  res.json({
    products: { total: totalProducts, active: activeProducts },
    receipts: {
      monthCount: monthReceipts,
      monthValue: monthReceiptValue._sum.unitPrice || 0,
    },
    suppliers: { active: supplierCount },
    recentReceipts,
  });
}));

/**
 * GET /api/dashboard/cashier
 * Dashboard thu ngân - trạng thái sân real-time
 */
router.get('/cashier', authenticate, authorize('admin', 'manager', 'cashier'), asyncHandler(async (req, res) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const [courts, todayRevenue, todayInvoices, pendingBookings] = await Promise.all([
    prisma.court.findMany({
      include: { type: true },
      orderBy: { id: 'asc' },
    }),
    prisma.invoice.aggregate({
      where: { invoiceDate: { gte: todayStart, lte: todayEnd } },
      _sum: { totalAmount: true },
    }),
    prisma.invoice.count({ where: { invoiceDate: { gte: todayStart, lte: todayEnd } } }),
    prisma.booking.findMany({
      where: { bookingDate: { gte: todayStart, lte: todayEnd } },
      include: {
        customer: { select: { id: true, fullName: true, phone: true } },
        details: { include: { court: { include: { type: true } } } },
      },
      orderBy: { bookingDate: 'asc' },
    }),
  ]);

  res.json({
    courts,
    today: {
      revenue: todayRevenue._sum.totalAmount || 0,
      invoiceCount: todayInvoices,
      bookings: pendingBookings,
    },
  });
}));

module.exports = router;
