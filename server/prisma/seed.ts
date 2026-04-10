import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu dọn dẹp và thêm dữ liệu mẫu (Seeding)...');

  // Làm sạch dữ liệu cũ theo thứ tự đúng để tránh lỗi khóa ngoại
  await prisma.attendance.deleteMany();
  await prisma.bonusPenalty.deleteMany();
  await prisma.monthlySalary.deleteMany();
  await prisma.invoiceDetail.deleteMany();
  await prisma.pointHistory.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.bookingDetail.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.stockReceiptDetail.deleteMany();
  await prisma.stockReceipt.deleteMany();
  await prisma.court.deleteMany();
  await prisma.courtType.deleteMany();
  await prisma.product.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.account.deleteMany();
  await prisma.salaryConfig.deleteMany();

  // 1. Cấu hình lương (SalaryConfig)
  const salary1 = await prisma.salaryConfig.create({
    data: { baseSalary: 5000000, hourlyRate: 25000, allowance: 500000 }
  });

  // 2. Tài khoản & Nhân viên (Account & Staff)
  const staff1 = await prisma.account.create({
    data: {
      username: 'admin',
      password: 'password123',
      role: 'admin',
      staff: {
        create: {
          fullName: 'Nguyễn Văn Quản Lý',
          position: 'Quản lý',
          phone: '0901234567',
          salaryConfigId: salary1.id
        }
      }
    }
  });

  const staff2 = await prisma.account.create({
    data: {
      username: 'tieptan',
      password: 'password123',
      role: 'staff',
      staff: {
        create: {
          fullName: 'Trần Thị Tiếp Tân',
          position: 'Tiếp tân',
          phone: '0909998887',
          salaryConfigId: salary1.id
        }
      }
    }
  });

  // 3. Khách hàng (Customer)
  const customer1 = await prisma.customer.create({
    data: {
      fullName: 'Lê Văn Khách',
      phone: '0987654321',
      email: 'khachhang1@gmail.com',
      points: 100,
      account: {
        create: {
          username: 'khachhang1',
          password: 'password123',
          role: 'customer'
        }
      }
    }
  });

  // 4. Loại sân & Sân (CourtType & Court)
  const typeVIP = await prisma.courtType.create({
    data: { name: 'Sân Thảm Xanh (VIP)', hourlyPrice: 120000 },
  });

  const typeNormal = await prisma.courtType.create({
    data: { name: 'Sân Thường', hourlyPrice: 80000 },
  });

  const court1 = await prisma.court.create({
    data: { name: 'Sân 1', status: 'available', typeId: typeVIP.id, notes: 'Gần cửa sổ' }
  });
  await prisma.court.createMany({
    data: [
      { name: 'Sân 2', status: 'available', typeId: typeVIP.id },
      { name: 'Sân 3', status: 'occupied', typeId: typeNormal.id },
      { name: 'Sân 4', status: 'maintenance', typeId: typeNormal.id },
    ]
  });

  // 5. Sản phẩm (Product)
  const product1 = await prisma.product.create({
    data: { name: 'Nước suối Aquafina', unit: 'Chai', price: 10000 }
  });
  await prisma.product.createMany({
    data: [
      { name: 'Sting dâu', unit: 'Chai', price: 15000 },
      { name: 'Quả cầu lông Yonex', unit: 'Ống', price: 100000 },
    ]
  });

  // 6. Nhà cung cấp (Supplier)
  const supplier1 = await prisma.supplier.create({
    data: { name: 'Đại lý Nước Giải Khát ABC', phone: '02833334444', address: 'Quận 1, TP.HCM' }
  });

  // 7. Khuyến mãi (Promotion)
  const promo1 = await prisma.promotion.create({
    data: {
      name: 'Chào hè rực rỡ',
      type: 'PERCENTAGE',
      value: 10,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      status: 'active'
    }
  });

  // 8. Phiếu nhập kho (StockReceipt)
  const receipt1 = await prisma.stockReceipt.create({
    data: {
      staffId: 1, // Nguyễn Văn Quản Lý
      supplierId: supplier1.id,
      notes: 'Nhập hàng tháng 1',
      details: {
        create: {
          productId: product1.id,
          quantity: 100,
          unitPrice: 7000,
          unit: 'Chai'
        }
      }
    }
  });

  // 9. Đặt sân (Booking)
  const booking1 = await prisma.booking.create({
    data: {
      customerId: customer1.id,
      staffId: 1,
      deposit: 50000,
      details: {
        create: {
          courtId: court1.id,
          date: new Date(),
          startTime: new Date(),
          endTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000) // 2 hours later
        }
      }
    }
  });

  // 10. Điểm danh (Attendance)
  await prisma.attendance.create({
    data: {
      staffId: 1,
      timeIn: new Date(),
      hoursWorked: 8
    }
  });

  console.log('Nạp dữ liệu mẫu cho TẤT CẢ các bảng thành công! 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
