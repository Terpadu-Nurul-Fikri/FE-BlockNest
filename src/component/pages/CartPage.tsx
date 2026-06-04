import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { authService } from "../../lib/authService";

export default function CartPage() {
  const { items, totalItems, totalPrice, loading, updateItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  const isLoggedIn = authService.isAuthenticated();

  // Guest — redirect ke login
  if (!isLoggedIn) {
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
            <h1 className="text-2xl font-light text-stone-900 mb-2">Login untuk melihat cart</h1>
            <p className="text-stone-500 mb-6">Kamu perlu login dulu untuk menggunakan fitur cart.</p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-3 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-700 transition-colors cursor-pointer"
            >
              Login Sekarang
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-500">Memuat cart...</p>
      </div>
    );
  }

  // Cart kosong
  if (items.length === 0) {
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
            <h1 className="text-2xl font-light text-stone-900 mb-2">Cart kamu kosong</h1>
            <p className="text-stone-500 mb-6">Tambahkan produk dari halaman kategori.</p>
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

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Simple header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight text-stone-900">
            Block<span className="text-stone-400">Nest</span>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Lanjut Belanja
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-light text-stone-900">
            Shopping Cart{" "}
            <span className="text-stone-400 text-lg">({totalItems} item{totalItems > 1 ? "s" : ""})</span>
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
          >
            Kosongkan cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const image = item.product.images?.[0];
              const price = parseFloat(item.product.price);
              return (
                <div key={item.id} className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm">
                  {/* Product image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                    {image ? (
                      <img
                        src={image.imageUrl}
                        alt={image.imageAlt ?? item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <ShoppingBag className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-stone-400 uppercase tracking-widest mb-0.5">
                      {item.product.subCategory ?? "Product"}
                    </p>
                    <h3 className="text-sm font-medium text-stone-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm font-semibold text-stone-900 mt-1">
                      ${(price * item.quantity).toLocaleString()}
                      {item.quantity > 1 && (
                        <span className="text-xs text-stone-400 font-normal ml-1">
                          (${price.toLocaleString()} × {item.quantity})
                        </span>
                      )}
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => {
                          if (item.quantity <= 1) removeItem(item.productId);
                          else updateItem(item.productId, item.quantity - 1);
                        }}
                        className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                        aria-label="Kurangi jumlah"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.productId, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                        aria-label="Tambah jumlah"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => removeItem(item.productId)}
                        className="ml-auto text-stone-300 hover:text-rose-500 transition-colors cursor-pointer"
                        aria-label="Hapus item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-base font-medium text-stone-900 mb-4">Ringkasan Pesanan</h2>
              <div className="space-y-2 text-sm text-stone-600 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItems} item)</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pengiriman</span>
                  <span className="text-green-600">Gratis</span>
                </div>
              </div>
              <div className="border-t border-stone-100 pt-4 mb-6">
                <div className="flex justify-between font-semibold text-stone-900">
                  <span>Total</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full py-3.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-700 transition-colors cursor-pointer"
              >
                Lanjut ke Checkout
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full mt-3 py-3 text-stone-500 text-sm hover:text-stone-900 transition-colors cursor-pointer"
              >
                Lanjut Belanja
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
