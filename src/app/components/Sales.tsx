import { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Search,
  Package,
  CreditCard,
  User as UserIcon,
  Star,
  Phone,
  Loader2,
} from "lucide-react";
import { PaymentDialog } from "./SalesPaymentDialog";
import { useEffect } from "react";
import { apiClient } from "../api";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  points: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
}



export function Sales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/products?status=active');
        // API trả về { data: [...], total, page, limit }
        const rawProducts = response.data?.data || response.data || [];
        setProducts(rawProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category || p.unit || 'Sản phẩm',
          price: p.price,
          stock: p.stock ?? p.quantity ?? 999,
        })));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ["Tất cả", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tất cả" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(
          cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + change;
            if (newQuantity <= 0) return null;
            if (newQuantity > item.stock) return item;
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

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handlePaymentSuccess = () => {
    setCart([]);
    setShowPaymentDialog(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Bán hàng</h2>
        <p className="text-gray-600">Bán sản phẩm và dịch vụ cho khách hàng</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Search and Filter */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => addToCart(product)}
                >
                  <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg p-2 mb-3 flex items-center justify-center group-hover:from-emerald-100 group-hover:to-blue-100 transition-colors h-32 overflow-hidden relative">
                    {product.name.toLowerCase().includes('vợt') ? (
                      <img src="/assets/images/product-racket.png" alt={product.name} className="w-full h-full object-cover rounded-md group-hover:scale-110 transition-transform duration-500" />
                    ) : product.name.toLowerCase().includes('cầu') ? (
                      <img src="/assets/images/product-shuttlecock.png" alt={product.name} className="w-full h-full object-cover rounded-md group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <Package className="w-12 h-12 text-emerald-600" />
                    )}
                  </div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2 line-clamp-2 h-10">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-emerald-600">
                      {product.price.toLocaleString("vi-VN")}đ
                    </span>
                    <span className="text-xs text-gray-500">SL: {product.stock}</span>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>Không tìm thấy sản phẩm nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
                Giỏ hàng
              </h3>
              {cart.length > 0 && (
                <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {getTotalItems()}
                </span>
              )}
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>Giỏ hàng trống</p>
                <p className="text-sm mt-2">Thêm sản phẩm để bắt đầu</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-gray-800 mb-1">
                            {item.name}
                          </h4>
                          <p className="text-sm text-emerald-600 font-medium">
                            {item.price.toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-gray-800">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-semibold">
                      {getTotalAmount().toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-gray-800">Tổng cộng:</span>
                    <span className="text-emerald-600">
                      {getTotalAmount().toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => setShowPaymentDialog(true)}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 rounded-lg font-semibold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Thanh toán
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      {showPaymentDialog && (
        <PaymentDialog
          items={cart}
          totalAmount={getTotalAmount()}
          onClose={() => setShowPaymentDialog(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}