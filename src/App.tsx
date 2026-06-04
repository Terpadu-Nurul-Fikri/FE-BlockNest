import { Routes, Route } from "react-router-dom";
import Home from "./component/pages/Home";
import CategoryPage from "./component/pages/CategoryPage";
import RegisterPage from "./component/pages/RegisterPage";
import LoginPage from "./component/pages/LoginPage";
import ForgotPasswordPage from "./component/pages/ForgotPasswordPage";
import ResetPasswordPage from "./component/pages/ResetPasswordPage";
import ProfilePage from "./component/pages/ProfilePage";
import CartPage from "./component/pages/CartPage";
import CheckoutPage from "./component/pages/CheckoutPage";
import OrdersPage from "./component/pages/OrdersPage";
import ProtectedRoute from "./component/ProtectedRoute";

// Admin pages
import AdminDashboard from "./component/admin/AdminDashboard";
import { AdminProductList, AdminProductForm } from "./component/admin/AdminProducts";
import { AdminCategoryList, AdminCategoryForm } from "./component/admin/AdminCategories";
import AdminOrders from "./component/admin/AdminOrders";

const NAV_SLUGS = [
  "living-room",
  "bedroom",
  "dining",
  "office",
  "outdoor",
  "sale",
];

export default function App() {
  return (
    <Routes>
      {/* ── Public routes ─────────────────────────────────────────────── */}
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Category pages — public */}
      {NAV_SLUGS.map((slug) => (
        <Route key={slug} path={`/${slug}`} element={<CategoryPage />} />
      ))}

      {/* ── Protected routes (login required) ─────────────────────────── */}
      <Route path="/profile"  element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/orders"   element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path="/cart"     element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />

      {/* ── Admin routes (ADMIN role only) ────────────────────────────── */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

      <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProductList /></ProtectedRoute>} />
      <Route path="/admin/products/new" element={<ProtectedRoute adminOnly><AdminProductForm /></ProtectedRoute>} />
      <Route path="/admin/products/:id/edit" element={<ProtectedRoute adminOnly><AdminProductForm /></ProtectedRoute>} />

      <Route path="/admin/categories" element={<ProtectedRoute adminOnly><AdminCategoryList /></ProtectedRoute>} />
      <Route path="/admin/categories/new" element={<ProtectedRoute adminOnly><AdminCategoryForm /></ProtectedRoute>} />
      <Route path="/admin/categories/:id/edit" element={<ProtectedRoute adminOnly><AdminCategoryForm /></ProtectedRoute>} />

      <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />

      {/* 404 fallback */}
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
