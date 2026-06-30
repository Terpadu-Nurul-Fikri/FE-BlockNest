import { useEffect, useState } from "react";
import { Star, Trash2, MessageSquare, Filter } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { reviewApi } from "../../lib/adminService";
import type { Review } from "../../lib/reviewService";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${rating} dari 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= rating ? "text-amber-400 fill-amber-400" : "text-stone-200 fill-stone-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterRating, setFilterRating] = useState<number>(0); // 0 = semua

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await reviewApi.getAll();
      setReviews(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat review");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus review ini?")) return;
    try {
      await reviewApi.delete(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus review");
    }
  };

  const filtered =
    filterRating === 0 ? reviews : reviews.filter((r) => r.rating === filterRating);

  const ratingCount = (rating: number) =>
    reviews.filter((r) => r.rating === rating).length;

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">Review</h1>
            <p className="text-sm text-stone-400 mt-1">{reviews.length} total review</p>
          </div>
          <button
            onClick={load}
            className="px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-700 hover:bg-stone-50 cursor-pointer"
          >
            Refresh
          </button>
        </div>

        {/* Rating filter pills */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
          <Filter className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <button
            onClick={() => setFilterRating(0)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              filterRating === 0
                ? "bg-stone-900 text-white"
                : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400"
            }`}
          >
            Semua ({reviews.length})
          </button>
          {[5, 4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRating(r)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                filterRating === r
                  ? "bg-stone-900 text-white"
                  : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400"
              }`}
            >
              <Star className="w-3 h-3 fill-current" />
              {r} ({ratingCount(r)})
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <MessageSquare className="w-12 h-12 text-stone-200 mx-auto mb-3" />
            <p className="text-stone-400 text-sm">
              {filterRating === 0 ? "Belum ada review" : `Tidak ada review bintang ${filterRating}`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((review) => {
              const date = new Date(review.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const userName =
                review.user?.name || review.user?.email || "User tidak diketahui";
              const productName = review.product?.name || "Produk tidak diketahui";

              return (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-start gap-4"
                >
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-sm font-semibold text-stone-500 shrink-0">
                    {userName.charAt(0).toUpperCase()}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-stone-800 truncate">{userName}</p>
                        <p className="text-xs text-stone-400 truncate">
                          Produk:{" "}
                          <span className="text-stone-600 font-medium">{productName}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-stone-300">{date}</span>
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-1.5 rounded-lg text-stone-300 hover:bg-red-50 hover:text-red-600 cursor-pointer transition-colors"
                          aria-label="Hapus review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-2">
                      <StarRating rating={review.rating} />
                      {review.comment && (
                        <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
