const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

const prisma = new PrismaClient();

/**
 * GET /api/staff
 * Danh sách nhân viên
 */
router.get('/', authenticate, authorize('admin', 'manager', 'owner'), asyncHandler(async (req, res) => {
  const { search, position, status, page = 1, limit = 50 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where = {};
  if (position) where.position = position;
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { fullName: { contains: search } },
      { phone: { contains: search } },
      { email: { contains: search } },
    ];
  }

  const [staff, total] = await Promise.all([
    prisma.staff.findMany({
      where,
      include: {
        salaryConfig: true,
        account: { select: { id: true, username: true, role: true, status: true, lastLogin: true } },
      },
      orderBy: { id: 'asc' },
      skip,
      take: Number(limit),
    }),
    prisma.staff.count({ where }),
  ]);

  res.json({ data: staff, total, page: Number(page), limit: Number(limit) });
}));

/**
 * GET /api/staff/:id
 * Chi tiết nhân viên
 */
router.get('/:id', authenticate, authorize('admin', 'manager', 'owner', 'cashier', 'warehouse'), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  // Nhân viên chỉ xem được thông tin của mình trừ manager/admin/owner
  if (!['admin', 'manager', 'owner'].includes(req.user.role) && req.user.profileId !== id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const staff = await prisma.staff.findUnique({
    where: { id },
    include: {
      salaryConfig: true,
      account: { select: { id: true, username: true, role: true, status: true, lastLogin: true } },
    },
  });

  if (!staff) return res.status(404).json({ error: 'Staff not found' });
  res.json(staff);
}));

/**
 * POST /api/staff
 * Tạo nhân viên mới
 */
router.post('/', authenticate, authorize('admin', 'manager'), asyncHandler(async (req, res) => {
  const { fullName, position, phone, email, salaryConfigId, username, password, role } = req.body;

  if (!fullName || !position) {
    return res.status(400).json({ error: 'fullName and position are required' });
  }

  const data = {
    fullName,
    position,
    phone,
    email,
    ...(salaryConfigId && { salaryConfigId: Number(salaryConfigId) }),
  };

  if (username && password) {
    data.account = {
      create: {
        username,
        password,
        role: role || 'cashier',
      },
    };
  }

  const staff = await prisma.staff.create({
    data,
    include: {
      salaryConfig: true,
      account: { select: { id: true, username: true, role: true, status: true } },
    },
  });

  res.status(201).json(staff);
}));

/**
 * PUT /api/staff/:id
 * Cập nhật nhân viên
 */
router.put('/:id', authenticate, authorize('admin', 'manager'), asyncHandler(async (req, res) => {
  const { fullName, position, phone, email, salaryConfigId, status } = req.body;

  const staff = await prisma.staff.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(fullName && { fullName }),
      ...(position && { position }),
      ...(phone !== undefined && { phone }),
      ...(email !== undefined && { email }),
      ...(salaryConfigId && { salaryConfigId: Number(salaryConfigId) }),
      ...(status && { status }),
    },
    include: {
      salaryConfig: true,
      account: { select: { id: true, username: true, role: true, status: true } },
    },
  });

  res.json(staff);
}));

/**
 * DELETE /api/staff/:id
 * Vô hiệu hóa nhân viên (soft delete)
 */
router.delete('/:id', authenticate, authorize('admin', 'manager'), asyncHandler(async (req, res) => {
  const staff = await prisma.staff.update({
    where: { id: Number(req.params.id) },
    data: { status: 'inactive' },
  });
  res.json({ message: 'Staff deactivated', staff });
}));

/**
 * GET /api/staff/:id/attendance
 * Chấm công nhân viên
 */
router.get('/:id/attendance', authenticate, authorize('admin', 'manager', 'owner', 'cashier', 'warehouse'), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { month, year } = req.query; // e.g. ?month=3&year=2026

  const where = { staffId: id };
  if (month && year) {
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 0, 23, 59, 59);
    where.timeIn = { gte: start, lte: end };
  }

  const attendance = await prisma.attendance.findMany({
    where,
    orderBy: { timeIn: 'desc' },
  });

  res.json(attendance);
}));

/**
 * POST /api/staff/:id/attendance/check-in
 * Chấm công vào
 */
router.post('/:id/attendance/check-in', authenticate, authorize('admin', 'manager', 'cashier', 'warehouse'), asyncHandler(async (req, res) => {
  const staffId = Number(req.params.id);

  const record = await prisma.attendance.create({
    data: {
      staffId,
      timeIn: new Date(),
    },
  });

  res.status(201).json(record);
}));

/**
 * PATCH /api/staff/:id/attendance/:attendanceId/check-out
 * Chấm công ra
 */
router.patch('/:id/attendance/:attendanceId/check-out', authenticate, authorize('admin', 'manager', 'cashier', 'warehouse'), asyncHandler(async (req, res) => {
  const attendanceId = Number(req.params.attendanceId);
  const attendance = await prisma.attendance.findUnique({ where: { id: attendanceId } });

  if (!attendance) return res.status(404).json({ error: 'Attendance record not found' });

  const timeOut = new Date();
  const hoursWorked = (timeOut - attendance.timeIn) / (1000 * 60 * 60);

  const updated = await prisma.attendance.update({
    where: { id: attendanceId },
    data: { timeOut, hoursWorked: Math.round(hoursWorked * 10) / 10 },
  });

  res.json(updated);
}));

/**
 * GET /api/staff/:id/salary
 * Lịch sử bảng lương
 */
router.get('/:id/salary', authenticate, authorize('admin', 'manager', 'owner', 'cashier', 'warehouse'), asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  if (!['admin', 'manager', 'owner'].includes(req.user.role) && req.user.profileId !== id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const salaries = await prisma.monthlySalary.findMany({
    where: { staffId: id },
    orderBy: { id: 'desc' },
  });

  const bonusPenalties = await prisma.bonusPenalty.findMany({
    where: { staffId: id },
    orderBy: { date: 'desc' },
  });

  res.json({ salaries, bonusPenalties });
}));

/**
 * GET /api/salary-configs
 * Danh sách cấu hình lương
 */
router.get('/salary-configs/list', authenticate, authorize('admin', 'manager', 'owner'), asyncHandler(async (req, res) => {
  const configs = await prisma.salaryConfig.findMany();
  res.json(configs);
}));

/**
 * POST /api/salary/monthly
 * Tạo bảng lương tháng
 */
router.post('/salary/monthly', authenticate, authorize('admin', 'manager'), asyncHandler(async (req, res) => {
  const { staffId, monthYear, totalHours, mainSalary, bonusPenalty } = req.body;

  if (!staffId || !monthYear || mainSalary === undefined) {
    return res.status(400).json({ error: 'staffId, monthYear, mainSalary are required' });
  }

  const salary = await prisma.monthlySalary.create({
    data: {
      staffId: Number(staffId),
      monthYear,
      totalHours: Number(totalHours || 0),
      mainSalary: Number(mainSalary),
      bonusPenalty: Number(bonusPenalty || 0),
    },
  });

  res.status(201).json(salary);
}));

/**
 * POST /api/staff/:id/bonus-penalty
 * Tạo thưởng/phạt cho nhân viên
 */
router.post('/:id/bonus-penalty', authenticate, authorize('admin', 'manager'), asyncHandler(async (req, res) => {
  const staffId = Number(req.params.id);
  const { type, amount, reason } = req.body;

  if (!type || !amount) {
    return res.status(400).json({ error: 'type and amount are required' });
  }

  const bonusPenalty = await prisma.bonusPenalty.create({
    data: {
      staffId,
      type,
      amount: Number(amount),
      reason,
    },
  });

  res.status(201).json(bonusPenalty);
}));

module.exports = router;
