import { authService } from "./authService";
import { API_BASE_URL } from "./apiConfig";

export interface CartItemProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  subCategory?: string;
  images: { imageUrl: string; imageAlt?: string }[];
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  product: CartItemProduct;
}

interface CartResponse {
  success: boolean;
  data: { items: CartItem[]; total: number; itemCount: number };
}

function authHeaders(): Record<string, string> {
  const token = authService.getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const cartService = {
  async getCart(): Promise<{ items: CartItem[]; total: number; itemCount: number }> {
    const res = await fetch(`${API_BASE_URL}/api/cart`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil cart");
    const json: CartResponse = await res.json();
    return json.data;
  },

  async addToCart(productId: string, quantity = 1): Promise<CartItem> {
    // productId bisa berupa UUID atau slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productId);
    const body = isUUID
      ? { productId, quantity }
      : { slug: productId, quantity };

    const res = await fetch(`${API_BASE_URL}/api/cart`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Gagal menambah ke cart");
    }
    const json = await res.json();
    return json.data;
  },

  async updateCartItem(productId: string, quantity: number): Promise<CartItem> {
    const res = await fetch(`${API_BASE_URL}/api/cart/${productId}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Gagal update cart");
    }
    const json = await res.json();
    return json.data;
  },

  async removeFromCart(productId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cart/${productId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Gagal menghapus item");
  },

  async clearCart(): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/cart/clear`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengosongkan cart");
  },
};
