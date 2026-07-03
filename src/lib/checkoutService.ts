import { authService } from "./authService";
import { API_BASE_URL } from "./apiConfig";

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authService.getToken()}`,
  };
}

export interface Courier {
  code: string;
  name: string;
}

export interface ShippingService {
  code: string;
  name: string;
  cost: number;
  eta: string;
}

export interface CheckoutItem {
  productId: string;
  quantity: number;
}

export interface CheckoutData {
  items: CheckoutItem[];
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  shippingProvince: string;
  shippingZip: string;
  shippingCourier: string;
  shippingService: string;
  shippingCost: number;
  paymentMethod: string;
  notes?: string;
}

export interface InvoicePayment {
  id: string;
  paymentMethod: string;
  paymentStatus: string;
  amount: string;
  paidAt: string | null;
  transactionId: string | null;
}

export interface InvoiceItem {
  id: string;
  quantity: number;
  price: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    images: { imageUrl: string; imageAlt?: string | null }[];
  };
}

export interface InvoiceData {
  id: string;
  invoiceNumber?: string;
  status: string;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingAddress: string;
  shippingCity: string | null;
  shippingProvince: string | null;
  shippingZip: string | null;
  shippingCourier: string | null;
  shippingService: string | null;
  shippingCost: string;
  paymentMethod: string | null;
  adminFee: string;
  totalAmount: string;
  grandTotal: string;
  notes: string | null;
  createdAt: string;
  items: InvoiceItem[];
  payment: InvoicePayment | null;
}

export const checkoutService = {
  async getCouriers(): Promise<Courier[]> {
    const res = await fetch(`${API_BASE_URL}/api/shipping/couriers`);
    const json = await res.json();
    return json.data || [];
  },

  async getServices(courier: string): Promise<ShippingService[]> {
    const res = await fetch(`${API_BASE_URL}/api/shipping/services/${courier}`);
    const json = await res.json();
    return json.data || [];
  },

  async createOrder(data: CheckoutData): Promise<InvoiceData> {
    const res = await fetch(`${API_BASE_URL}/api/checkout`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Gagal membuat order");
    return json.data;
  },

  async simulatePayment(orderId: string): Promise<InvoiceData> {
    const res = await fetch(`${API_BASE_URL}/api/checkout/${orderId}/pay`, {
      method: "POST",
      headers: headers(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Gagal memproses pembayaran");
    return json.data;
  },

  async getInvoice(orderId: string): Promise<InvoiceData> {
    const res = await fetch(`${API_BASE_URL}/api/checkout/${orderId}/invoice`, {
      headers: headers(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || "Gagal mengambil invoice");
    return json.data;
  },
};
