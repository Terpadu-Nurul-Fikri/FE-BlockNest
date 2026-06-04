import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, User, LogOut, Package, ChevronDown, LayoutDashboard } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const NAV_LINKS = [
  { label: "Living Room", slug: "living-room" },
  { label: "Bedroom", slug: "bedroom" },
  { label: "Dining", slug: "dining" },
  { label: "Office", slug: "office" },
  { label: "Outdoor", slug: "outdoor" },
  { label: "Sale", slug: "sale" },
];

export default function Navbar() {
  const { totalItems: cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const currentSlug = pathname.replace(/^\//, "").split("/")[0];

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  const displayName = user?.firstName || user?.name?.split(" ")[0] || "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
      <nav
        aria-label="Main navigation"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8"
      >
        {/* Brand */}
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-stone-900 shrink-0"
          aria-label="BlockNest — home"
        >
          Block<span className="text-stone-400">Nest</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, slug }) => {
            const isActive = currentSlug === slug;
            const isSale = slug === "sale";
            return (
              <li key={slug}>
                <Link
                  to={`/${slug}`}
                  className={`text-sm font-medium transition-colors duration-150 ${
                    isSale
                      ? isActive
                        ? "text-rose-700 underline underline-offset-4"
                        : "text-rose-600 hover:text-rose-700"
                      : isActive
                      ? "text-stone-900 underline underline-offset-4"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            aria-label="Open search"
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors duration-200 cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label={`Shopping cart — ${cartCount} items`}
            className="relative flex w-9 h-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition-colors duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-stone-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* User menu */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full hover:bg-stone-100 transition-colors duration-200 cursor-pointer"
                aria-label="User menu"
                aria-expanded={userMenuOpen}
              >
                <span className="w-7 h-7 rounded-full bg-stone-900 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  {initials}
                </span>
                <span className="hidden sm:block text-sm font-medium text-stone-700 max-w-[80px] truncate">
                  {displayName}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-stone-100 py-2 z-50">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-stone-100">
                    <p className="text-sm font-semibold text-stone-900 truncate">
                      {user?.name || `${user?.firstName} ${user?.lastName || ""}`.trim()}
                    </p>
                    <p className="text-xs text-stone-400 truncate mt-0.5">{user?.email}</p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                    >
                      <User className="w-4 h-4 text-stone-400" />
                      Profil Saya
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                    >
                      <Package className="w-4 h-4 text-stone-400" />
                      Pesanan Saya
                    </Link>
                    {user?.role === "ADMIN" && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 hover:text-stone-900 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-stone-400" />
                        Admin Panel
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-stone-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-white bg-stone-900 hover:bg-stone-700 px-4 py-1.5 rounded-lg transition-colors"
              >
                Daftar
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden flex w-9 h-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 transition-colors duration-200 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-4 pb-6 pt-4">
          <ul className="flex flex-col gap-1 mb-4">
            {NAV_LINKS.map(({ label, slug }) => {
              const isActive = currentSlug === slug;
              const isSale = slug === "sale";
              return (
                <li key={slug}>
                  <Link
                    to={`/${slug}`}
                    aria-current={isActive ? "page" : undefined}
                    className={`block py-2.5 px-3 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      isSale
                        ? isActive ? "text-rose-700 bg-rose-50" : "text-rose-600 hover:bg-rose-50"
                        : isActive ? "text-stone-900 bg-stone-100" : "text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Mobile auth */}
          <div className="border-t border-stone-100 pt-4">
            {isAuthenticated ? (
              <div className="space-y-1">
                <div className="flex items-center gap-3 px-3 py-2 mb-2">
                  <span className="w-8 h-8 rounded-full bg-stone-900 text-white text-sm font-semibold flex items-center justify-center">
                    {initials}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-stone-900">{displayName}</p>
                    <p className="text-xs text-stone-400">{user?.email}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-700 hover:bg-stone-50"
                >
                  <User className="w-4 h-4 text-stone-400" /> Profil Saya
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-700 hover:bg-stone-50"
                >
                  <Package className="w-4 h-4 text-stone-400" /> Pesanan Saya
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-stone-700 hover:bg-stone-50"
                  >
                    <LayoutDashboard className="w-4 h-4 text-stone-400" /> Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg text-sm font-medium text-stone-700 border border-stone-200 hover:bg-stone-50"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-lg text-sm font-medium text-white bg-stone-900 hover:bg-stone-700"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
