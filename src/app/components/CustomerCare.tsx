import { useState } from "react";
import { Star, Send } from "lucide-react";

interface Review {
  id: number;
  customerName: string;
  courtName: string;
  rating: number;
  comment: string;
  date: string;
  reply?: string;
}

const mockReviews: Review[] = [
  {
    id: 1,
    customerName: "Nguyễn Văn A",
    courtName: "Sân 1",
    rating: 5,
    comment: "Sân đẹp, sạch sẽ, nhân viên phục vụ nhiệt tình. Tôi sẽ quay lại!",
    date: "2026-03-29",
  },
  {
    id: 2,
    customerName: "Trần Thị B",
    courtName: "Sân 3",
    rating: 4,
    comment: "Sân tốt, giá cả hợp lý. Tuy nhiên, thời gian chờ hơi lâu.",
    date: "2026-03-28",
  },
  {
    id: 3,
    customerName: "Lê Văn C",
    courtName: "Sân 2",
    rating: 5,
    comment: "Rất hài lòng với chất lượng sân và dịch vụ. Recommend!",
    date: "2026-03-27",
    reply: "Cảm ơn anh đã tin tùng và sử dụng dịch vụ của chúng tôi. Hẹn gặp lại!",
  },
  {
    id: 4,
    customerName: "Phạm Văn D",
    courtName: "Sân 5",
    rating: 3,
    comment: "Sân ổn nhưng đèn hơi tối, cần cải thiện ánh sáng.",
    date: "2026-03-26",
  },
  {
    id: 5,
    customerName: "Hoàng Thị E",
    courtName: "Sân 4",
    rating: 5,
    comment: "Tuyệt vời! Sân chất lượng cao, nhân viên thân thiện. 5 sao!",
    date: "2026-03-25",
    reply: "Cảm ơn chị rất nhiều! Rất vui vì chị hài lòng với dịch vụ của chúng tôi.",
  },
];

export function CustomerCare() {
  const [reviews, setReviews] = useState(mockReviews);
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});

  const handleReply = (reviewId: number) => {
    const reply = replyText[reviewId];
    if (!reply || !reply.trim()) return;

    setReviews(
      reviews.map((review) =>
        review.id === reviewId ? { ...review, reply: reply.trim() } : review
      )
    );

    setReplyText({ ...replyText, [reviewId]: "" });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const averageRating = (
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Chăm sóc khách hàng</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Tổng đánh giá</p>
              <p className="text-2xl font-bold text-emerald-600">{reviews.length}</p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <Star className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Đánh giá trung bình</p>
              <p className="text-2xl font-bold text-yellow-500">{averageRating} ⭐</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Cần phản hồi</p>
              <p className="text-2xl font-bold text-orange-600">
                {reviews.filter((r) => !r.reply).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                    {review.courtName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-500">{formatDate(review.date)}</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{review.comment}</p>

            {review.reply ? (
              <div className="bg-emerald-50 rounded-lg p-4 border-l-4 border-emerald-600">
                <p className="text-sm font-semibold text-emerald-900 mb-1">Phản hồi của bạn:</p>
                <p className="text-sm text-gray-700">{review.reply}</p>
              </div>
            ) : (
              <div className="border-t pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Trả lời đánh giá:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={replyText[review.id] || ""}
                    onChange={(e) =>
                      setReplyText({ ...replyText, [review.id]: e.target.value })
                    }
                    placeholder="Nhập phản hồi của bạn..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => handleReply(review.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                  >
                    <Send className="w-4 h-4" />
                    Gửi
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
