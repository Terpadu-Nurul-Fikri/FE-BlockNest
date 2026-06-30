import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  ArrowLeft,
  ShoppingBag,
  Check,
  AlertCircle,
  MessageSquare,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { formatIDR } from "../../lib/utils";
import Navbar from "../ui/Navbar";
import ActiveBanners from "../ui/ActiveBanners";
import Seo from "../ui/Seo";
import { useCart } from "../../context/CartContext";
import { reviewService } from "../../lib/reviewService";
import { API_BASE_URL } from "../../lib/apiConfig";

interface ProductImage {
  imageUrl: string;
  imageAlt?: string | null;
  isPrimary: boolean;
}

interface ProductCategory {
  id: string;
  label: string;
  slug: string;
}

interface DetailedProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  imageAlt: string;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  slug: string;
  categoryId: string | null;
  stockQuantity: number;
  images: ProductImage[];
  categoryDetail?: ProductCategory | null;
}

interface DetailedReview {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    photoUrl?: string | null;
  };
}

interface ReviewEligibility {
  isEligibleToReview: boolean;
  hasReviewed: boolean;
}

const DEFAULT_DESCRIPTION =
  "Designed in Oslo, this piece represents classic Scandinavian simplicity. Combining clean architectural lines with superb craftsmanship, it is made from honest, sustainably sourced solid wood and natural materials. Built to stand the test of time both structurally and aesthetically.";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [reviews, setReviews] = useState<DetailedReview[]>([]);
  const [eligibility, setEligibility] = useState<ReviewEligibility>({
    isEligibleToReview: false,
    hasReviewed: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartMsg, setCartMsg] = useState("");
  const [cartLoading, setCartLoading] = useState(false);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const token = localStorage.getItem("auth_token");
  const isLoggedIn = !!token;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    fetch(`${API_BASE_URL}/api/products/detail/${slug}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Gagal memuat detail produk");
        return json.data;
      })
      .then((data) => {
        if (!active) return;
        setProduct(data.product);
        setReviews(data.reviews);
        setEligibility(data.eligibility);
        if (data.product.images?.length > 0) {
          const primary =
            data.product.images.find((img: ProductImage) => img.isPrimary) ||
            data.product.images[0];
          setSelectedImage(primary.imageUrl);
        } else {
          setSelectedImage(data.product.imageUrl);
        }
      })
      .catch((err) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Gagal memuat detail produk";
        setError(message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug, token]);

  useEffect(() => {
    setQuantity(1);
  }, [slug]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!product) return;

    setCartLoading(true);
    try {
      await addToCart(product.id, quantity);
      setCartMsg(`${quantity} item berhasil ditambahkan ke keranjang!`);
      setTimeout(() => setCartMsg(""), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menambah ke keranjang";
      setCartMsg(message);
      setTimeout(() => setCartMsg(""), 3500);
    } finally {
      setCartLoading(false);
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (!product) return;

    navigate("/checkout", {
      state: {
        buyNowItem: {
          productId: product.id,
          quantity,
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: String(product.price),
            subCategory: product.categoryDetail?.label || product.category,
            images: product.images.map((img) => ({
              imageUrl: img.imageUrl,
              imageAlt: img.imageAlt,
            })),
          },
        },
      },
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (rating === 0) {
      setSubmitError("Harap pilih rating terlebih dahulu (1-5 bintang).");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      await reviewService.create({
        productId: product.id,
        rating,
        comment: comment.trim() || undefined,
      });

      setSubmitSuccess("Ulasan Anda berhasil dikirim!");
      setComment("");
      setRating(0);

      const res = await fetch(`${API_BASE_URL}/api/products/detail/${slug}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const json = await res.json();
      if (res.ok) {
        setProduct(json.data.product);
        setReviews(json.data.reviews);
        setEligibility(json.data.eligibility);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal mengirim ulasan";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="w-10 h-10 border-4 border-stone-300 border-t-stone-900 rounded-full animate-spin mx-auto" />
            <p className="text-sm text-stone-500">Memuat detail produk...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md px-4 space-y-6">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h2 className="text-2xl font-light text-stone-900">Produk Tidak Ditemukan</h2>
            <p className="text-stone-500 text-sm">
              {error || "Produk yang Anda cari tidak tersedia atau telah dihapus."}
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-stone-600 border-b border-stone-300 pb-0.5 hover:text-stone-900 hover:border-stone-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={`${product.name} - Norr Furniture`}
        description={DEFAULT_DESCRIPTION}
        canonical={`/product/${product.slug}`}
        ogImage={product.imageUrl}
      />
      <div className="min-h-screen bg-stone-50 font-sans antialiased text-stone-900">
        {cartMsg && (
          <div className="fixed top-20 right-4 z-[100] px-4 py-3 bg-stone-900 text-white text-sm rounded-xl shadow-lg animate-[fadeIn_0.2s_ease-out]">
            {cartMsg}
          </div>
        )}

        <ActiveBanners type="TOP_BAR" />
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-stone-400">
              <li>
                <Link to="/" className="hover:text-stone-900 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="w-3 h-3" />
              </li>
              <li>
                {product.categoryDetail ? (
                  <Link
                    to={`/${product.categoryDetail.slug}`}
                    className="hover:text-stone-900 transition-colors"
                  >
                    {product.categoryDetail.label}
                  </Link>
                ) : (
                  <span className="capitalize">{product.category || "Katalog"}</span>
                )}
              </li>
              <li aria-hidden="true">
                <ChevronRight className="w-3 h-3" />
              </li>
              <li className="text-stone-900 font-medium truncate" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
            <div className="lg:col-span-7 space-y-4">
              <div className="overflow-hidden rounded-2xl bg-stone-100 aspect-[4/5] shadow-sm relative border border-stone-200/50">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500"
                />
                {product.isNew && (
                  <span className="absolute top-6 left-6 px-3.5 py-1.5 bg-stone-900 text-white text-[10px] font-medium uppercase tracking-widest rounded-full shadow-lg">
                    New
                  </span>
                )}
              </div>

              {product.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <button
                      key={`${img.imageUrl}-${i}`}
                      onClick={() => setSelectedImage(img.imageUrl)}
                      className={`w-20 h-20 rounded-xl overflow-hidden bg-stone-100 border-2 shrink-0 transition-all ${
                        selectedImage === img.imageUrl
                          ? "border-stone-900 scale-[0.96] shadow-sm"
                          : "border-transparent hover:border-stone-300"
                      }`}
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.imageAlt || `${product.name} view ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-5 flex flex-col justify-start space-y-8">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
                  {product.categoryDetail?.label || product.category}
                </p>
                <h1 className="text-3xl md:text-4xl font-light tracking-tight leading-tight text-stone-900">
                  {product.name}
                </h1>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(product.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-stone-200 text-stone-200"
                        }`}
                      />
                    ))}
                  </div>
                  {product.reviewCount > 0 ? (
                    <span className="text-xs text-stone-500 font-medium">
                      {product.rating.toFixed(1)} ({product.reviewCount} ulasan)
                    </span>
                  ) : (
                    <span className="text-xs text-stone-400">Belum ada ulasan</span>
                  )}
                </div>
              </div>

              <div className="py-2 border-t border-b border-stone-100 flex items-center justify-between">
                <span className="text-2xl font-semibold text-stone-900">
                  {formatIDR(product.price)}
                </span>
                {product.stockQuantity > 0 ? (
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Ready Stock
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-rose-50 text-rose-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Habis
                  </span>
                )}
              </div>

              <p className="text-sm text-stone-500 leading-relaxed font-light">
                {DEFAULT_DESCRIPTION}
              </p>

              <div className="grid grid-cols-3 gap-4 pt-2 text-stone-500">
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-stone-100/50 border border-stone-200/20">
                  <Truck className="w-5 h-5 text-stone-700 mb-1" />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-stone-800">
                    Bebas Ongkir
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-stone-100/50 border border-stone-200/20">
                  <ShieldCheck className="w-5 h-5 text-stone-700 mb-1" />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-stone-800">
                    Garansi 5 Thn
                  </span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-xl bg-stone-100/50 border border-stone-200/20">
                  <RotateCcw className="w-5 h-5 text-stone-700 mb-1" />
                  <span className="text-[10px] font-medium uppercase tracking-wider text-stone-800">
                    30 Hari Retur
                  </span>
                </div>
              </div>

              {product.stockQuantity > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-stone-400 uppercase tracking-widest font-semibold">
                      Jumlah:
                    </span>
                    <div className="flex items-center border border-stone-200 rounded-xl bg-white">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3.5 py-2 text-stone-500 hover:text-stone-900 transition-colors disabled:opacity-40"
                        disabled={quantity <= 1}
                        aria-label="Kurangi jumlah"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm font-medium w-10 text-center select-none">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity((q) => Math.min(product.stockQuantity, q + 1))
                        }
                        className="px-3.5 py-2 text-stone-500 hover:text-stone-900 transition-colors disabled:opacity-40"
                        disabled={quantity >= product.stockQuantity}
                        aria-label="Tambah jumlah"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-stone-400 font-light">
                      Sisa {product.stockQuantity} buah
                    </span>
                  </div>

                  <div className="text-sm text-stone-500">
                    Subtotal:{" "}
                    <span className="font-semibold text-stone-900">
                      {formatIDR(product.price * quantity)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleAddToCart}
                      disabled={cartLoading}
                      className="w-full py-4 border border-stone-900 text-stone-900 hover:bg-stone-100 disabled:bg-stone-200 disabled:border-stone-200 disabled:text-stone-400 rounded-xl font-medium uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      {cartLoading ? "Menambahkan..." : "Tambah Keranjang"}
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-medium uppercase tracking-widest text-xs transition-all active:scale-[0.99] cursor-pointer"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  disabled
                  className="w-full py-4 bg-stone-200 text-stone-400 rounded-xl font-medium uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                >
                  Stok Habis
                </button>
              )}
            </div>
          </section>

          <hr className="border-stone-200 mb-16" />

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-24">
              <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-xs space-y-4">
                <h2 className="text-lg font-medium text-stone-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-stone-400" /> Ringkasan Ulasan
                </h2>

                <div className="flex items-center gap-6 py-4">
                  <div className="text-center">
                    <p className="text-4xl font-light text-stone-900">
                      {product.rating > 0 ? product.rating.toFixed(1) : "-"}
                    </p>
                    <p className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">
                      Rata-Rata Rating
                    </p>
                  </div>

                  <div className="flex-1 space-y-2 border-l border-stone-100 pl-6">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= Math.round(product.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-stone-200 text-stone-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-stone-500 font-light">
                      Berdasarkan {product.reviewCount} ulasan dari pelanggan yang sah.
                    </p>
                  </div>
                </div>
              </div>

              {isLoggedIn ? (
                <>
                  {eligibility.isEligibleToReview ? (
                    <>
                      {eligibility.hasReviewed ? (
                        <div className="bg-stone-100 border border-stone-200 p-5 rounded-2xl text-center space-y-2 text-stone-500">
                          <Check className="w-8 h-8 text-green-600 mx-auto" />
                          <h3 className="text-sm font-semibold text-stone-800">Ulasan Dikirim</h3>
                          <p className="text-xs">Anda sudah memberikan ulasan untuk produk ini.</p>
                        </div>
                      ) : (
                        <form
                          onSubmit={handleSubmitReview}
                          className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-xs space-y-5"
                        >
                          <h3 className="text-base font-medium text-stone-900">Tulis Ulasan Anda</h3>

                          {submitError && (
                            <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              <span>{submitError}</span>
                            </div>
                          )}

                          {submitSuccess && (
                            <div className="p-3 bg-green-50 text-green-700 text-xs rounded-xl flex items-center gap-2">
                              <Check className="w-4 h-4 shrink-0" />
                              <span>{submitSuccess}</span>
                            </div>
                          )}

                          <div className="space-y-1.5">
                            <span className="text-xs text-stone-400 uppercase tracking-widest font-semibold">
                              Rating Produk
                            </span>
                            <div className="flex items-center gap-1.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                                >
                                  <Star
                                    className={`w-6 h-6 transition-colors ${
                                      star <= (hoverRating || rating)
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-stone-100 text-stone-300"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label
                              htmlFor="review-comment"
                              className="text-xs text-stone-400 uppercase tracking-widest font-semibold block"
                            >
                              Komentar / Ulasan
                            </label>
                            <textarea
                              id="review-comment"
                              rows={4}
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Bagikan pengalaman Anda menggunakan produk ini..."
                              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 placeholder:text-stone-400 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-400 transition-shadow"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-3 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white rounded-xl text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer"
                          >
                            {submitting ? "Mengirim..." : "Kirim Ulasan"}
                          </button>
                        </form>
                      )}
                    </>
                  ) : (
                    <div className="bg-amber-50/70 border border-amber-100 p-5 rounded-2xl text-center space-y-2 text-amber-800">
                      <AlertCircle className="w-6 h-6 text-amber-600 mx-auto" />
                      <h3 className="text-sm font-medium">Ulasan Dikunci</h3>
                      <p className="text-xs font-light text-amber-700/90 leading-relaxed">
                        Hanya pelanggan yang telah membeli produk ini yang dapat memberikan ulasan.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-stone-100 p-6 rounded-2xl border border-stone-200 text-center space-y-3 text-stone-500">
                  <p className="text-xs font-light text-stone-600">
                    Ingin menulis ulasan? Silakan masuk ke akun Anda terlebih dahulu.
                  </p>
                  <Link
                    to="/login"
                    className="inline-block w-full py-2.5 bg-stone-950 hover:bg-stone-850 text-white rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors"
                  >
                    Login Sekarang
                  </Link>
                </div>
              )}
            </div>

            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-xl font-light text-stone-900 border-b border-stone-100 pb-3">
                Semua Ulasan ({reviews.length})
              </h2>

              {reviews.length > 0 ? (
                <div className="space-y-6 divide-y divide-stone-100">
                  {reviews.map((rev) => (
                    <article key={rev.id} className="pt-6 first:pt-0 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold shadow-xs select-none">
                            {getInitials(rev.user.name)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-stone-900">{rev.user.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3 h-3 ${
                                      star <= rev.rating
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-stone-100 text-stone-200"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-stone-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(rev.createdAt).toLocaleDateString("id-ID")}</span>
                        </div>
                      </div>

                      <p className="text-sm text-stone-600 leading-relaxed font-light pl-13">
                        {rev.comment || "Pelanggan tidak meninggalkan ulasan tertulis."}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center border border-dashed border-stone-200 rounded-2xl bg-stone-50/50">
                  <MessageSquare className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                  <p className="text-stone-400 text-sm font-light">Belum ada ulasan untuk produk ini.</p>
                </div>
              )}
            </div>
          </section>
        </main>

        <footer className="bg-stone-900 text-stone-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center text-xs">
            <p>&copy; 2026 Norr Furniture AS. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
