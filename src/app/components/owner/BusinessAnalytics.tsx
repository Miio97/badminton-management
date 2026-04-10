import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Activity,
  Package,
} from "lucide-react";

export function BusinessAnalytics() {
  const monthlyRevenue = [
    { month: "T1", value: 45000000 },
    { month: "T2", value: 52000000 },
    { month: "T3", value: 48000000 },
    { month: "T4", value: 51000000 },
    { month: "T5", value: 56000000 },
    { month: "T6", value: 53000000 },
  ];

  const courtPerformance = [
    { name: "Sân 1", usage: 95, revenue: 8500000 },
    { name: "Sân 2", usage: 92, revenue: 8200000 },
    { name: "Sân 3", usage: 88, revenue: 10500000 },
    { name: "Sân 4", usage: 86, revenue: 10200000 },
    { name: "Sân 5", usage: 90, revenue: 8000000 },
    { name: "Sân 6", usage: 85, revenue: 7800000 },
    { name: "Sân 7", usage: 80, revenue: 12000000 },
    { name: "Sân 8", usage: 78, revenue: 11700000 },
    { name: "Sân 9", usage: 75, revenue: 9000000 },
  ];

  const topProducts = [
    { name: "Nước uống", sold: 1245, revenue: 8500000, growth: 12 },
    { name: "Vợt cầu lông", sold: 89, revenue: 6200000, growth: 8 },
    { name: "Quả cầu", sold: 234, revenue: 4800000, growth: 15 },
    { name: "Phụ kiện", sold: 156, revenue: 3100000, growth: -3 },
    { name: "Giày thể thao", sold: 45, revenue: 2700000, growth: 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Kinh doanh</h2>
        <p className="text-gray-600">Phân tích chi tiết về doanh thu và hiệu suất</p>
      </div>

      {/* Biểu đồ doanh thu */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Biểu đồ doanh thu</h3>
            <p className="text-sm text-gray-600">6 tháng gần nhất</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 rounded-lg">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="space-y-4">
          {monthlyRevenue.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 w-12">
                  {item.month}
                </span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-8">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-8 rounded-full flex items-center justify-end pr-3 transition-all"
                      style={{ width: `${(item.value / 60000000) * 100}%` }}
                    >
                      <span className="text-xs font-medium text-white">
                        {((item.value / 60000000) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-800 w-28 text-right">
                  {(item.value / 1000000).toFixed(1)}M đ
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Tổng doanh thu</p>
            <p className="text-2xl font-bold text-gray-800">305M đ</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Trung bình/tháng</p>
            <p className="text-2xl font-bold text-gray-800">50.8M đ</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Tăng trưởng</p>
            <p className="text-2xl font-bold text-green-600">+12%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiệu suất sân */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Hiệu suất sân</h3>
              <p className="text-sm text-gray-600">Tỷ lệ sử dụng và doanh thu</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <div className="space-y-4">
            {courtPerformance.map((court, index) => (
              <div key={index} className="border-b pb-3 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800">
                    {court.name}
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {court.usage}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${court.usage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 w-24 text-right">
                    {(court.revenue / 1000000).toFixed(1)}M đ
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tỷ lệ sử dụng trung bình</p>
                <p className="text-2xl font-bold text-blue-600">85%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-800">86.9M đ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sản phẩm bán chạy */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Sản phẩm bán chạy</h3>
              <p className="text-sm text-gray-600">Top 5 sản phẩm</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-lg">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-800">
                      {product.name}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-xs font-medium ${
                      product.growth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <TrendingUp
                      className={`w-3 h-3 ${
                        product.growth < 0 ? "rotate-180" : ""
                      }`}
                    />
                    <span>{Math.abs(product.growth)}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Đã bán</p>
                    <p className="text-lg font-bold text-gray-800">
                      {product.sold.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600">Doanh thu</p>
                    <p className="text-lg font-bold text-emerald-600">
                      {(product.revenue / 1000000).toFixed(1)}M đ
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng sản phẩm đã bán</p>
                <p className="text-2xl font-bold text-gray-800">1,769</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-emerald-600">25.3M đ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
