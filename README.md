# 🏸 BADMINTON CENTER - Hệ thống Quản lý Sân Cầu Lông

Ứng dụng quản lý sân cầu lông toàn diện với React, TypeScript và Tailwind CSS.

## 📋 Mục lục
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Tài khoản demo](#tài-khoản-demo)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Tính năng](#tính-năng)

## 🖥️ Yêu cầu hệ thống

Trước khi bắt đầu, đảm bảo máy tính của bạn đã cài đặt:

- **Node.js** phiên bản 18.x trở lên ([Tải tại đây](https://nodejs.org/))
- **npm** hoặc **pnpm** (pnpm được khuyến nghị)

### Kiểm tra phiên bản đã cài:
```bash
node --version   # Nên >= 18.0.0
npm --version    # Nên >= 9.0.0
```

## 📦 Cài đặt

### Bước 1: Clone hoặc tải dự án về máy

Nếu bạn có Git:
```bash
git clone <repository-url>
cd badminton-center
```

Hoặc giải nén file ZIP đã tải về và mở terminal tại thư mục dự án.

### Bước 2: Cài đặt dependencies

**Sử dụng npm:**
```bash
npm install
```

**Hoặc sử dụng pnpm (khuyến nghị):**
```bash
# Cài pnpm nếu chưa có
npm install -g pnpm

# Cài đặt dependencies
pnpm install
```

⏱️ Quá trình này có thể mất 2-5 phút tùy tốc độ mạng.

## 🚀 Chạy ứng dụng

### Development mode (Chế độ phát triển)

**Sử dụng npm:**
```bash
npm run dev
```

**Sử dụng pnpm:**
```bash
pnpm dev
```

Ứng dụng sẽ chạy tại: **http://localhost:5173**

Mở trình duyệt và truy cập địa chỉ trên để sử dụng.

### Build cho production

```bash
# Sử dụng npm
npm run build

# Hoặc pnpm
pnpm build
```

File build sẽ được tạo trong thư mục `dist/`

## 👥 Tài khoản demo

Hệ thống có 6 loại tài khoản với quyền hạn khác nhau:

### 1. 👨‍💼 Admin (18/18 quyền)
```
Username: admin
Password: admin123
```
**Quyền truy cập:**
- Dashboard Admin
- Phân quyền hệ thống
- Nhật ký hoạt động
- Cài đặt hệ thống
- Quản lý đăng nhập

### 2. 👔 Chủ sân (11/18 quyền)
```
Username: owner
Password: owner123
```
**Quyền truy cập:**
- Dashboard tổng quan kinh doanh
- Phân tích doanh thu
- Phê duyệt (sân, giá, lương, nhập kho)
- Lịch sử giao dịch
- Quản lý đánh giá

### 3. 📊 Quản lý (12/18 quyền)
```
Username: manager
Password: manager123
```
**Quyền truy cập:**
- Dashboard quản lý
- Quản lý sân
- Quản lý nhân viên
- Quản lý lương
- Feedback khách hàng
- Chương trình Loyalty

### 4. 📦 Nhân viên kho (4/18 quyền)
```
Username: warehouse
Password: warehouse123
```
**Quyền truy cập:**
- Dashboard kho
- Quản lý sản phẩm
- Quản lý nhà cung cấp
- Nhập hàng (yêu cầu phê duyệt)

### 5. 💰 Nhân viên thu ngân (7/18 quyền)
```
Username: cashier
Password: cashier123
```
**Quyền truy cập:**
- Vận hành sân
- Bán hàng
- Đặt sân
- Lịch sử hóa đơn
- Chăm sóc khách hàng
- Thanh toán tích hợp

### 6. 🎾 Khách hàng (2/18 quyền)
```
Username: customer
Password: customer123
```
**Quyền truy cập:**
- Đặt sân
- Xem khuyến mãi
- Gửi feedback
- Chat hỗ trợ

## 🎨 Thiết kế

- **Theme chính**: Mirage (#1a1d23) - Sidebar
- **Accent color**: Cyan (#00d9b8) - Highlight
- **UI Style**: Modern với gradient cards và hover effects
- **Framework**: Tailwind CSS v4 + Radix UI

## 📁 Cấu trúc dự án

```
badminton-center/
├── src/
│   ├── app/
│   │   ├── components/       # Các components React
│   │   │   ├── admin/       # Components cho Admin
│   │   │   ├── owner/       # Components cho Chủ sân
│   │   │   ├── manager/     # Components cho Quản lý
│   │   │   ├── warehouse/   # Components cho Kho
│   │   │   ├── cashier/     # Components cho Thu ngân
│   │   │   ├── customer/    # Components cho Khách hàng
│   │   │   └── ui/          # UI components (Radix UI)
│   │   ├── contexts/        # React Contexts (AuthContext)
│   │   ├── routes.tsx       # Cấu hình routing
│   │   └── App.tsx          # Component gốc
│   ├── styles/              # CSS files
│   │   ├── index.css
│   │   ├── theme.css
│   │   ├── tailwind.css
│   │   └── fonts.css
│   └── imports/             # Assets (images, SVGs)
├── package.json
├── vite.config.ts
└── README.md
```

## ✨ Tính năng chính

### 🔐 Hệ thống phân quyền
- 6 vai trò người dùng với quyền hạn riêng biệt
- Protected routing theo role
- AuthContext quản lý authentication

### 💼 Module Chủ sân
- Dashboard phân tích kinh doanh
- Hệ thống phê duyệt đa cấp
  - ✅ Phê duyệt lương nhân viên
  - ✅ Phê duyệt nhập hàng
  - ✅ Phê duyệt thay đổi giá
  - ✅ Phê duyệt thêm/xóa sân
- Lịch sử giao dịch
- Quản lý review

### 📊 Module Quản lý
- Dashboard tổng quan
- Quản lý sân cầu lông
- Quản lý nhân viên
- Hệ thống tính lương
- Quản lý feedback
- Chương trình khách hàng thân thiết

### 📦 Module Kho
- Dashboard tồn kho
- Quản lý sản phẩm
- Quản lý nhà cung cấp
- Nhập hàng (có workflow phê duyệt)

### 💰 Module Thu ngân
- Vận hành sân realtime
- Thanh toán tích hợp
  - Thanh toán tiền sân
  - Bán sản phẩm kèm
  - Áp dụng mã giảm giá
  - Tích điểm tự động
- Quản lý đặt sân
- Bán hàng tại quầy
- Chăm sóc khách hàng

### 🎾 Module Khách hàng
- Đặt sân online
- Xem khuyến mãi
- Gửi feedback
- Chat hỗ trợ

### 🛡️ Module Admin
- Dashboard admin
- Quản lý phân quyền chi tiết
- Nhật ký hoạt động
- Cài đặt hệ thống
- Quản lý đăng nhập

## 🔧 Scripts có sẵn

```json
{
  "dev": "vite",           // Chạy development server
  "build": "vite build",   // Build cho production
  "preview": "vite preview" // Preview bản build
}
```

## ⚠️ Lưu ý

1. **Hot Module Replacement (HMR)**: Khi chỉnh sửa code, trình duyệt sẽ tự động reload
2. **Port**: Mặc định là 5173, nếu port bị chiếm sẽ tự động chuyển sang port khác
3. **Mock Data**: Ứng dụng hiện dùng mock data, chưa kết nối database thực

## 🐛 Khắc phục sự cố

### Port 5173 đã được sử dụng
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

### Lỗi khi cài đặt dependencies
```bash
# Xóa node_modules và cài lại
rm -rf node_modules
rm package-lock.json  # hoặc pnpm-lock.yaml
npm install  # hoặc pnpm install
```

### Lỗi "Cannot find module"
```bash
# Clear cache và rebuild
npm run build
```

## 📱 Trình duyệt được hỗ trợ

- ✅ Chrome (khuyến nghị)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 🛠️ Tech Stack

- **Frontend**: React 18.3 + TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Routing**: React Router v7
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)
- **Build Tool**: Vite 6
- **Package Manager**: pnpm (khuyến nghị)

## 📞 Hỗ trợ

Nếu gặp vấn đề khi chạy ứng dụng, vui lòng:
1. Kiểm tra lại các bước cài đặt
2. Đảm bảo Node.js phiên bản >= 18
3. Xóa `node_modules` và cài lại

---

**Chúc bạn sử dụng ứng dụng thành công! 🎉**
