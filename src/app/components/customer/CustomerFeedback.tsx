import { useState, useEffect } from "react";
import { Star, Send, ThumbsUp, MessageSquare, Loader2, User } from "lucide-react";
import { landingService, ReviewItem, ReviewStats } from "../../../services/landingService";
import { apiClient } from "../../api";
import { toast } from "sonner";

interface Feedback {
  id: number;
  rating: number;
  comment: string;
  date: string;
  response?: string;
  likes: number;
}

// Type local mapping
interface FeedbackItem extends ReviewItem {
  response?: string;
}

const mockFeedbacks: FeedbackItem[] = []; // Now fetching from API

export function CustomerFeedback() {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ avgRating: 0, totalReviews: 0, satisfiedPct: 0 });
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await landingService.getReviews();
      setFeedbacks(data.reviews);
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá!");
      return;
    }
    if (!comment.trim()) {
      toast.error("Vui lòng nhập nhận xét của bạn!");
      return;
    }

    setSubmitting(true);
    try {
      // Assuming endpoint POST /api/crud/feedbacks exists via autoCrud
      // Or we can create a specific endpoint. For now, let's use the actual DB write
      await apiClient.post('/crud/feedbacks', {
        rating,
        comment,
        customerName: JSON.parse(localStorage.getItem('user') || '{}').fullName || 'Khách hàng',
        date: new Date().toISOString(),
        likes: 0
      });
      
      toast.success("Cảm ơn bạn đã gửi phản hồi!");
      setRating(0);
      setComment("");
      fetchData(); // Refresh list
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error("Không thể gửi đánh giá, vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      const target = feedbacks.find(f => f.id === id);
      if (!target) return;
      
      await apiClient.put(`/crud/feedbacks/${id}`, {
        likes: (target.likes || 0) + 1
      });
      
      // Update local state for instant feedback
      setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, likes: (f.likes || 0) + 1 } : f));
    } catch (err) {
      console.error("Failed to like feedback:", err);
    }
  };

  const renderStars = (count: number, interactive: boolean = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => setRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
            disabled={!interactive}
            className={`${interactive ? "cursor-pointer" : "cursor-default"}`}
          >
            <Star
              className={`w-6 h-6 ${
                star <= (interactive ? hoveredRating || rating : count)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const averageRating =
    feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Feedback</h2>
        <p className="text-gray-600">Chia sẻ trải nghiệm của bạn với chúng tôi</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Rating Overview & Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Rating Overview */}
          <div className="bg-gradient-to-br from-[#00d9b8] to-[#00c4a7] rounded-lg shadow-lg p-6 text-white min-h-[160px] flex flex-col justify-center">
            {loading ? (
              <div className="flex justify-center"><Loader2 className="animate-spin w-8 h-8 opacity-50" /></div>
            ) : (
              <>
                <p className="text-sm opacity-90 mb-2">Đánh giá trung bình</p>
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-5xl font-bold">{stats.avgRating.toFixed(1)}</p>
                  <div>
                    {renderStars(Math.round(stats.avgRating))}
                    <p className="text-xs opacity-75 mt-1">{stats.totalReviews} đánh giá</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Rating Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = feedbacks.filter((f) => f.rating === stars).length;
                const total = stats.totalReviews || 1;
                const percentage = (count / total) * 100;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-sm w-8">{stars}★</span>
                    <div className="flex-1 bg-white/20 rounded-full h-2 text-white">
                      <div
                        className="bg-white h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Gửi đánh giá</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đánh giá của bạn *
                </label>
                {renderStars(rating, true)}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhận xét *
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d9b8] resize-none"
                  placeholder="Chia sẻ trải nghiệm của bạn..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#00d9b8] text-white rounded-lg hover:bg-[#00c4a7] transition-colors disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Feedback List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Đánh giá từ khách hàng ({feedbacks.length})
            </h3>

            <div className="space-y-6">
              {loading ? (
                <div className="py-20 flex flex-col items-center text-gray-400">
                  <Loader2 className="animate-spin w-12 h-12 mb-4 opacity-20" />
                  <p>Đang tải đánh giá...</p>
                </div>
              ) : feedbacks.length > 0 ? (
                feedbacks.map((feedback) => (
                  <div key={feedback.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{feedback.name}</p>
                          {renderStars(feedback.rating)}
                          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                            {new Date(feedback.date).toLocaleDateString("vi-VN")} {feedback.courtName && ` • ${feedback.courtName}`}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleLike(feedback.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all border border-gray-100"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{feedback.likes || 0}</span>
                      </button>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed pl-13">{feedback.comment}</p>

                    {feedback.response && (
                      <div className="bg-gray-50 border-l-4 border-[#00d9b8] rounded-r-lg p-4 ml-13 mt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-[#00d9b8]" />
                          <span className="text-xs font-bold text-gray-800 uppercase tracking-tight">
                            Phản hồi từ quản lý
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed italic">"{feedback.response}"</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-20 text-gray-400">Chưa có đánh giá nào.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
