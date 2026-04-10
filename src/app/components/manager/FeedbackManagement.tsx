import { useState, useEffect } from "react";
import {
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Send,
  X,
  Star,
} from "lucide-react";

import { Feedback } from "../../../types/Manager";
import { managerService } from "../../../services/managerService";

export function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [responseText, setResponseText] = useState("");
  const [filter, setFilter] = useState<"all" | "complain" | "suggestion" | "praise">("all");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await managerService.getFeedbacks();
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRespond = async () => {
    if (selectedFeedback) {
      await managerService.replyFeedback(selectedFeedback.id, responseText);
      setShowResponseModal(false);
      setSelectedFeedback(null);
      setResponseText("");
      fetchData(); // reload
    }
  };

  const handleProcess = async (id: number) => {
    await managerService.updateFeedbackStatus(id, "processing");
    fetchData();
  };

  const openResponseModal = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setResponseText(feedback.response || "");
    setShowResponseModal(true);
  };

  const filteredFeedback =
    filter === "all" ? feedbacks : feedbacks.filter((fb) => fb.type === filter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "complain":
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "suggestion":
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case "praise":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "complain":
        return "Khiếu nại";
      case "suggestion":
        return "Đề xuất";
      case "praise":
        return "Khen ngợi";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "complain":
        return "bg-red-100 text-red-700";
      case "suggestion":
        return "bg-blue-100 text-blue-700";
      case "praise":
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Quản lý Feedback
        </h2>
        <p className="text-gray-600">Phân loại và xử lý phản hồi khách hàng</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Tổng feedback</p>
          <p className="text-2xl font-bold text-gray-800">{feedbacks.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Khiếu nại</p>
          <p className="text-2xl font-bold text-red-600">
            {feedbacks.filter((f) => f.type === "complain").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Chờ xử lý</p>
          <p className="text-2xl font-bold text-yellow-600">
            {feedbacks.filter((f) => f.status === "pending").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Đã xử lý</p>
          <p className="text-2xl font-bold text-green-600">
            {feedbacks.filter((f) => f.status === "resolved").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lọc theo loại
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-[#00d9b8] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("complain")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "complain"
                ? "bg-[#00d9b8] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Khiếu nại
          </button>
          <button
            onClick={() => setFilter("suggestion")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "suggestion"
                ? "bg-[#00d9b8] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Đề xuất
          </button>
          <button
            onClick={() => setFilter("praise")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "praise"
                ? "bg-[#00d9b8] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Khen ngợi
          </button>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-lg ${getTypeColor(feedback.type)}`}>
                  {getTypeIcon(feedback.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-800">
                      {feedback.customerName}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(
                        feedback.type
                      )}`}
                    >
                      {getTypeLabel(feedback.type)}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < feedback.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{feedback.message}</p>
                  {feedback.response && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-xs text-gray-500 mb-1">Phản hồi:</p>
                      <p className="text-sm text-gray-700">{feedback.response}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500">{feedback.date}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                {feedback.status === "pending" && (
                  <>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      Chờ xử lý
                    </span>
                    <button
                      onClick={() => handleProcess(feedback.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      Đang xử lý
                    </button>
                    <button
                      onClick={() => openResponseModal(feedback)}
                      className="px-3 py-1 bg-[#00d9b8] text-white rounded text-sm hover:bg-[#00c4a7]"
                    >
                      Trả lời
                    </button>
                  </>
                )}
                {feedback.status === "processing" && (
                  <>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      Đang xử lý
                    </span>
                    <button
                      onClick={() => openResponseModal(feedback)}
                      className="px-3 py-1 bg-[#00d9b8] text-white rounded text-sm hover:bg-[#00c4a7]"
                    >
                      Trả lời
                    </button>
                  </>
                )}
                {feedback.status === "resolved" && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Đã xử lý
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Trả lời {selectedFeedback.customerName}
              </h3>
              <button
                onClick={() => {
                  setShowResponseModal(false);
                  setSelectedFeedback(null);
                  setResponseText("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-800 mb-1">
                  Nội dung feedback:
                </p>
                <p className="text-sm text-gray-700">{selectedFeedback.message}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phản hồi của bạn
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Nhập phản hồi..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleRespond}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Gửi phản hồi
                </button>
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setSelectedFeedback(null);
                    setResponseText("");
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
