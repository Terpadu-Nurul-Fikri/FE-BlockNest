import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  ArrowLeft,
  ChevronRight,
  Check,
  Loader2,
  MapPin,
  Truck,
  CreditCard,
  FileText,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { authService } from "../../lib/authService";
import { checkoutService, type Courier, type ShippingService } from "../../lib/checkoutService";
import { formatIDR } from "../../lib/utils";

interface BuyNowItem {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    subCategory?: string | null;
    images: { imageUrl: string; imageAlt?: string | null }[];
  };
}

interface CheckoutItem {
  id: string;
  productId: string;
  quantity: number;
  product: {
    name: string;
    price: string;
    subCategory?: string | null;
    images: { imageUrl: string; imageAlt?: string | null }[];
  };
}

type Step = "shipping" | "courier" | "payment" | "review";

const STEP_ICONS: Record<Step, typeof MapPin> = {
  shipping: MapPin,
  courier: Truck,
  payment: CreditCard,
  review: FileText,
};

const STEP_LABELS: Record<Step, string> = {
  shipping: "Alamat",
  courier: "Kurir",
  payment: "Pembayaran",
  review: "Review",
};

const PAYMENT_GROUPS = [
  {
    label: "Transfer Bank",
    options: [
      { value: "bca", label: "BCA", icon: "🏦" },
      { value: "bni", label: "BNI", icon: "🏦" },
      { value: "mandiri", label: "Mandiri", icon: "🏦" },
    ],
  },
  {
    label: "Virtual Account",
    options: [
      { value: "virtual_account", label: "Virtual Account", icon: "🏧" },
    ],
  },
  {
    label: "Pembayaran Lainnya",
    options: [
      { value: "qris", label: "QRIS", icon: "📱" },
      { value: "cod", label: "COD (Bayar di Tempat)", icon: "💵" },
    ],
  },
];

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = authService.isAuthenticated();

  const buyNowItem = (location.state as { buyNowItem?: BuyNowItem } | null)?.buyNowItem ?? null;
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

  const subtotal = displayItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0,
  );
  const totalItems = displayItems.reduce((sum, item) => sum + item.quantity, 0);

  const [step, setStep] = useState<Step>("shipping");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    shippingName: "",
    shippingPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingProvince: "",
    shippingZip: "",
    notes: "",
  });

  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<string>("");
  const [services, setServices] = useState<ShippingService[]>([]);
  const [selectedService, setSelectedService] = useState<ShippingService | null>(null);
  const [servicesLoading, setServicesLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const shippingCost = selectedService?.cost || 0;
  const adminFee = paymentMethod === "cod" ? 2000 : 1000;
  const grandTotal = subtotal + shippingCost + adminFee;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    checkoutService.getCouriers().then(setCouriers).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedCourier) {
      setServices([]);
      setSelectedService(null);
      return;
    }
    setServicesLoading(true);
    setSelectedService(null);
    checkoutService
      .getServices(selectedCourier)
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setServicesLoading(false));
  }, [selectedCourier]);

  if (!isLoggedIn) return null;

  if (displayItems.length === 0) {
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

  const updateForm = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const canProceedFromShipping = () => {
    return form.shippingName.trim() && form.shippingPhone.trim() && form.shippingAddress.trim()
      && form.shippingCity.trim() && form.shippingProvince.trim() && form.shippingZip.trim();
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const orderItems = displayItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const data = await checkoutService.createOrder({
        items: orderItems,
        shippingName: form.shippingName,
        shippingPhone: form.shippingPhone,
        shippingAddress: form.shippingAddress,
        shippingCity: form.shippingCity,
        shippingProvince: form.shippingProvince,
        shippingZip: form.shippingZip,
        shippingCourier: selectedCourier,
        shippingService: selectedService?.code || "",
        shippingCost,
        paymentMethod,
        notes: form.notes || undefined,
      });

      if (!isBuyNow) {
        await clearCart();
      }

      navigate(`/payment/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps: Step[] = ["shipping", "courier", "payment", "review"];
    const idx = steps.indexOf(step);
    return (
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => {
          const Icon = STEP_ICONS[s];
          const isActive = i === idx;
          const isDone = i < idx;
          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-stone-900 text-white"
                    : isDone
                    ? "bg-green-100 text-green-700"
                    : "bg-stone-100 text-stone-400"
                }`}
              >
                {isDone ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
                <span className="hidden sm:inline">{STEP_LABELS[s]}</span>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight className={`w-3 h-3 ${i < idx ? "text-green-400" : "text-stone-300"}`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderShippingForm = () => (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-medium text-stone-900 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-stone-400" />
          Alamat Pengiriman
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Nama Penerima</label>
            <input
              value={form.shippingName}
              onChange={(e) => updateForm("shippingName", e.target.value)}
              placeholder="Nama lengkap"
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Nomor HP</label>
            <input
              value={form.shippingPhone}
              onChange={(e) => updateForm("shippingPhone", e.target.value)}
              placeholder="081234567890"
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Alamat</label>
            <textarea
              value={form.shippingAddress}
              onChange={(e) => updateForm("shippingAddress", e.target.value)}
              placeholder="Nama jalan, gedung, no. rumah"
              rows={2}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Kota</label>
            <input
              value={form.shippingCity}
              onChange={(e) => updateForm("shippingCity", e.target.value)}
              placeholder="Jakarta"
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Provinsi</label>
            <input
              value={form.shippingProvince}
              onChange={(e) => updateForm("shippingProvince", e.target.value)}
              placeholder="DKI Jakarta"
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-500 mb-1.5">Kode Pos</label>
            <input
              value={form.shippingZip}
              onChange={(e) => updateForm("shippingZip", e.target.value)}
              placeholder="12345"
              className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
              required
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-medium text-stone-900 mb-4">Catatan (opsional)</h2>
        <textarea
          value={form.notes}
          onChange={(e) => updateForm("notes", e.target.value)}
          placeholder="Catatan untuk pesanan..."
          rows={2}
          className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none"
        />
      </div>
    </div>
  );

  const renderCourierSelector = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-medium text-stone-900 mb-4 flex items-center gap-2">
        <Truck className="w-4 h-4 text-stone-400" />
        Pilih Kurir
      </h2>
      <div className="space-y-3 mb-6">
        {couriers.map((c) => (
          <label
            key={c.code}
            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
              selectedCourier === c.code
                ? "border-stone-900 bg-stone-50"
                : "border-stone-200 hover:border-stone-300"
            }`}
          >
            <input
              type="radio"
              name="courier"
              value={c.code}
              checked={selectedCourier === c.code}
              onChange={() => {
                setSelectedCourier(c.code);
                setSelectedService(null);
              }}
              className="accent-stone-900"
            />
            <span className="text-sm font-medium text-stone-800">{c.name}</span>
          </label>
        ))}
        {couriers.length === 0 && (
          <p className="text-sm text-stone-400 text-center py-4">Memuat data kurir...</p>
        )}
      </div>

      {selectedCourier && (
        <>
          <h3 className="text-sm font-medium text-stone-700 mb-3">Layanan Pengiriman</h3>
          {servicesLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 text-stone-400 animate-spin" />
            </div>
          ) : services.length > 0 ? (
            <div className="space-y-3">
              {services.map((s) => (
                <label
                  key={s.code}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                    selectedService?.code === s.code
                      ? "border-stone-900 bg-stone-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="service"
                      value={s.code}
                      checked={selectedService?.code === s.code}
                      onChange={() => setSelectedService(s)}
                      className="accent-stone-900"
                    />
                    <div>
                      <p className="text-sm font-medium text-stone-800">{s.name}</p>
                      <p className="text-xs text-stone-400">ETA {s.eta}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-stone-900">{formatIDR(s.cost)}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-stone-400 text-center py-4">Tidak ada layanan tersedia</p>
          )}
        </>
      )}
    </div>
  );

  const renderPaymentSelector = () => (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-medium text-stone-900 mb-4 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-stone-400" />
        Metode Pembayaran
      </h2>
      <div className="space-y-6">
        {PAYMENT_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2">
              {group.label}
            </p>
            <div className="space-y-2">
              {group.options.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                    paymentMethod === opt.value
                      ? "border-stone-900 bg-stone-50"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.value}
                    checked={paymentMethod === opt.value}
                    onChange={() => setPaymentMethod(opt.value)}
                    className="accent-stone-900 shrink-0"
                  />
                  <span className="text-lg">{opt.icon}</span>
                  <span className="text-sm font-medium text-stone-800">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-medium text-stone-900 mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-stone-400" />
          Review Pesanan
        </h2>

        <div className="bg-stone-50 rounded-xl p-4 mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2">
            Alamat Pengiriman
          </p>
          <p className="text-sm font-medium text-stone-800">{form.shippingName}</p>
          <p className="text-xs text-stone-500">{form.shippingPhone}</p>
          <p className="text-xs text-stone-500 mt-1">
            {form.shippingAddress}, {form.shippingCity}, {form.shippingProvince} {form.shippingZip}
          </p>
        </div>

        <div className="bg-stone-50 rounded-xl p-4 mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2">
            Kurir & Layanan
          </p>
          <p className="text-sm font-medium text-stone-800">
            {couriers.find((c) => c.code === selectedCourier)?.name || selectedCourier}
            {selectedService ? ` - ${selectedService.name}` : ""}
          </p>
          {selectedService && (
            <p className="text-xs text-stone-400">ETA {selectedService.eta}</p>
          )}
        </div>

        <div className="bg-stone-50 rounded-xl p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2">
            Metode Pembayaran
          </p>
          <p className="text-sm font-medium text-stone-800">
            {PAYMENT_GROUPS.flatMap((g) => g.options).find((o) => o.value === paymentMethod)?.label || paymentMethod}
          </p>
        </div>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="lg:col-span-2">
      <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
        <h2 className="text-base font-medium text-stone-900 mb-4">
          Ringkasan ({totalItems} item)
        </h2>

        <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
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
                  {formatIDR(price * item.quantity)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="border-t border-stone-100 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span>{formatIDR(subtotal)}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Ongkir</span>
            <span>
              {shippingCost > 0 ? formatIDR(shippingCost) : (
                <span className="text-stone-400">Belum dipilih</span>
              )}
            </span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Biaya Admin</span>
            <span>{paymentMethod ? formatIDR(adminFee) : <span className="text-stone-400">-</span>}</span>
          </div>
          <div className="flex justify-between font-semibold text-stone-900 pt-2 border-t border-stone-100 text-base">
            <span>Total</span>
            <span>
              {shippingCost > 0 && paymentMethod
                ? formatIDR(grandTotal)
                : <span className="text-stone-400">-</span>}
            </span>
          </div>
        </div>

        {step === "review" && (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-6 py-4 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-700 disabled:bg-stone-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Memproses...
              </>
            ) : (
              `Bayar Sekarang - ${formatIDR(grandTotal)}`
            )}
          </button>
        )}

        {form.notes && (
          <div className="mt-4 p-3 bg-stone-50 rounded-xl">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-0.5">Catatan</p>
            <p className="text-xs text-stone-600 italic">{form.notes}</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderNavigation = () => {
    const steps: Step[] = ["shipping", "courier", "payment", "review"];
    const idx = steps.indexOf(step);
    const prev = idx > 0 ? steps[idx - 1] : null;
    const next = idx < steps.length - 1 ? steps[idx + 1] : null;

    return (
      <div className="flex items-center justify-between mt-8">
        <div>
          {prev ? (
            <button
              onClick={() => setStep(prev)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-stone-600 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              {STEP_LABELS[prev]}
            </button>
          ) : (
            <Link
              to={isBuyNow && buyNowItem ? `/product/${buyNowItem.product.slug}` : "/cart"}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-stone-500 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {isBuyNow ? "Kembali" : "Cart"}
            </Link>
          )}
        </div>

        {next && (
          <button
            onClick={() => {
              if (step === "shipping" && !canProceedFromShipping()) {
                setError("Lengkapi semua field alamat pengiriman");
                return;
              }
              if (step === "courier" && !selectedService) {
                setError("Pilih kurir dan layanan pengiriman");
                return;
              }
              if (step === "payment" && !paymentMethod) {
                setError("Pilih metode pembayaran");
                return;
              }
              setError("");
              setStep(next);
            }}
            className="px-6 py-3 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-700 transition-colors cursor-pointer"
          >
            Lanjut ke {STEP_LABELS[next]}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight text-stone-900">
            Block<span className="text-stone-400">Nest</span>
          </Link>
          <Link
            to={isBuyNow && buyNowItem ? `/product/${buyNowItem.product.slug}` : "/cart"}
            className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {isBuyNow ? "Kembali ke Produk" : "Kembali ke Cart"}
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderStepIndicator()}

        <h1 className="text-2xl font-light text-stone-900 mb-6">
          Checkout {isBuyNow && "(Buy Now)"}
        </h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {step === "shipping" && renderShippingForm()}
            {step === "courier" && renderCourierSelector()}
            {step === "payment" && renderPaymentSelector()}
            {step === "review" && renderReview()}
            {renderNavigation()}
          </div>

          {renderSidebar()}
        </div>
      </main>
    </div>
  );
}
