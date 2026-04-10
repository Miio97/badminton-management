import { useState, useEffect } from "react";
import { Star, ThumbsUp, MessageSquare, TrendingUp, User, Loader2 } from "lucide-react";
import { apiClient } from "../../api";

interface Review {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
  courtName: string;
  likes: number;
}

export function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | "all">("all");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/crud/feedbacks');
      const data = (res.data as any).data || [];
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews =
    filterRating === "all"
      ? reviews
      : reviews.filter((r) => r.rating === filterRating);

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
    percentage: reviews.length > 0 ? (reviews.filter((r) => r.rating === stars).length / reviews.length) * 100 : 0,
  }));

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#00d9b8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Đánh giá</h2>
        <p className="text-gray-600">Review từ khách hàng và thống kê</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Rating Overview */}
        <div className="bg-gradient-to-br from-[#00d9b8] to-[#00c4a7] rounded-lg shadow-lg p-6 text-white">
          <p className="text-sm opacity-90 mb-2">Đánh giá trung bình</p>
          <div className="flex items-center gap-4 mb-4">
            <p className="text-5xl font-bold">{averageRating.toFixed(1)}</p>
            <div>
              {renderStars(Math.round(averageRating))}
              <p className="text-xs opacity-75 mt-1">{reviews.length} đánh giá</p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map((dist) => (
              <div key={dist.stars} className="flex items-center gap-2">
                <span className="text-sm w-8">{dist.stars}★</span>
                <div className="flex-1 bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all"
                    style={{ width: `${dist.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm w-8 text-right">{dist.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Tỷ lệ hài lòng</p>
            <p className="text-3xl font-bold text-gray-800">
              {(
                (reviews.filter((r) => r.rating >= 4).length / reviews.length) *
                100
              ).toFixed(0)}
              %
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {reviews.filter((r) => r.rating >= 4).length} khách hàng
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Tổng đánh giá</p>
            <p className="text-3xl font-bold text-gray-800">{reviews.length}</p>
            <p className="text-xs text-gray-500 mt-1">Tháng này</p>
          </div>
        </div>

        {/* Top Courts */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Sân được đánh giá cao
          </h3>
          <div className="space-y-3">
            {[
              { name: "Sân 7", rating: 4.8, reviews: 45 },
              { name: "Sân 5", rating: 4.7, reviews: 38 },
              { name: "Sân 1", rating: 4.6, reviews: 42 },
              { name: "Sân 8", rating: 4.5, reviews: 35 },
            ].map((court, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{court.name}</p>
                  <p className="text-xs text-gray-600">{court.reviews} đánh giá</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-800">{court.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lọc theo đánh giá
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterRating("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterRating === "all"
                ? "bg-[#00d9b8] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tất cả
          </button>
          {[5, 4, 3, 2, 1].map((stars) => (
            <button
              key={stars}
              onClick={() => setFilterRating(stars)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                filterRating === stars
                  ? "bg-[#00d9b8] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {stars} <Star className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Đánh giá từ khách hàng ({filteredReviews.length})
        </h3>

        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#00d9b8] rounded-full flex items-center justify-center text-white font-bold">
                    {review.customerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {review.customerName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating)}
                      <span className="text-xs text-gray-500">
                        {new Date(review.date).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                  {review.courtName}
                </span>
              </div>

              {/* Comment */}
              <p className="text-gray-800 mb-3 ml-13">{review.comment}</p>

              {/* Actions */}
              <div className="flex items-center gap-4 ml-13">
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#00d9b8] transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{review.likes}</span>
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-[#00d9b8] transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  <span>Phản hồi</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
