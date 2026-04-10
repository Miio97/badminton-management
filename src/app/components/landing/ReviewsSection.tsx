import { motion } from "motion/react";
import { Star, Quote, ThumbsUp } from "lucide-react";
import { useState, useEffect } from "react";
import { landingService, ReviewItem, ReviewStats } from "../../../services/landingService";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hôm nay";
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
  return `${Math.floor(diffDays / 365)} năm trước`;
}

export function ReviewsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ avgRating: 0, totalReviews: 0, satisfiedPct: 0 });

  useEffect(() => {
    landingService.getReviews().then(data => {
      setReviews(data.reviews);
      setStats(data.stats);
    });
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const visibleReviews = reviews.length >= 3
    ? [
        reviews[currentIndex % reviews.length],
        reviews[(currentIndex + 1) % reviews.length],
        reviews[(currentIndex + 2) % reviews.length],
      ]
    : reviews;

  return (
    <section id="reviews" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-4">
            <Star className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Đánh giá</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {stats.totalReviews > 0
              ? `${stats.totalReviews} khách hàng đã đánh giá dịch vụ của chúng tôi`
              : "Hơn 10,000 khách hàng hài lòng với dịch vụ và chất lượng của chúng tôi"}
          </p>
        </motion.div>

        {/* Reviews Carousel */}
        {reviews.length > 0 ? (
          <div className="relative">
            <div className="grid md:grid-cols-3 gap-6">
              {visibleReviews.map((review, index) => (
                <motion.div
                  key={`${review.id}-${index}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="relative h-full p-6 rounded-2xl bg-gradient-to-br from-white to-emerald-50/30 border border-slate-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    {/* Quote Icon */}
                    <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Quote className="w-16 h-16 text-emerald-600" />
                    </div>

                    {/* Rating + Court tag */}
                    <div className="flex items-center flex-wrap gap-2 mb-4">
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                      {review.courtName && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                          {review.courtName}
                        </span>
                      )}
                    </div>

                    {/* Comment */}
                    <p className="text-slate-700 leading-relaxed mb-6 relative z-10">
                      "{review.comment}"
                    </p>

                    {/* User Info */}
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500 p-0.5">
                          <img
                            src={review.avatar}
                            alt={review.name}
                            className="w-full h-full rounded-full bg-white"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{review.name}</p>
                          <p className="text-sm text-slate-500">{timeAgo(review.date)}</p>
                        </div>
                      </div>
                      {review.likes > 0 && (
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{review.likes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-emerald-600 w-8"
                      : "bg-slate-300 hover:bg-emerald-400 w-2.5"
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
          </div>
        )}

        {/* Overall Rating Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-2xl"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-4xl font-bold text-white">{stats.avgRating > 0 ? `${stats.avgRating}/5` : '—'}</p>
              <p className="text-emerald-100">Đánh giá trung bình</p>
              <div className="flex justify-center space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(stats.avgRating) ? 'text-yellow-300 fill-yellow-300' : 'text-white/40'}`}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-white">
                {stats.totalReviews > 0 ? stats.totalReviews.toLocaleString('vi-VN') : '—'}
              </p>
              <p className="text-emerald-100">Tổng đánh giá</p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-bold text-white">
                {stats.satisfiedPct > 0 ? `${stats.satisfiedPct}%` : '—'}
              </p>
              <p className="text-emerald-100">Khách hàng hài lòng</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
