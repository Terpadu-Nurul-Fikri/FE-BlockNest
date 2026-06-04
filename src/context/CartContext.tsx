import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { cartService, type CartItem } from "../lib/cartService";

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  addToCart: (productIdOrSlug: string, quantity?: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

function calcTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + parseFloat(i.product.price) * i.quantity, 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setItems(data.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productIdOrSlug: string, quantity = 1) => {
    // Call API, then update state from response (no full refresh)
    const newItem = await cartService.addToCart(productIdOrSlug, quantity);
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.productId === newItem.productId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = newItem;
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const updateItem = async (productId: string, quantity: number) => {
    // Optimistic: update UI immediately
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
    try {
      await cartService.updateCartItem(productId, quantity);
    } catch {
      // Revert on error
      await refreshCart();
    }
  };

  const removeItem = async (productId: string) => {
    // Optimistic: remove from UI immediately
    setItems((prev) => prev.filter((i) => i.productId !== productId));
    try {
      await cartService.removeFromCart(productId);
    } catch {
      await refreshCart();
    }
  };

  const clearCart = async () => {
    setItems([]);
    try {
      await cartService.clearCart();
    } catch {
      await refreshCart();
    }
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = calcTotal(items);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        loading,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
