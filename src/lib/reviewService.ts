import { API_BASE_URL } from "./apiConfig";
import { authService } from "./authService";

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name?: string | null; email?: string };
  product?: { id: string; name: string; slug: string };
}

export interface ProductReviewSummary {
  product: { id: string; name: string; slug: string };
  summary: { totalReviews: number; averageRating: number };
  reviews: Review[];
}

function headers() {
  const token = authService.getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || json.error || "Request review gagal");
  return json;
}

export const reviewService = {
  getAllAdmin: () => req<{ success: boolean; data: Review[] }>("GET", "/api/reviews/admin"),
  getByProduct: (productId: string) =>
    req<{ success: boolean; data: ProductReviewSummary }>("GET", `/api/reviews/product/${productId}`),
  create: (data: { productId: string; rating: number; comment?: string }) =>
    req<{ success: boolean; data: Review }>("POST", "/api/reviews", data),
  update: (id: string, data: { rating?: number; comment?: string }) =>
    req<{ success: boolean; data: Review }>("PUT", `/api/reviews/${id}`, data),
  delete: (id: string) => req<{ success: boolean }>("DELETE", `/api/reviews/${id}`),
};
