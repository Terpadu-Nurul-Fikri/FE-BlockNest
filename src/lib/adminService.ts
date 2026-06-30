import { authService } from "./authService";
import { API_BASE_URL } from "./apiConfig";
import type { Banner, BannerFormData } from "./bannerService";
import type { Review } from "./reviewService";

const API = API_BASE_URL;

function headers() {
  const token = authService.getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || json.error || "Request gagal");
  return json;
}

// ── Products ─────────────────────────────────────────────────────────────────

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  categoryId: string | null;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  isNew: boolean;
  imageUrl: string;
  imageAlt: string;
  images: { imageUrl: string; imageAlt?: string; isPrimary: boolean; sortOrder: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  slug: string;
  subCategory?: string;
  price: number;
  stockQuantity: number;
  categoryId?: string;
  isNew?: boolean;
  images?: { imageUrl: string; imageAlt?: string; isPrimary?: boolean }[];
}

export const productApi = {
  getAll: () => req<{ success: boolean; data: AdminProduct[] }>("GET", "/api/admin/products"),
  getById: (id: string) => req<{ success: boolean; data: AdminProduct }>("GET", `/api/admin/products/${id}`),
  create: (data: ProductFormData) => req<{ success: boolean; data: AdminProduct }>("POST", "/api/admin/products", data),
  update: (id: string, data: Partial<ProductFormData>) => req<{ success: boolean; data: AdminProduct }>("PUT", `/api/admin/products/${id}`, data),
  delete: (id: string) => req<{ success: boolean }>("DELETE", `/api/admin/products/${id}`),
};

// ── Categories ────────────────────────────────────────────────────────────────

export interface AdminCategory {
  id: string;
  slug: string;
  label: string;
  headline?: string;
  description?: string;
  seoDescription?: string;
  heroImage?: string;
  heroAlt?: string;
  ogImage?: string;
  createdAt: string;
  _count?: { products: number };
}

export interface CategoryFormData {
  slug: string;
  label: string;
  headline?: string;
  description?: string;
  seoDescription?: string;
  heroImage?: string;
  heroAlt?: string;
  ogImage?: string;
}

export const categoryApi = {
  getAll: () => req<{ success: boolean; data: AdminCategory[] }>("GET", "/api/category/admin"),
  getById: (id: string) => req<{ success: boolean; data: AdminCategory }>("GET", `/api/category/admin/${id}`),
  create: (data: CategoryFormData) => req<{ success: boolean; data: AdminCategory }>("POST", "/api/category/admin", data),
  update: (id: string, data: Partial<CategoryFormData>) => req<{ success: boolean; data: AdminCategory }>("PUT", `/api/category/admin/${id}`, data),
  delete: (id: string) => req<{ success: boolean }>("DELETE", `/api/category/admin/${id}`),
};

// ── Orders ────────────────────────────────────────────────────────────────────

export interface AdminOrder {
  id: string;
  status: string;
  totalAmount: string;
  shippingAddress: string;
  notes?: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
  items: {
    id: string;
    quantity: number;
    price: string;
    product: { id: string; name: string };
  }[];
}

export interface OrderUpdateData {
  shippingAddress?: string;
  notes?: string;
  status?: string;
}

export const STATUS_OPTIONS = ["PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"] as const;

export const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING:    { label: "Menunggu",    color: "bg-yellow-100 text-yellow-700" },
  PAID:       { label: "Dibayar",    color: "bg-blue-100 text-blue-700" },
  SHIPPED:    { label: "Dikirim",    color: "bg-indigo-100 text-indigo-700" },
  COMPLETED:  { label: "Selesai",    color: "bg-green-100 text-green-700" },
  CANCELLED:  { label: "Dibatalkan", color: "bg-red-100 text-red-700" },
};

export const orderApi = {
  getAll: () => req<{ success: boolean; data: AdminOrder[] }>("GET", "/api/orders/admin/all"),
  approve: (id: string) =>
    req<{ success: boolean; data: AdminOrder }>("PATCH", `/api/orders/admin/${id}/approve`),
  updateStatus: (id: string, status: string) =>
    req<{ success: boolean; data: AdminOrder }>("PATCH", `/api/orders/admin/${id}/status`, { status }),
  update: (id: string, data: OrderUpdateData) =>
    req<{ success: boolean; data: AdminOrder }>("PUT", `/api/orders/admin/${id}`, data),
  delete: (id: string) =>
    req<{ success: boolean }>("DELETE", `/api/orders/admin/${id}`),
};

// â”€â”€ Banners â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const bannerApi = {
  getAll: () => req<{ success: boolean; data: Banner[] }>("GET", "/api/banners"),
  create: (data: BannerFormData) =>
    req<{ success: boolean; data: Banner }>("POST", "/api/banners", data),
  update: (id: string, data: Partial<BannerFormData>) =>
    req<{ success: boolean; data: Banner }>("PUT", `/api/banners/${id}`, data),
  delete: (id: string) => req<{ success: boolean }>("DELETE", `/api/banners/${id}`),
};

// â”€â”€ Reviews â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const reviewApi = {
  getAll: () => req<{ success: boolean; data: Review[] }>("GET", "/api/reviews/admin"),
  delete: (id: string) => req<{ success: boolean }>("DELETE", `/api/reviews/${id}`),
};
