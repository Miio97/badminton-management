import { useState, useEffect } from "react";
import {
  MessageCircle,
  Search,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  User as UserIcon,
  Phone,
  Calendar,
  MapPin,
} from "lucide-react";
import { Consultation, Message } from "../../../types/Cashier";
import { cashierService } from "../../../services/cashierService";

export function CustomerConsultation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "completed">(
    "all"
  );
  const [isSending, setIsSending] = useState(false);

  const fetchConsultations = async () => {
    try {
      const data = await cashierService.getConsultations();
      setConsultations(data);
      // Update selected consultation if it exists to refresh messages
      if (selectedConsultation) {
        const updatedSelected = data.find((c: Consultation) => c.id === selectedConsultation.id);
        if (updatedSelected) {
          setSelectedConsultation(updatedSelected);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [selectedConsultation?.id]);

  const filteredConsultations = consultations.filter((consultation) => {
    const matchesSearch =
      consultation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.phone.includes(searchTerm);
    const matchesFilter = filter === "all" || consultation.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Chờ xử lý
          </span>
        );
      case "in-progress":
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Đang tư vấn
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Hoàn thành
          </span>
        );
      default:
        return null;
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedConsultation || isSending) return;
    setIsSending(true);
    try {
      await cashierService.replyConsultation(selectedConsultation.id, messageInput);
      setMessageInput("");
      fetchConsultations(); // reload to get new message
    } catch (err) {
      console.error("Lỗi gửi tin nhắn", err);
      alert("Lỗi khi gửi tin nhắn");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Hỗ trợ tư vấn khách hàng
        </h2>
        <p className="text-gray-600">Tư vấn đặt sân và dịch vụ cho khách hàng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Chờ xử lý</p>
          <p className="text-3xl font-bold">
            {consultations.filter((c) => c.status === "pending").length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Đang tư vấn</p>
          <p className="text-3xl font-bold">
            {consultations.filter((c) => c.status === "in-progress").length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Hoàn thành</p>
          <p className="text-3xl font-bold">
            {consultations.filter((c) => c.status === "completed").length}
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#00d9b8] to-[#00c4a7] rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <MessageCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm opacity-90 mb-1">Tổng cuộc tư vấn</p>
          <p className="text-3xl font-bold">{consultations.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Consultation List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Filter Tabs */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === "all"
                      ? "bg-[#00d9b8] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === "pending"
                      ? "bg-[#00d9b8] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Chờ
                </button>
                <button
                  onClick={() => setFilter("in-progress")}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === "in-progress"
                      ? "bg-[#00d9b8] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Đang xử lý
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>
            </div>

            {/* Consultation Cards */}
            <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
              {filteredConsultations.map((consultation) => (
                <div
                  key={consultation.id}
                  onClick={() => setSelectedConsultation(consultation)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    selectedConsultation?.id === consultation.id
                      ? "border-[#00d9b8] bg-[#00d9b8]/5"
                      : "border-gray-200 hover:border-[#00d9b8]/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-[#00d9b8]/10 flex items-center justify-center text-[#00d9b8] font-bold">
                        {consultation.customerName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-sm">
                          {consultation.customerName}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {consultation.phone}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(consultation.status)}
                  </div>

                  <div className="space-y-1 text-xs text-gray-600">
                    <p className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {consultation.date} - {consultation.time}
                    </p>
                    <p className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {consultation.duration} - {consultation.courtType}
                    </p>
                  </div>

                  {consultation.messages.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {consultation.messages[consultation.messages.length - 1].content}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {filteredConsultations.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Không có yêu cầu tư vấn</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Consultation Details & Chat */}
        <div className="lg:col-span-2">
          {selectedConsultation ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-[700px]">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#00d9b8]/10 flex items-center justify-center text-[#00d9b8] font-bold text-lg">
                      {selectedConsultation.customerName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {selectedConsultation.customerName}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {selectedConsultation.phone}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(selectedConsultation.status)}
                </div>

                {/* Booking Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Ngày đặt</p>
                    <p className="text-sm font-bold text-gray-800">
                      {selectedConsultation.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Giờ đặt</p>
                    <p className="text-sm font-bold text-gray-800">
                      {selectedConsultation.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Thời lượng</p>
                    <p className="text-sm font-bold text-gray-800">
                      {selectedConsultation.duration}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Loại sân</p>
                    <p className="text-sm font-bold text-gray-800">
                      {selectedConsultation.courtType}
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {selectedConsultation.notes && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-600 mb-1 font-medium">
                      Ghi chú:
                    </p>
                    <p className="text-sm text-blue-800">
                      {selectedConsultation.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {selectedConsultation.messages.map((message: Message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "cashier" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender === "cashier"
                          ? "bg-[#00d9b8] text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === "cashier"
                            ? "text-white/70"
                            : "text-gray-500"
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    placeholder="Nhập tin nhắn tư vấn..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isSending}
                    className="px-6 py-3 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                    {isSending ? "Đang gửi..." : "Gửi"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[700px] flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Chọn cuộc tư vấn để xem chi tiết</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
