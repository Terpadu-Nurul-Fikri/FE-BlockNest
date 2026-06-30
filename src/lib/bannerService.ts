import { API_BASE_URL } from "./apiConfig";
import { authService } from "./authService";

export type BannerType = "TOP_BAR" | "HERO_SLIDER" | "POPUP";

export interface Banner {
  id: string;
  title: string;
  type: BannerType;
  imageUrl?: string | null;
  imageAlt?: string | null;
  content?: string | null;
  linkUrl?: string | null;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BannerFormData {
  title: string;
  type: BannerType;
  imageUrl?: string;
  imageAlt?: string;
  content?: string;
  linkUrl?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
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
  if (!res.ok) throw new Error(json.message || json.error || "Request banner gagal");
  return json;
}

export const bannerService = {
  getActive: () => req<{ success: boolean; data: Banner[] }>("GET", "/api/banners/active"),
  getAll: () => req<{ success: boolean; data: Banner[] }>("GET", "/api/banners"),
  create: (data: BannerFormData) =>
    req<{ success: boolean; data: Banner }>("POST", "/api/banners", data),
  update: (id: string, data: Partial<BannerFormData>) =>
    req<{ success: boolean; data: Banner }>("PUT", `/api/banners/${id}`, data),
  delete: (id: string) => req<{ success: boolean }>("DELETE", `/api/banners/${id}`),
};
