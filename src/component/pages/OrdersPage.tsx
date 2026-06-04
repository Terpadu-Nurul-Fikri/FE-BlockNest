import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import Navbar from "../ui/Navbar";
import { authService } from "../../lib/authService";
import { API_BASE_URL } from "../../lib/apiConfig";

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  product: {
    id: string;
    name: string;
    images?: { imageUrl: string }[];
  };
}

interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: string;
  shippingAddress: string;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  PENDING:   { label: "Menunggu",    color: "bg-yellow-100 text-yellow-700" },
  PAID:      { label: "Dibayar",    color: "bg-blue-100 text-blue-700" },
  SHIPPED:   { label: "Dikirim",    color: "bg-indigo-100 text-indigo-700" },
  COMPLETED: { label: "Selesai",    color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Dibatalkan", color: "bg-red-100 text-red-700" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = authService.getToken();
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal memuat pesanan");
      const json = await res.json();
      setOrders(json.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!confirm("Yakin ingin membatalkan pesanan ini?")) return;
    try {
      const token = authService.getToken();
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal membatalkan pesanan");
      await fetchOrders();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal membatalkan");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-stone-400 mb-6">
          <Link to="/" className="hover:text-stone-700 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/profile" className="hover:text-stone-700 transition-colors">Akun</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-600">Pesanan</span>
        </nav>

        <div className="flex items-center gap-3 mb-8">
          <Package className="w-6 h-6 text-stone-400" />
          <div>
            <h1 className="text-2xl font-light text-stone-900">Pesanan Saya</h1>
            <p className="text-sm text-stone-400 mt-0.5">Riwayat semua pesanan kamu</p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-24">
            <ShoppingBag className="w-16 h-16 text-stone-200 mx-auto mb-4" />
            <h2 className="text-lg font-light text-stone-700 mb-2">Belum ada pesanan</h2>
            <p className="text-sm text-stone-400 mb-6">Yuk mulai belanja dan temukan furnitur impianmu.</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-700 transition-colors"
            >
              Mulai Belanja
            </Link>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = STATUS_CONFIG[order.status] ?? { label: order.status, color: "bg-stone-100 text-stone-600" };
              const isExpanded = expandedId === order.id;
              const total = parseFloat(order.totalAmount);
              const date = new Date(order.createdAt).toLocaleDateString("id-ID", {
                day: "numeric", month: "long", year: "numeric",
              });

              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {/* Order header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div>
                        <p className="text-xs text-stone-400 font-mono">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="text-sm font-medium text-stone-800 mt-0.5">{date}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-sm font-semibold text-stone-900">
                        Rp {total.toLocaleString("id-ID")}
                      </p>
                      <ChevronRight
                        className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                      />
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-stone-100 px-6 py-5">
                      {/* Items */}
                      <div className="space-y-3 mb-5">
                        {order.items.map((item) => {
                          const img = item.product.images?.[0];
                          return (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                                {img ? (
                                  <img src={img.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ShoppingBag className="w-4 h-4 text-stone-300" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-stone-800 truncate">{item.product.name}</p>
                                <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-medium text-stone-800 shrink-0">
                                Rp {(parseFloat(item.price) * item.quantity).toLocaleString("id-ID")}
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Shipping address */}
                      <div className="bg-stone-50 rounded-xl p-4 mb-4">
                        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                          Alamat Pengiriman
                        </p>
                        <p className="text-sm text-stone-700">{order.shippingAddress}</p>
                        {order.notes && (
                          <p className="text-xs text-stone-400 mt-1 italic">Catatan: {order.notes}</p>
                        )}
                      </div>

                      {/* Total */}
                      <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                        <span className="text-sm font-semibold text-stone-700">Total Pembayaran</span>
                        <span className="text-base font-bold text-stone-900">
                          Rp {total.toLocaleString("id-ID")}
                        </span>
                      </div>

                      {/* Cancel button */}
                      {order.status === "PENDING" && (
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="mt-4 w-full py-2.5 border border-red-200 text-red-600 text-sm font-medium rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Batalkan Pesanan
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
