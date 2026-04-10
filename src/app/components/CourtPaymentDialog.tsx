import { useState, useEffect } from "react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  Search,
  Star,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle,
  Clock,
  Play,
  Phone,
  User as UserIcon,
  ShoppingCart,
  Tag,
  Printer,
  QrCode,
} from "lucide-react";

import { Court } from "../../types/Booking";
import { Product, CartItem, Customer, DiscountCode } from "../../types/Cashier";
import { cashierService } from "../../services/cashierService";

interface CourtPaymentDialogProps {
  court: Court;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentMethod = "cash" | "transfer" | "qr";

export function CourtPaymentDialog({ court, onClose, onSuccess }: CourtPaymentDialogProps) {
  // Generate ISO timestamp for start time
  const getStartTimeISO = () => {
    if (court.currentBooking?.startTime) {
      const [hours, minutes] = court.currentBooking.startTime.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return date.toISOString();
    }
    return new Date().toISOString();
  };

  const [startTime] = useState(getStartTimeISO());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showProductList, setShowProductList] = useState(false);
  const [searchProduct, setSearchProduct] = useState("");
  
  // Customer
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Discount
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Court price per hour - in real app could come from court.price
  const COURT_PRICE_PER_HOUR = court.price || 80000;

  // Update time every second and fetch initial data
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    cashierService.getProducts().then(setProducts);

    return () => clearInterval(interval);
  }, []);

  // Customer search debouncing
  useEffect(() => {
    const fn = setTimeout(() => {
      if (showCustomerSearch) {
        cashierService.searchCustomers(customerSearchQuery).then(setCustomers);
      }
    }, 300);
    return () => clearTimeout(fn);
  }, [customerSearchQuery, showCustomerSearch]);

  // Calculate play duration
  const getPlayDuration = () => {
    const start = new Date(startTime);
    const diff = currentTime.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds, totalHours: diff / (1000 * 60 * 60) };
  };

  const duration = getPlayDuration();

  // Calculate court fee
  const getCourtFee = () => {
    return Math.ceil(duration.totalHours * COURT_PRICE_PER_HOUR);
  };

  // Cart functions
  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setShowProductList(false);
    setSearchProduct("");
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + change;
            if (newQuantity <= 0) return null;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Discount functions
  const applyDiscount = async () => {
    if (!discountCode) return;
    try {
      const discount = await cashierService.validateDiscountCode(discountCode);
      if (discount) {
        setAppliedDiscount(discount);
      } else {
        alert("Mã giảm giá không hợp lệ!");
      }
    } catch (err) {
      alert("Lỗi khi kiểm tra mã giảm giá");
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
  };

  // Calculate totals
  const getSubtotal = () => {
    const courtFee = getCourtFee();
    const productsFee = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return courtFee + productsFee;
  };

  const getDiscountAmount = () => {
    const subtotal = getSubtotal();
    let amount = 0;
    
    // Discount code
    if (appliedDiscount) {
      if (appliedDiscount.type === "fixed") {
        amount += appliedDiscount.value;
      } else {
        amount += (subtotal * appliedDiscount.value) / 100;
      }
    }
    
    // Customer loyalty discount
    if (selectedCustomer) {
      amount += (subtotal * selectedCustomer.discount) / 100;
    }
    
    return amount;
  };

  const getTotal = () => {
    return Math.max(0, getSubtotal() - getDiscountAmount());
  };

  // Calculate points to earn
  const calculatePoints = () => {
    return Math.floor(getTotal() / 10000);
  };

  // Customer functions
  const filteredCustomers = customers;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "from-purple-500 to-purple-600";
      case "gold":
        return "from-yellow-500 to-yellow-600";
      case "silver":
        return "from-gray-400 to-gray-500";
      case "bronze":
        return "from-orange-600 to-orange-700";
      default:
        return "from-gray-400 to-gray-500";
    }
  };

  const getTierName = (tier: string) => {
    switch (tier) {
      case "platinum":
        return "Bạch kim";
      case "gold":
        return "Vàng";
      case "silver":
        return "Bạc";
      case "bronze":
        return "Đồng";
      default:
        return tier;
    }
  };

  // Payment
  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      await cashierService.processPayment({
        courtId: court.id,
        duration,
        total: getTotal(),
        customerId: selectedCustomer?.id,
        discountId: appliedDiscount?.code,
        cart,
        method: paymentMethod
      });

      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      alert("Thanh toán thất bại");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const invoiceNumber = `INV-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")}`;

  // Success screen
  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Thanh toán thành công!
            </h3>
            <p className="text-gray-600 mb-4">
              {court.name} đã được thanh toán
            </p>
            {selectedCustomer && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 mb-1">
                  Đã cộng điểm cho {selectedCustomer.name}
                </p>
                <p className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
                  +{calculatePoints()}
                  <Star className="w-6 h-6 fill-green-600" />
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#00d9b8] to-[#00c4a7] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Thanh toán</h3>
              <p className="text-sm opacity-90">{court.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Left Column - Booking Info & Products */}
            <div className="lg:col-span-2 space-y-6">
              {/* 🟢 (1) Booking Info */}
              <div className="bg-white border-2 border-[#00d9b8] rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2">
                    <Play className="w-5 h-5 text-[#00d9b8]" />
                    Thông tin phiên chơi
                  </h4>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    ĐANG CHƠI
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Mã hóa đơn</p>
                    <p className="font-bold text-gray-800">{invoiceNumber}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Bắt đầu</p>
                    <p className="font-bold text-gray-800">
                      {new Date(startTime).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Hiện tại</p>
                    <p className="font-bold text-gray-800">
                      {currentTime.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="bg-[#00d9b8]/10 rounded-lg p-3 border-2 border-[#00d9b8]">
                    <p className="text-xs text-gray-500 mb-1">Tổng thời gian</p>
                    <p className="font-bold text-[#00d9b8] flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {duration.hours}h {duration.minutes}m {duration.seconds}s
                    </p>
                  </div>
                </div>
              </div>

              {/* 🔵 (2) Products & Services */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-[#00d9b8]" />
                    Dịch vụ & sản phẩm
                  </h4>
                  <button
                    onClick={() => setShowProductList(!showProductList)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm sản phẩm
                  </button>
                </div>

                {/* Product Quick Add */}
                {showProductList && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchProduct}
                        onChange={(e) => setSearchProduct(e.target.value)}
                        placeholder="Tìm sản phẩm..."
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8] text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => addToCart(product)}
                          className="p-2 bg-white border border-gray-200 rounded-lg hover:border-[#00d9b8] hover:bg-[#00d9b8]/5 transition-colors text-left"
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-[#00d9b8] font-bold">
                            {product.price.toLocaleString()}đ
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-2">
                  {/* Court Fee */}
                  <div className="flex items-center justify-between p-3 bg-[#00d9b8]/5 rounded-lg border border-[#00d9b8]/30">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Tiền sân</p>
                      <p className="text-xs text-gray-500">
                        {COURT_PRICE_PER_HOUR.toLocaleString()}đ/giờ × {duration.totalHours.toFixed(2)}h
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#00d9b8]">
                        {getCourtFee().toLocaleString()}đ
                      </p>
                    </div>
                  </div>

                  {/* Products */}
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.price.toLocaleString()}đ
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="w-24 text-right">
                        <p className="font-bold text-gray-800">
                          {(item.price * item.quantity).toLocaleString()}đ
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {cart.length === 0 && (
                    <div className="text-center py-6 text-gray-400 text-sm">
                      Chưa có sản phẩm nào
                    </div>
                  )}
                </div>
              </div>

              {/* 🎟️ Discount Code */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-orange-500" />
                  Mã giảm giá
                </h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                    placeholder="Nhập mã giảm giá..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                    disabled={!!appliedDiscount}
                  />
                  {appliedDiscount ? (
                    <button
                      onClick={removeDiscount}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      Hủy
                    </button>
                  ) : (
                    <button
                      onClick={applyDiscount}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      Áp dụng
                    </button>
                  )}
                </div>
                {appliedDiscount && (
                  <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800 font-medium">
                      ✓ {appliedDiscount.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Customer & Payment */}
            <div className="space-y-6">
              {/* 👤 Customer */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-[#00d9b8]" />
                  Khách hàng
                </h4>

                {!selectedCustomer ? (
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowCustomerSearch(!showCustomerSearch)}
                      className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5" />
                        <span>Tra cứu khách hàng</span>
                      </div>
                      <Search className="w-5 h-5" />
                    </button>

                    {showCustomerSearch && (
                      <div className="space-y-3">
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={customerSearchQuery}
                            onChange={(e) => setCustomerSearchQuery(e.target.value)}
                            placeholder="SĐT hoặc tên..."
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8] text-sm"
                          />
                        </div>

                        <div className="max-h-64 overflow-y-auto space-y-2">
                          {filteredCustomers.map((customer) => (
                            <button
                              key={customer.id}
                              onClick={() => {
                                setSelectedCustomer(customer);
                                setShowCustomerSearch(false);
                                setCustomerSearchQuery("");
                              }}
                              className="w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-[#00d9b8] hover:bg-[#00d9b8]/5 transition-colors text-left"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-[#00d9b8]/10 flex items-center justify-center text-[#00d9b8] font-bold text-sm">
                                    {customer.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm text-gray-800">
                                      {customer.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {customer.phone}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className={`px-2 py-1 rounded-full text-white text-xs font-bold bg-gradient-to-r ${getTierColor(
                                    customer.tier
                                  )}`}
                                >
                                  {getTierName(customer.tier)}
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">
                                  {customer.points.toLocaleString()} điểm
                                </span>
                                {customer.discount > 0 && (
                                  <span className="text-green-600 font-medium">
                                    Giảm {customer.discount}%
                                  </span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-center py-4 text-gray-400 text-sm">
                      Hoặc khách vãng lai
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#00d9b8]/5 border-2 border-[#00d9b8] rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#00d9b8]/10 flex items-center justify-center text-[#00d9b8] font-bold text-lg">
                          {selectedCustomer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">
                            {selectedCustomer.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedCustomer.phone}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCustomer(null)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-white rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500 mb-1">Hạng</p>
                        <div
                          className={`inline-block px-2 py-1 rounded-full text-white text-xs font-bold bg-gradient-to-r ${getTierColor(
                            selectedCustomer.tier
                          )}`}
                        >
                          {getTierName(selectedCustomer.tier)}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-2 text-center">
                        <p className="text-xs text-gray-500 mb-1">Điểm</p>
                        <p className="font-bold text-[#00d9b8] flex items-center justify-center gap-1">
                          <Star className="w-3 h-3 fill-[#00d9b8]" />
                          {selectedCustomer.points.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {selectedCustomer.discount > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-3">
                        <p className="text-xs text-green-800 font-medium text-center">
                          🎁 Ưu đãi thành viên: Giảm {selectedCustomer.discount}%
                        </p>
                      </div>
                    )}

                    {calculatePoints() > 0 && (
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-1">
                          Điểm sẽ nhận:
                        </p>
                        <p className="text-xl font-bold text-orange-600 flex items-center gap-2">
                          +{calculatePoints()}
                          <Star className="w-5 h-5 fill-orange-600" />
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 🟡 Payment Summary */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-bold text-gray-800 mb-3">Thanh toán</h4>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-medium">
                      {getSubtotal().toLocaleString()}đ
                    </span>
                  </div>
                  
                  {appliedDiscount && (
                    <div className="flex justify-between text-sm">
                      <span className="text-orange-600">Giảm giá (code):</span>
                      <span className="font-medium text-orange-600">
                        -
                        {appliedDiscount.type === "fixed"
                          ? appliedDiscount.value.toLocaleString()
                          : Math.floor(
                              (getSubtotal() * appliedDiscount.value) / 100
                            ).toLocaleString()}
                        đ
                      </span>
                    </div>
                  )}
                  
                  {selectedCustomer && selectedCustomer.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Ưu đãi thành viên:</span>
                      <span className="font-medium text-green-600">
                        -
                        {Math.floor(
                          (getSubtotal() * selectedCustomer.discount) / 100
                        ).toLocaleString()}
                        đ
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">Tổng cộng:</span>
                      <span className="text-3xl font-bold text-[#00d9b8]">
                        {getTotal().toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                </div>

                {/* 💰 Payment Method */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Phương thức thanh toán:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentMethod("cash")}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                        paymentMethod === "cash"
                          ? "border-[#00d9b8] bg-[#00d9b8]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Banknote className="w-6 h-6 text-green-600" />
                      <span className="text-xs font-medium">Tiền mặt</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("transfer")}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                        paymentMethod === "transfer"
                          ? "border-[#00d9b8] bg-[#00d9b8]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <CreditCard className="w-6 h-6 text-blue-600" />
                      <span className="text-xs font-medium">Chuyển khoản</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("qr")}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                        paymentMethod === "qr"
                          ? "border-[#00d9b8] bg-[#00d9b8]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <QrCode className="w-6 h-6 text-purple-600" />
                      <span className="text-xs font-medium">QR Code</span>
                    </button>
                  </div>
                </div>

                {/* 🔘 Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full px-4 py-3 bg-gradient-to-r from-[#00d9b8] to-[#00c4a7] text-white rounded-lg hover:from-[#00c4a7] hover:to-[#00b39a] transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      "Đang xử lý..."
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Thanh toán
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                      Hủy
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Printer className="w-4 h-4" />
                      In hóa đơn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}