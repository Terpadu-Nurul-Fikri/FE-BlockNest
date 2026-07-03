import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  CheckCircle,
  Clock,
  ArrowLeft,
  Loader2,
  Wallet,
} from "lucide-react";
import { checkoutService, type InvoiceData } from "../../lib/checkoutService";
import { formatIDR } from "../../lib/utils";

const PAYMENT_LABELS: Record<string, string> = {
  bca: "Transfer BCA",
  bni: "Transfer BNI",
  mandiri: "Transfer Mandiri",
  virtual_account: "Virtual Account",
  qris: "QRIS",
  cod: "COD (Bayar di Tempat)",
};

const PAYMENT_ICONS: Record<string, string> = {
  bca: "🏦",
  bni: "🏦",
  mandiri: "🏦",
  virtual_account: "🏧",
  qris: "📱",
  cod: "💵",
};

function getPaymentLabel(method: string | null): string {
  if (!method) return "-";
  return PAYMENT_LABELS[method] || method;
}

function getPaymentIcon(method: string | null): string {
  if (!method) return "💳";
  return PAYMENT_ICONS[method] || "💳";
}

function getVirtualAccountNumber(method: string): string {
  const prefixes: Record<string, string> = {
    bca: "8800",
    bni: "9900",
    mandiri: "7700",
  };
  const prefix = prefixes[method] || "8800";
  const rand = Math.random().toString().slice(2, 12);
  return `${prefix}${rand}`;
}

export default function PaymentSimulation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");
  const [vaNumber, setVaNumber] = useState("");

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await checkoutService.getInvoice(id);
        setInvoice(data);
        if (data.paymentMethod) {
          setVaNumber(getVirtualAccountNumber(data.paymentMethod));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat invoice");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSimulatePayment = async () => {
    if (!id) return;
    setPaying(true);
    setError("");
    try {
      const data = await checkoutService.simulatePayment(id);
      setInvoice(data);
      setPaid(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memproses pembayaran");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-stone-400 animate-spin" />
      </div>
    );
  }

  if (!invoice && !loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4 px-4">
        <p className="text-stone-500">Invoice tidak ditemukan</p>
        <button onClick={() => navigate("/orders")} className="text-sm text-stone-600 underline cursor-pointer">
          Lihat Pesanan Saya
        </button>
      </div>
    );
  }

  const isPending = invoice?.status === "PENDING";
  const isProcessing = invoice?.status === "PAID";

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight text-stone-900">
            Block<span className="text-stone-400">Nest</span>
          </Link>
          <Link
            to="/orders"
            className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-12">
        {paid || isProcessing ? (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold text-stone-900 mb-2">Pembayaran Berhasil!</h1>
            <p className="text-stone-500 mb-8">Pesanan kamu sedang diproses.</p>
            <button
              onClick={() => navigate(`/invoice/${id}`)}
              className="px-6 py-3 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-700 transition-colors cursor-pointer"
            >
              Lihat Invoice
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-amber-600" />
              </div>
              <h1 className="text-xl font-semibold text-stone-900 mb-1">Menunggu Pembayaran</h1>
              <p className="text-xs text-stone-400 font-mono">{invoice?.payment?.transactionId || invoice?.id?.slice(0, 10).toUpperCase()}</p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
                Detail Pembayaran
              </h2>

              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm">
                  {getPaymentIcon(invoice?.paymentMethod)}
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    {getPaymentLabel(invoice?.paymentMethod)}
                  </p>
                  {invoice?.paymentMethod && ["bca", "bni", "mandiri"].includes(invoice.paymentMethod) && (
                    <p className="text-xs text-stone-400 mt-0.5 font-mono">
                      VA: {vaNumber}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t border-stone-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>{formatIDR(invoice?.totalAmount || "0")}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Ongkir</span>
                  <span>{formatIDR(invoice?.shippingCost || "0")}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Biaya Admin</span>
                  <span>{formatIDR(invoice?.adminFee || "0")}</span>
                </div>
                <div className="flex justify-between font-semibold text-stone-900 pt-2 border-t border-stone-100">
                  <span>Total</span>
                  <span>{formatIDR(invoice?.grandTotal || "0")}</span>
                </div>
              </div>
            </div>

            {isPending && (
              <button
                onClick={handleSimulatePayment}
                disabled={paying}
                className="w-full py-4 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-700 disabled:bg-stone-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {paying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    Simulasikan Pembayaran
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
