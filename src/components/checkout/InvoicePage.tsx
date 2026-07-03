import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FileText,
  ShoppingBag,
  ChevronRight,
  Loader2,
  Printer,
} from "lucide-react";
import { checkoutService, type InvoiceData } from "../../lib/checkoutService";
import { formatIDR } from "../../lib/utils";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Menunggu Pembayaran", color: "bg-yellow-100 text-yellow-700" },
  PAID: { label: "Lunas", color: "bg-blue-100 text-blue-700" },
  SHIPPED: { label: "Dikirim", color: "bg-cyan-100 text-cyan-700" },
  COMPLETED: { label: "Selesai", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Dibatalkan", color: "bg-red-100 text-red-700" },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function InvoicePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await checkoutService.getInvoice(id);
        setInvoice(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat invoice");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-stone-400 animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-stone-500">Invoice tidak ditemukan</p>
        <button onClick={() => navigate("/orders")} className="text-sm text-stone-600 underline cursor-pointer">
          Lihat Pesanan Saya
        </button>
      </div>
    );
  }

  const statusConf = STATUS_LABELS[invoice.status] || { label: invoice.status, color: "bg-stone-100 text-stone-600" };

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-red-600 text-sm">{error}</p>
        <button onClick={() => navigate("/orders")} className="text-sm text-stone-600 underline cursor-pointer">
          Lihat Pesanan Saya
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 print:bg-white">
      <header className="bg-white border-b border-stone-100 sticky top-0 z-50 print:hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight text-stone-900">
            Block<span className="text-stone-400">Nest</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-stone-600 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak
            </button>
            <Link
              to="/orders"
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
            >
              Kembali
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 print:py-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10 print:shadow-none print:p-0">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-stone-400" />
                <h1 className="text-lg font-semibold text-stone-900">INVOICE</h1>
              </div>
              <p className="text-sm text-stone-400 font-mono">
                {invoice.payment?.transactionId || `INV-${invoice.id.slice(0, 8).toUpperCase()}`}
              </p>
              <p className="text-xs text-stone-400 mt-1">{formatDate(invoice.createdAt)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConf.color}`}>
              {statusConf.label}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-stone-50 rounded-xl p-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2">
                Alamat Pengiriman
              </p>
              <p className="text-sm font-medium text-stone-800">
                {invoice.shippingName || "-"}
              </p>
              {invoice.shippingPhone && (
                <p className="text-xs text-stone-500">{invoice.shippingPhone}</p>
              )}
              <p className="text-xs text-stone-500 mt-1">
                {invoice.shippingAddress}
              </p>
              <p className="text-xs text-stone-500">
                {[invoice.shippingCity, invoice.shippingProvince, invoice.shippingZip]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </p>
            </div>

            <div className="bg-stone-50 rounded-xl p-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2">
                Pengiriman & Pembayaran
              </p>
              {invoice.shippingCourier && (
                <p className="text-xs text-stone-600">
                  Kurir: <span className="font-medium text-stone-800">{invoice.shippingCourier}</span>
                  {invoice.shippingService ? ` - ${invoice.shippingService}` : ""}
                </p>
              )}
              <p className="text-xs text-stone-600 mt-1">
                Metode Bayar:{" "}
                <span className="font-medium text-stone-800">{invoice.paymentMethod || "-"}</span>
              </p>
              <p className="text-xs text-stone-600 mt-1">
                Status:{" "}
                <span className="font-medium text-stone-800">{statusConf.label}</span>
              </p>
              {invoice.payment?.paidAt && (
                <p className="text-xs text-stone-600 mt-1">
                  Dibayar: {formatDate(invoice.payment.paidAt)}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-stone-100 pt-6 mb-6">
            <h2 className="text-sm font-semibold text-stone-700 mb-4">Daftar Produk</h2>
            <div className="space-y-3">
              {invoice.items.map((item) => {
                const img = item.product.images?.[0];
                return (
                  <div key={item.id} className="flex items-center gap-4 py-3 border-b border-stone-50 last:border-0">
                    <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                      {img ? (
                        <img src={img.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">{item.product.name}</p>
                      <p className="text-xs text-stone-400">
                        {formatIDR(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-stone-800 shrink-0">
                      {formatIDR(parseFloat(item.price) * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-stone-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>{formatIDR(invoice.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Ongkos Kirim</span>
              <span>{formatIDR(invoice.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Biaya Admin</span>
              <span>{formatIDR(invoice.adminFee)}</span>
            </div>
            <div className="flex justify-between font-semibold text-stone-900 pt-2 border-t border-stone-100 text-base">
              <span>Grand Total</span>
              <span>{formatIDR(invoice.grandTotal)}</span>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-6 p-4 bg-stone-50 rounded-xl">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-1">
                Catatan
              </p>
              <p className="text-sm text-stone-600 italic">{invoice.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center print:hidden">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            Lihat Semua Pesanan
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </main>
    </div>
  );
}
