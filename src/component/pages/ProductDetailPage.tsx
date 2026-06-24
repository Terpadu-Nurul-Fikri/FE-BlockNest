import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronRight, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { authService } from "../../lib/authService";
import { API_BASE_URL } from "../../lib/apiConfig";
import Navbar from "../ui/Navbar";
import Seo from "../ui/Seo";

interface ProductImage {
  id: string;
  imageUrl: string;
  imageAlt: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  price: number;
  subCategory: string | null;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  stockQuantity: number;
  category: { label: string; slug: string } | null;
  images: ProductImage[];
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMsg, setCartMsg] = useState("");

  useEffect(() => {
    if (!slug) return;

    let active = true;
    setLoading(true);
    setError("");

    fetch(`${API_BASE_URL}/api/products/${slug}`)
      .then(async (res) => {
        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.message || "Produk tidak ditemukan");
        }
        return res.json();
      })
      .then((json) => {
        if (!active) return;
        setProduct(json.data);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Gagal memuat produk");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    setQuantity(1);
    setSelectedImageIndex(0);
  }, [slug]);

  const handleAddToCart = async () => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }
    if (!product) return;

    setAddingToCart(true);
    try {
      await addToCart(product.slug, quantity);
      setCartMsg("✓ Ditambahkan ke cart!");
      setTimeout(() => setCartMsg(""), 2500);
    } catch (err: any) {
      setCartMsg(err.message || "Gagal menambah ke cart");
      setTimeout(() => setCartMsg(""), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!authService.isAuthenticated()) {
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
            subCategory: product.subCategory,
            images: product.images.map((img) => ({
              imageUrl: img.imageUrl,
              imageAlt: img.imageAlt,
            })),
          },
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-10 animate-pulse">
            <div className="aspect-square bg-stone-200 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-4 bg-stone-200 rounded w-1/4" />
              <div className="h-6 bg-stone-200 rounded w-3/4" />
              <div className="h-8 bg-stone-200 rounded w-1/3" />
              <div className="h-4 bg-stone-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-stone-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h1 className="text-2xl font-light text-stone-900 mb-2">
            {error || "Produk tidak ditemukan"}
          </h1>
          <p className="text-stone-500 mb-6">
            Produk yang kamu cari mungkin sudah tidak tersedia.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-700 transition-colors cursor-pointer"
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  const images = product.images.length > 0
    ? product.images
    : [{ id: "empty", imageUrl: "", imageAlt: product.name, isPrimary: true, sortOrder: 0 }];

  const mainImage = images[selectedImageIndex] || images[0];
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(product.price);
  const inStock = product.stockQuantity > 0;

  return (
    <>
      <Seo
        title={`${product.name} — BlockNest`}
        description={`${product.name} — ${formattedPrice}`}
        canonical={`/products/${product.slug}`}
      />
      <div className="min-h-screen bg-stone-50 font-sans antialiased">
        {cartMsg && (
          <div className="fixed top-20 right-4 z-[100] px-4 py-3 bg-stone-900 text-white text-sm rounded-xl shadow-lg animate-[fadeIn_0.2s_ease-out]">
            {cartMsg}
          </div>
        )}

        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs text-stone-400">
              <li>
                <Link to="/" className="hover:text-stone-900 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="w-3 h-3" />
              </li>
              {product.category && (
                <>
                  <li>
                    <Link
                      to={`/${product.category.slug}`}
                      className="hover:text-stone-900 transition-colors"
                    >
                      {product.category.label}
                    </Link>
                  </li>
                  <li aria-hidden="true">
                    <ChevronRight className="w-3 h-3" />
                  </li>
                </>
              )}
              <li className="text-stone-900 font-medium" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 shadow-sm">
                {mainImage.imageUrl ? (
                  <img
                    src={mainImage.imageUrl}
                    alt={mainImage.imageAlt || product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <ShoppingBag className="w-20 h-20" />
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0 border-2 transition-colors cursor-pointer ${
                        idx === selectedImageIndex
                          ? "border-stone-900"
                          : "border-transparent hover:border-stone-300"
                      }`}
                    >
                      {img.imageUrl ? (
                        <img
                          src={img.imageUrl}
                          alt={img.imageAlt || product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category */}
              {product.subCategory && (
                <p className="text-[11px] text-stone-400 uppercase tracking-[0.15em] font-medium">
                  {product.subCategory}
                </p>
              )}

              {/* Name */}
              <h1 className="text-2xl md:text-3xl font-light text-stone-900 tracking-tight">
                {product.name}
              </h1>

              {/* Rating */}
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
                <span className="text-sm text-stone-500">
                  {product.rating.toFixed(1)}
                </span>
                {product.reviewCount > 0 && (
                  <span className="text-sm text-stone-400">
                    ({product.reviewCount} ulasan)
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="text-3xl font-semibold text-stone-900">
                {formattedPrice}
              </div>

              {/* Stock */}
              <div className="text-sm">
                {inStock ? (
                  <span className="text-green-600">
                    Stok tersedia: {product.stockQuantity} unit
                  </span>
                ) : (
                  <span className="text-red-500">Stok habis</span>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-stone-100" />

              {/* Quantity Selector */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-stone-900">Jumlah</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Kurangi jumlah"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-lg font-medium text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) => Math.min(product.stockQuantity, q + 1))
                    }
                    disabled={quantity >= product.stockQuantity}
                    className="w-10 h-10 rounded-xl border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    aria-label="Tambah jumlah"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="text-sm text-stone-500">
                Subtotal:{" "}
                <span className="font-semibold text-stone-900">
                  ${(product.price * quantity).toLocaleString()}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock || addingToCart}
                  className="flex-1 py-3.5 border border-stone-900 text-stone-900 rounded-xl text-sm font-medium hover:bg-stone-100 disabled:bg-stone-200 disabled:border-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {addingToCart ? "Menambahkan..." : "Add to Cart"}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className="flex-1 py-3.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-700 disabled:bg-stone-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
