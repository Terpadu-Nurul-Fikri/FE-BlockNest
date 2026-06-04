import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Tag, ShoppingCart, TrendingUp, ArrowRight } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { productApi, categoryApi, orderApi } from "../../lib/adminService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productApi.getAll().catch(() => ({ data: [] })),
      categoryApi.getAll().catch(() => ({ data: [] })),
      orderApi.getAll().catch(() => ({ data: [] })),
    ]).then(([products, categories, orders]) => {
      const orderList = (orders as any).data || [];
      const revenue = orderList
        .filter((o: any) => o.status !== "CANCELLED")
        .reduce((sum: number, o: any) => sum + parseFloat(o.totalAmount || "0"), 0);

      setStats({
        products: ((products as any).data || []).length,
        categories: ((categories as any).data || []).length,
        orders: orderList.length,
        revenue,
      });
      setRecentOrders(orderList.slice(0, 5));
    }).finally(() => setLoading(false));
  }, []);

  const STATUS_COLOR: Record<string, string> = {
    PENDING:    "bg-yellow-100 text-yellow-700",
    PROCESSING: "bg-blue-100 text-blue-700",
    SHIPPED:    "bg-indigo-100 text-indigo-700",
    DELIVERED:  "bg-green-100 text-green-700",
    CANCELLED:  "bg-red-100 text-red-700",
  };
  const STATUS_LABEL: Record<string, string> = {
    PENDING: "Menunggu", PROCESSING: "Diproses", SHIPPED: "Dikirim",
    DELIVERED: "Diterima", CANCELLED: "Dibatalkan",
  };

  const STAT_CARDS = [
    { label: "Total Produk",    value: stats.products,   icon: Package,     href: "/admin/products",   color: "bg-blue-50 text-blue-600" },
    { label: "Kategori",        value: stats.categories, icon: Tag,         href: "/admin/categories", color: "bg-purple-50 text-purple-600" },
    { label: "Total Pesanan",   value: stats.orders,     icon: ShoppingCart,href: "/admin/orders",     color: "bg-orange-50 text-orange-600" },
    { label: "Total Revenue",   value: `Rp ${stats.revenue.toLocaleString("id-ID")}`, icon: TrendingUp, href: "/admin/orders", color: "bg-green-50 text-green-600" },
  ];

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-stone-900">Dashboard</h1>
          <p className="text-sm text-stone-400 mt-1">Selamat datang di panel admin BlockNest</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map(({ label, value, icon: Icon, href, color }) => (
            <Link
              key={label}
              to={href}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-stone-900">
                {loading ? <span className="inline-block w-12 h-6 bg-stone-100 rounded animate-pulse" /> : value}
              </p>
              <p className="text-xs text-stone-400 mt-1">{label}</p>
            </Link>
          ))}
        </div>

        {/* Recent orders */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-700">Pesanan Terbaru</h2>
            <Link to="/admin/orders" className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700 transition-colors">
              Lihat semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-stone-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-8 text-center text-sm text-stone-400">Belum ada pesanan</div>
          ) : (
            <div className="divide-y divide-stone-50">
              {recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-stone-800">
                      {order.user?.name || order.user?.email || "—"}
                    </p>
                    <p className="text-xs text-stone-400 font-mono mt-0.5">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[order.status] || "bg-stone-100 text-stone-600"}`}>
                      {STATUS_LABEL[order.status] || order.status}
                    </span>
                    <span className="text-sm font-semibold text-stone-800">
                      Rp {parseFloat(order.totalAmount).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/admin/products/new" className="flex items-center gap-3 p-4 bg-stone-900 text-white rounded-2xl hover:bg-stone-700 transition-colors group">
            <Package className="w-5 h-5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Tambah Produk</p>
              <p className="text-xs text-stone-400">Buat produk baru</p>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/admin/categories/new" className="flex items-center gap-3 p-4 bg-white border border-stone-200 rounded-2xl hover:border-stone-400 transition-colors group">
            <Tag className="w-5 h-5 text-stone-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-stone-800">Tambah Kategori</p>
              <p className="text-xs text-stone-400">Buat kategori baru</p>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto text-stone-400 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/" className="flex items-center gap-3 p-4 bg-white border border-stone-200 rounded-2xl hover:border-stone-400 transition-colors group">
            <svg className="w-5 h-5 text-stone-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <div>
              <p className="text-sm font-medium text-stone-800">Lihat Toko</p>
              <p className="text-xs text-stone-400">Buka halaman publik</p>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto text-stone-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
