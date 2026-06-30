import { useEffect, useState } from "react";
import {
  CheckCircle,
  ChevronRight,
  Pencil,
  Save,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import {
  orderApi,
  STATUS_CONFIG,
  STATUS_OPTIONS,
  type AdminOrder,
  type OrderUpdateData,
} from "../../lib/adminService";
import { formatIDR } from "../../lib/utils";

type EditForm = {
  shippingAddress: string;
  notes: string;
  status: string;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filtered, setFiltered] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    shippingAddress: "",
    notes: "",
    status: "PENDING",
  });
  const [filterStatus, setFilterStatus] = useState("ALL");

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await orderApi.getAll();
      setOrders(res.data);
      setFiltered(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    setFiltered(
      filterStatus === "ALL"
        ? orders
        : orders.filter((order) => order.status === filterStatus)
    );
  }, [filterStatus, orders]);

  const replaceOrder = (updated: AdminOrder) => {
    setOrders((prev) => prev.map((order) => (order.id === updated.id ? updated : order)));
  };

  const handleApprove = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      const res = await orderApi.approve(orderId);
      replaceOrder(res.data);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal approve pesanan");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      const res = await orderApi.updateStatus(orderId, status);
      replaceOrder(res.data);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const startEdit = (order: AdminOrder) => {
    setEditId(order.id);
    setEditForm({
      shippingAddress: order.shippingAddress,
      notes: order.notes || "",
      status: order.status,
    });
  };

  const handleSaveEdit = async (orderId: string) => {
    if (!editForm.shippingAddress.trim()) {
      alert("Alamat pengiriman tidak boleh kosong");
      return;
    }

    setUpdatingId(orderId);
    try {
      const payload: OrderUpdateData = {
        shippingAddress: editForm.shippingAddress.trim(),
        notes: editForm.notes.trim(),
        status: editForm.status,
      };
      const res = await orderApi.update(orderId, payload);
      replaceOrder(res.data);
      setEditId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan pesanan");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm("Yakin ingin menghapus pesanan ini?")) return;

    setUpdatingId(orderId);
    try {
      await orderApi.delete(orderId);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      if (expandedId === orderId) setExpandedId(null);
      if (editId === orderId) setEditId(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal hapus pesanan");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">Pesanan</h1>
            <p className="text-sm text-stone-400 mt-1">{orders.length} total pesanan</p>
          </div>
          <button
            onClick={loadOrders}
            className="px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-700 hover:bg-stone-50 cursor-pointer"
          >
            Refresh
          </button>
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {["ALL", ...STATUS_OPTIONS].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                filterStatus === status
                  ? "bg-stone-900 text-white"
                  : "bg-white border border-stone-200 text-stone-600 hover:border-stone-400"
              }`}
            >
              {status === "ALL" ? "Semua" : STATUS_CONFIG[status]?.label || status}
              {status !== "ALL" && (
                <span className="ml-1.5 opacity-60">
                  ({orders.filter((order) => order.status === status).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-16 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-stone-200 mx-auto mb-3" />
            <p className="text-stone-400 text-sm">Tidak ada pesanan</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => {
              const status = STATUS_CONFIG[order.status] ?? {
                label: order.status,
                color: "bg-stone-100 text-stone-600",
              };
              const isExpanded = expandedId === order.id;
              const isEditing = editId === order.id;
              const date = new Date(order.createdAt).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    className="w-full px-5 py-4 flex items-center gap-4 hover:bg-stone-50 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-mono text-stone-400">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-stone-800 mt-0.5 truncate">
                        {order.user?.name || order.user?.email || "-"}
                      </p>
                      <p className="text-xs text-stone-400">{date}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <p className="text-sm font-semibold text-stone-900">
                        {formatIDR(parseFloat(order.totalAmount))}
                      </p>
                      <ChevronRight
                        className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-stone-100 px-5 py-5">
                      <div className="flex flex-wrap gap-2 mb-5">
                        {order.status === "PENDING" && (
                          <button
                            onClick={() => handleApprove(order.id)}
                            disabled={updatingId === order.id}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => (isEditing ? setEditId(null) : startEdit(order))}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-stone-200 text-stone-700 text-xs font-medium hover:bg-stone-50 cursor-pointer"
                        >
                          {isEditing ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                          {isEditing ? "Batal Edit" : "Edit"}
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          disabled={updatingId === order.id}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4 mb-5">
                        <div className="bg-stone-50 rounded-xl p-4">
                          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                            Customer
                          </p>
                          <p className="text-sm font-medium text-stone-800">{order.user?.name || "-"}</p>
                          <p className="text-xs text-stone-500">{order.user?.email}</p>
                        </div>
                        <div className="bg-stone-50 rounded-xl p-4">
                          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                            Alamat Pengiriman
                          </p>
                          {isEditing ? (
                            <textarea
                              value={editForm.shippingAddress}
                              onChange={(event) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  shippingAddress: event.target.value,
                                }))
                              }
                              rows={3}
                              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
                            />
                          ) : (
                            <>
                              <p className="text-sm text-stone-700">{order.shippingAddress}</p>
                              {order.notes && (
                                <p className="text-xs text-stone-400 mt-1 italic">Catatan: {order.notes}</p>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {isEditing && (
                        <div className="grid sm:grid-cols-2 gap-4 mb-5">
                          <div>
                            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                              Catatan
                            </label>
                            <textarea
                              value={editForm.notes}
                              onChange={(event) =>
                                setEditForm((prev) => ({ ...prev, notes: event.target.value }))
                              }
                              rows={3}
                              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                              Status
                            </label>
                            <select
                              value={editForm.status}
                              onChange={(event) =>
                                setEditForm((prev) => ({ ...prev, status: event.target.value }))
                              }
                              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-stone-300"
                            >
                              {STATUS_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                  {STATUS_CONFIG[option].label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleSaveEdit(order.id)}
                              disabled={updatingId === order.id}
                              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-medium hover:bg-stone-700 disabled:opacity-50 cursor-pointer"
                            >
                              <Save className="w-4 h-4" />
                              Simpan
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="mb-5">
                        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                          Item Pesanan
                        </p>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                              <span className="text-stone-700">{item.product.name}</span>
                              <div className="flex items-center gap-4 text-stone-500 shrink-0">
                                <span>x{item.quantity}</span>
                                <span className="font-medium text-stone-800">
                          <span>{formatIDR(parseFloat(item.price) * item.quantity)}</span>
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-between font-semibold text-stone-900 pt-3 mt-3 border-t border-stone-100">
                          <span>Total</span>
                          <span>{formatIDR(parseFloat(order.totalAmount))}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
                          Update Status Cepat
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {STATUS_OPTIONS.map((option) => (
                            <button
                              key={option}
                              onClick={() => handleStatusChange(order.id, option)}
                              disabled={order.status === option || updatingId === order.id}
                              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer disabled:cursor-default ${
                                order.status === option
                                  ? `${STATUS_CONFIG[option].color} ring-2 ring-offset-1 ring-current`
                                  : "bg-stone-100 text-stone-600 hover:bg-stone-200 disabled:opacity-50"
                              }`}
                            >
                              {updatingId === order.id && order.status !== option
                                ? "..."
                                : STATUS_CONFIG[option].label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
