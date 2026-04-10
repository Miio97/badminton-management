import { useState } from "react";
import { Settings, Save, Clock, DollarSign, MapPin, Bell } from "lucide-react";

export function SystemSettings() {
  const [settings, setSettings] = useState({
    businessName: "BADMINTON CENTER",
    businessAddress: "123 Đường ABC, Quận 1, TP.HCM",
    businessPhone: "028 1234 5678",
    businessEmail: "info@badmintoncenter.com",
    openTime: "06:00",
    closeTime: "23:00",
    peakHourStart: "18:00",
    peakHourEnd: "21:00",
    peakHourMultiplier: 1.2,
    taxRate: 10,
    currency: "VND",
    autoBackup: true,
    backupTime: "02:00",
    emailNotifications: true,
    smsNotifications: false,
  });

  const handleSave = () => {
    alert("Cài đặt đã được lưu thành công!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Cài đặt hệ thống</h2>
            <p className="text-gray-600">Cấu hình thông số toàn hệ thống</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors"
          >
            <Save className="w-5 h-5" />
            Lưu cài đặt
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#00d9b8]" />
            Thông tin doanh nghiệp
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên doanh nghiệp
              </label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) =>
                  setSettings({ ...settings, businessName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ
              </label>
              <input
                type="text"
                value={settings.businessAddress}
                onChange={(e) =>
                  setSettings({ ...settings, businessAddress: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={settings.businessPhone}
                onChange={(e) =>
                  setSettings({ ...settings, businessPhone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.businessEmail}
                onChange={(e) =>
                  setSettings({ ...settings, businessEmail: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#00d9b8]" />
            Giờ hoạt động
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giờ mở cửa
                </label>
                <input
                  type="time"
                  value={settings.openTime}
                  onChange={(e) =>
                    setSettings({ ...settings, openTime: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giờ đóng cửa
                </label>
                <input
                  type="time"
                  value={settings.closeTime}
                  onChange={(e) =>
                    setSettings({ ...settings, closeTime: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giờ cao điểm
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  value={settings.peakHourStart}
                  onChange={(e) =>
                    setSettings({ ...settings, peakHourStart: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
                <input
                  type="time"
                  value={settings.peakHourEnd}
                  onChange={(e) =>
                    setSettings({ ...settings, peakHourEnd: e.target.value })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hệ số giờ cao điểm
              </label>
              <input
                type="number"
                step="0.1"
                value={settings.peakHourMultiplier}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    peakHourMultiplier: parseFloat(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
              />
              <p className="text-xs text-gray-600 mt-1">
                Giá sẽ được nhân với hệ số này trong giờ cao điểm
              </p>
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-[#00d9b8]" />
            Cài đặt tài chính
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thuế VAT (%)
              </label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) =>
                  setSettings({ ...settings, taxRate: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đơn vị tiền tệ
              </label>
              <select
                value={settings.currency}
                onChange={(e) =>
                  setSettings({ ...settings, currency: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
              >
                <option value="VND">VND - Việt Nam Đồng</option>
                <option value="USD">USD - US Dollar</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#00d9b8]" />
            Cài đặt hệ thống
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Tự động backup</p>
                <p className="text-sm text-gray-600">
                  Backup dữ liệu tự động hàng ngày
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoBackup}
                  onChange={(e) =>
                    setSettings({ ...settings, autoBackup: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d9b8]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d9b8]"></div>
              </label>
            </div>

            {settings.autoBackup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian backup
                </label>
                <input
                  type="time"
                  value={settings.backupTime}
                  onChange={(e) =>
                    setSettings({ ...settings, backupTime: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Thông báo Email</p>
                <p className="text-sm text-gray-600">
                  Gửi thông báo qua email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      emailNotifications: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d9b8]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d9b8]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Thông báo SMS</p>
                <p className="text-sm text-gray-600">Gửi thông báo qua SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.smsNotifications}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      smsNotifications: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#00d9b8]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00d9b8]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
