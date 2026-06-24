import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, CheckCircle, ArrowLeft } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { authService } from "../../lib/authService";
import { API_BASE_URL } from "../../lib/apiConfig";

interface BuyNowItem {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    subCategory?: string;
    images: { imageUrl: string; imageAlt?: string }[];
  };
}

interface CheckoutItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    name: string;
    price: string;
    subCategory?: string;
    images: { imageUrl: string; imageAlt?: string }[];
  };
}

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = authService.isAuthenticated();

  const buyNowItem = (location.state as { buyNowItem?: BuyNowItem } | null)
    ?.buyNowItem ?? null;

  const isBuyNow = buyNowItem !== null;

  const displayItems: CheckoutItem[] = isBuyNow
    ? [
        {
          id: buyNowItem.productId,
          productId: buyNowItem.productId,
          quantity: buyNowItem.quantity,
          product: buyNowItem.product,
        },
      ]
    : items;

  const displayTotalPrice = displayItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0,
  );

  const displayTotalItems = displayItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const [form, setForm] = useState({
    shippingAddress: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  if (displayItems.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
            <Link to="/" className="text-xl font-semibold tracking-tight text-stone-900">
              Block<span className="text-stone-400">Nest</span>
            </Link>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h1 className="text-2xl font-light text-stone-900 mb-2">Cart kosong</h1>
            <p className="text-stone-500 mb-6">Tambahkan produk dulu sebelum checkout.</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-700 transition-colors cursor-pointer"
            >
              Mulai Belanja
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
            <Link to="/" className="text-xl font-semibold tracking-tight text-stone-900">
              Block<span className="text-stone-400">Nest</span>
            </Link>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-stone-900 mb-2">Order Berhasil!</h1>
            <p className="text-stone-500 mb-2">Terima kasih atas pesanan kamu.</p>
            <p className="text-xs text-stone-400 mb-6 font-mono">Order ID: {orderId.slice(0, 8)}...</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-700 transition-colors cursor-pointer"
              >
                Kembali ke Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.shippingAddress.trim()) {
      setError("Alamat pengiriman wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const token = authService.getToken();
      const orderItems = displayItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: form.shippingAddress,
          notes: form.notes || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal membuat order");
      }

      const json = await res.json();
      setOrderId(json.data.id);

      // Only clear cart if this was a Cart checkout, not Buy Now
      if (!isBuyNow) {
        await clearCart();
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight text-stone-900">
            Block<span className="text-stone-400">Nest</span>
          </Link>
          <Link
            to={isBuyNow && buyNowItem ? `/products/${buyNowItem.product.slug}` : "/cart"}
            className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {isBuyNow ? "Kembali ke Produk" : "Kembali ke Cart"}
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-light text-stone-900 mb-8">
          Checkout {isBuyNow && "(Buy Now)"}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-medium text-stone-900 mb-4">Alamat Pengiriman</h2>
              <textarea
                value={form.shippingAddress}
                onChange={(e) => setForm((f) => ({ ...f, shippingAddress: e.target.value }))}
                placeholder="Masukkan alamat lengkap (jalan, kota, kode pos)..."
                rows={4}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none"
                required
              />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-medium text-stone-900 mb-4">Catatan (opsional)</h2>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Catatan tambahan untuk pesanan..."
                rows={2}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-700 disabled:bg-stone-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {loading ? "Memproses..." : `Buat Pesanan — $${displayTotalPrice.toLocaleString()}`}
            </button>
          </form>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-base font-medium text-stone-900 mb-4">
                Ringkasan ({displayTotalItems} item)
              </h2>
              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {displayItems.map((item) => {
                  const image = item.product.images?.[0];
                  const price = parseFloat(item.product.price);
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                        {image ? (
                          <img src={image.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-stone-900 truncate">{item.product.name}</p>
                        <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-stone-900 shrink-0">
                        ${(price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-stone-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>${displayTotalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Pengiriman</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between font-semibold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total</span>
                  <span>${displayTotalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
