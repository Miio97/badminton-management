const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Đang dọn dẹp dữ liệu cũ...');
  const tables = [
    'attendance', 'bonusPenalty', 'monthlySalary', 'invoiceDetail', 'pointHistory',
    'invoice', 'bookingDetail', 'booking', 'stockReceiptDetail', 'stockReceipt',
    'court', 'courtType', 'product', 'promotion', 'supplier', 'staff', 'customer',
    'account', 'salaryConfig'
  ];
  for (const table of tables) {
    await prisma[table].deleteMany();
  }

  console.log('🌱 1. Khởi tạo Cấu hình Lương...');
  const configs = await Promise.all([
    prisma.salaryConfig.create({ data: { baseSalary: 15000000, hourlyRate: 100000, allowance: 2000000 } }), // Admin/Owner
    prisma.salaryConfig.create({ data: { baseSalary: 10000000, hourlyRate: 60000, allowance: 1000000 } }),  // Manager
    prisma.salaryConfig.create({ data: { baseSalary: 7000000, hourlyRate: 30000, allowance: 500000 } }),   // Staff
  ]);

  console.log('👤 2. Khởi tạo 17 Accounts & Nhân viên/Khách hàng...');
  // Roles: ADMIN (1), OWNER (1), MANAGER (1), WAREHOUSE (2), CASHIER (2), CUSTOMER (10)

  // Tạo nhân viên
  const staffRoles = [
    { role: 'admin', pos: 'Quản trị viên', count: 1, cfg: configs[0].id },
    { role: 'owner', pos: 'Chủ sân', count: 1, cfg: configs[0].id },
    { role: 'manager', pos: 'Quản lý', count: 1, cfg: configs[1].id },
    { role: 'warehouse', pos: 'Nhân viên kho', count: 2, cfg: configs[2].id },
    { role: 'cashier', pos: 'Thu ngân', count: 2, cfg: configs[2].id },
  ];
  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash('123123', 10);
  const allStaff = [];
  for (const r of staffRoles) {
    for (let i = 1; i <= r.count; i++) {
      const username = `${r.role}${i > 1 ? i : ''}`;
      const user = await prisma.account.create({
        data: {
          username,
          password: hashedPassword, // Demo hash
          role: r.role,
          staff: {
            create: {
              fullName: `${r.pos} ${i}`,
              position: r.pos,
              phone: `090${Math.floor(Math.random() * 9000000 + 1000000)}`,
              email: `${username}@badminton.com`,
              salaryConfigId: r.cfg
            }
          }
        },
        include: { staff: true }
      });
      allStaff.push(user.staff);
    }
  }

  // Tạo 100 khách hàng
  const allCustomers = [];
  for (let i = 1; i <= 100; i++) {
    const username = `customer${i}`;
    const user = await prisma.account.create({
      data: {
        username,
        password: 'password123',
        role: 'customer',
        customer: {
          create: {
            fullName: `Khách hàng ${i}`,
            phone: `098${Math.floor(Math.random() * 9000000 + 1000000)}`,
            email: `${username}@gmail.com`,
            points: Math.floor(Math.random() * 1000)
          }
        }
      },
      include: { customer: true }
    });
    allCustomers.push(user.customer);
  }

  console.log('🏸 3. Khởi tạo Loại sân & 20 Sân...');
  const courtTypes = await Promise.all([
    prisma.courtType.create({ data: { name: 'Sân Thảm Cao Cấp', hourlyPrice: 150000 } }),
    prisma.courtType.create({ data: { name: 'Sân Thảm Thường', hourlyPrice: 100000 } }),
    prisma.courtType.create({ data: { name: 'Sân Gỗ', hourlyPrice: 80000 } }),
  ]);

  const allCourts = [];
  for (let i = 1; i <= 20; i++) {
    const court = await prisma.court.create({
      data: {
        name: `Sân ${i}`,
        typeId: courtTypes[i % 3].id,
        status: i === 20 ? 'maintenance' : 'available'
      }
    });
    allCourts.push(court);
  }

  console.log('🏭 4. Khởi tạo 10 Nhà cung cấp...');
  const allSuppliers = [];
  for (let i = 1; i <= 10; i++) {
    const sup = await prisma.supplier.create({
      data: {
        name: `Nhà cung cấp ${i}`,
        phone: `028${Math.floor(Math.random() * 9000000 + 1000000)}`,
        email: `ncc${i}@supplier.vn`,
        address: `${i * 10} Đường số ${i}, TP.HCM`
      }
    });
    allSuppliers.push(sup);
  }

  console.log('📦 5. Khởi tạo 25 Sản phẩm...');
  const allProducts = [];
  const prodNames = ['Nước suối', 'Sting', 'Redbull', 'Cầu Yonex', 'Cầu Hải Yến', 'Quấn cán', 'Vợt Victor', 'Giày Lining', 'Túi vợt', 'Băng cổ tay', 'Băng đầu gối', 'Sữa tươi', 'Bánh ngọt', 'Kẹo ổi', 'Áo cầu lông', 'Quần đùi', 'Tất thể thao', 'Phấn bột', 'Cước đan vợt', 'Lưới', 'Ron vợt', 'Balo', 'Dép', 'Khăn', 'Bình nước'];
  for (let i = 0; i < 25; i++) {
    const prod = await prisma.product.create({
      data: {
        name: prodNames[i],
        unit: i < 3 ? 'Chai' : (i < 5 ? 'Ống' : 'Cái'),
        price: (i + 1) * 20000,
        status: 'active'
      }
    });
    allProducts.push(prod);
  }

  console.log('📉 6. Tạo dữ liệu Timeline 30 ngày (Booking, Invoice, Stock)...');
  const warehouseStaff = allStaff.filter(s => s.position === 'Nhân viên kho');
  const cashierStaff = allStaff.filter(s => s.position === 'Thu ngân');
  const now = new Date();

  for (let d = 0; d < 30; d++) {
    const date = new Date();
    date.setDate(now.getDate() - d);
    date.setHours(8, 0, 0, 0);

    // --- A. Phiếu nhập (1-3 phiếu/ngày) ---
    const receiptsCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < receiptsCount; j++) {
      // Đảm bảo sản phẩm không trùng trong 1 phiếu nhập
      const usedProductIds = new Set();
      const detailsCount = Math.floor(Math.random() * 4) + 2;
      const details = [];

      while (details.length < detailsCount) {
        const pId = allProducts[Math.floor(Math.random() * 25)].id;
        if (!usedProductIds.has(pId)) {
          usedProductIds.add(pId);
          details.push({
            productId: pId,
            quantity: Math.floor(Math.random() * 50) + 10,
            unitPrice: Math.floor(Math.random() * 100000) + 10000,
            unit: 'Cái'
          });
        }
      }

      await prisma.stockReceipt.create({
        data: {
          date: date,
          staffId: warehouseStaff[j % warehouseStaff.length].id,
          supplierId: allSuppliers[Math.floor(Math.random() * 10)].id,
          details: { create: details }
        }
      });
    }

    // --- B. Booking (30-60 booking/ngày) ---
    const slots = [8, 9, 10, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21];
    const bookingCount = Math.floor(Math.random() * 31) + 30;
    for (let j = 0; j < bookingCount; j++) {
      const selectedCourt = allCourts[Math.floor(Math.random() * 19)]; // Tránh sân 20 bảo trì
      const startHour = slots[Math.floor(Math.random() * slots.length)];

      const startTime = new Date(date);
      startTime.setHours(startHour, 0, 0, 0);
      const endTime = new Date(date);
      endTime.setHours(startHour + 1, 30, 0, 0); // 1.5h slot

      const customer = allCustomers[Math.floor(Math.random() * 100)];
      const cashier = cashierStaff[Math.floor(Math.random() * 2)];

      const booking = await prisma.booking.create({
        data: {
          bookingDate: date,
          customerId: customer.id,
          staffId: cashier.id,
          deposit: 50000,
          details: {
            create: {
              courtId: selectedCourt.id,
              date: date,
              startTime: startTime,
              endTime: endTime
            }
          }
        }
      });

      // --- C. Hóa đơn (Phần lớn booking -> hóa đơn) ---
      const courtType = await prisma.courtType.findUnique({ where: { id: selectedCourt.typeId } });
      const courtAmount = courtType.hourlyPrice * 1.5;

      // Randomly buy products too
      const itemsCount = Math.floor(Math.random() * 3);
      const productDetails = [];
      let prodSum = 0;
      const usedProductIds = new Set();

      while (productDetails.length < itemsCount) {
        const p = allProducts[Math.floor(Math.random() * 25)];
        if (!usedProductIds.has(p.id)) {
          usedProductIds.add(p.id);
          const qty = Math.floor(Math.random() * 3) + 1;
          productDetails.push({
            productId: p.id,
            unitPrice: p.price,
            amount: p.price * qty
          });
          prodSum += p.price * qty;
        }
      }

      await prisma.invoice.create({
        data: {
          invoiceDate: date,
          paymentMethod: Math.random() > 0.3 ? 'cash' : 'bank_transfer',
          totalAmount: courtAmount + prodSum,
          staffId: cashier.id,
          customerId: customer.id,
          bookingId: booking.id,
          details: {
            create: [
              {
                courtId: selectedCourt.id,
                startTime: startTime,
                endTime: endTime,
                hourlyPrice: courtType.hourlyPrice,
                amount: courtAmount
              },
              ...productDetails
            ]
          }
        }
      });
    }

    // --- D. Bán lẻ (10-20 hóa đơn lẻ mỗi ngày) ---
    const retailCount = Math.floor(Math.random() * 11) + 10;
    for (let j = 0; j < retailCount; j++) {
      const cashier = cashierStaff[Math.floor(Math.random() * 2)];
      const customer = Math.random() > 0.5 ? allCustomers[Math.floor(Math.random() * 100)] : null;

      const p = allProducts[Math.floor(Math.random() * 25)];
      const qty = Math.floor(Math.random() * 5) + 1;
      const total = p.price * qty;

      await prisma.invoice.create({
        data: {
          invoiceDate: date,
          paymentMethod: 'cash',
          totalAmount: total,
          staffId: cashier.id,
          customerId: customer?.id || null,
          details: {
            create: [
              {
                productId: p.id,
                unitPrice: p.price,
                amount: total
              }
            ]
          }
        }
      });
    }

    // --- D. Chấm công ---
    for (const s of allStaff) {
      await prisma.attendance.create({
        data: {
          staffId: s.id,
          timeIn: new Date(date.setHours(8, 0, 0, 0)),
          timeOut: new Date(date.setHours(17, 0, 0, 0)),
          hoursWorked: 8
        }
      });
    }
  }

  console.log('🏆 7. Khởi tạo Khuyến mãi & Bonus & Lòng tin (Feedback)...');
  await prisma.promotion.createMany({
    data: [
      { name: 'Khai trương giảm 20%', type: 'Percentage', value: 20, startDate: now, endDate: new Date(now.getTime() + 86400000 * 30) },
      { name: 'Tặng 50k', type: 'Fixed', value: 50000, startDate: now, endDate: new Date(now.getTime() + 86400000 * 30) },
      { name: 'Happy Hour', type: 'Percentage', value: 10, startDate: now, endDate: new Date(now.getTime() + 86400000 * 30) },
    ]
  });

  const feedbackComments = [
    "Sân tuyệt vời, ánh sáng rất tốt!",
    "Giá cả hợp lý, nhân viên thân thiện.",
    "Sẽ quay lại lần sau, rất hài lòng.",
    "Hơi nóng một chút nhưng sân rất sạch.",
    "Dịch vụ đặt sân qua app rất nhanh chóng."
  ];

  for (let i = 0; i < 20; i++) {
    await prisma.feedback.create({
      data: {
        customerName: `Khách hàng ${Math.floor(Math.random() * 50) + 1}`,
        rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        comment: feedbackComments[Math.floor(Math.random() * feedbackComments.length)],
        courtName: `Sân ${Math.floor(Math.random() * 19) + 1}`,
        likes: Math.floor(Math.random() * 20),
        date: new Date(now.getTime() - Math.random() * 10 * 86400000) // Last 10 days
      }
    });
  }

  for (const s of allStaff) {
    if (s.id % 2 === 0) {
      await prisma.bonusPenalty.create({
        data: { staffId: s.id, type: 'Bonus', amount: 200000, reason: 'Chăm chỉ' }
      });
    }
    await prisma.monthlySalary.create({
      data: {
        staffId: s.id,
        monthYear: '03/2026',
        totalHours: 176,
        mainSalary: 8000000,
        bonusPenalty: 200000
      }
    });
  }

  console.log('✅ HOÀN THÀNH SEED DỮ LIỆU KHỔNG LỒ!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
