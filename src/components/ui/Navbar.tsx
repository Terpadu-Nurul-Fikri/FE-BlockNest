import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  User,
  LogOut,
  Package,
  ChevronDown,
  LayoutDashboard,
  X,
  Menu,
  Home,
  Sofa,
  Bed,
  UtensilsCrossed,
  Monitor,
  TreePine,
  Tag,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import SearchOverlay from "./SearchOverlay";

const NAV_LINKS = [
  { label: "Living Room", slug: "living-room", Icon: Sofa },
  { label: "Bedroom",     slug: "bedroom",     Icon: Bed },
  { label: "Dining",      slug: "dining",       Icon: UtensilsCrossed },
  { label: "Office",      slug: "office",       Icon: Monitor },
  { label: "Outdoor",     slug: "outdoor",      Icon: TreePine },
  { label: "Sale",        slug: "sale",         Icon: Tag },
];

export default function Navbar() {
  const { totalItems: cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  const currentSlug = pathname.replace(/^\//, "").split("/")[0];

  // Close user dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  const displayName = user?.firstName || user?.name?.split(" ")[0] || "User";
  const fullName = user?.name || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        ref={headerRef}
        className="bg-white border-b border-stone-100 sticky top-0 z-50"
      >
        <nav
          aria-label="Main navigation"
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6"
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
          <ul className="hidden md:flex items-center gap-7 flex-1">
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
                          : "text-rose-500 hover:text-rose-700"
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
          <div className="flex items-center gap-1.5">
            {/* Search button */}
            <button
              aria-label="Open search"
              onClick={() => setSearchOpen((v) => !v)}
              className={`flex w-9 h-9 items-center justify-center rounded-full transition-colors duration-200 cursor-pointer ${
                searchOpen
                  ? "bg-stone-900 text-white"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-900"
              }`}
            >
              {searchOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
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
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-stone-900 text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* User menu — desktop only */}
            {isAuthenticated ? (
              <div className="hidden sm:block relative" ref={userMenuRef}>
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
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-100/80 py-2 z-50">
                    <div className="px-4 py-3 border-b border-stone-100">
                      <p className="text-sm font-semibold text-stone-900 truncate">{fullName}</p>
                      <p className="text-xs text-stone-400 truncate mt-0.5">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-stone-400" /> Profil Saya
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                      >
                        <Package className="w-4 h-4 text-stone-400" /> Pesanan Saya
                      </Link>
                      {user?.role === "ADMIN" && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-stone-400" /> Admin Panel
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-stone-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Logout
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

            {/* Hamburger — mobile only */}
            <button
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex w-9 h-9 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 transition-colors duration-200 cursor-pointer"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Search dropdown — inline, below this nav */}
          {searchOpen && (
            <SearchOverlay
              isOpen={searchOpen}
              onClose={() => setSearchOpen(false)}
            />
          )}
        </nav>
      </header>

      {/* ── Mobile full-screen side drawer ──────────────────────────────── */}
      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-[60] bg-stone-950/40 backdrop-blur-[2px]"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel — slides in from right */}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 z-[70] w-72 bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-modal="true"
        role="dialog"
        aria-label="Mobile navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-stone-100 shrink-0">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight text-stone-900"
            onClick={() => setMobileOpen(false)}
          >
            Block<span className="text-stone-400">Nest</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="w-8 h-8 flex items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Nav links */}
          <div className="px-3 mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 px-3 mb-2">
              Kategori
            </p>
            <ul className="space-y-0.5">
              <li>
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    currentSlug === ""
                      ? "bg-stone-900 text-white"
                      : "text-stone-700 hover:bg-stone-50"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Beranda
                </Link>
              </li>
              {NAV_LINKS.map(({ label, slug, Icon }) => {
                const isActive = currentSlug === slug;
                const isSale = slug === "sale";
                return (
                  <li key={slug}>
                    <Link
                      to={`/${slug}`}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isSale
                          ? isActive
                            ? "bg-rose-600 text-white"
                            : "text-rose-600 hover:bg-rose-50"
                          : isActive
                          ? "bg-stone-900 text-white"
                          : "text-stone-700 hover:bg-stone-50"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mx-4 my-3 border-t border-stone-100" />

          {/* Account section */}
          <div className="px-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 px-3 mb-2">
              Akun
            </p>
            {isAuthenticated ? (
              <div className="space-y-0.5">
                {/* User info card */}
                <div className="flex items-center gap-3 px-3 py-3 mb-1 rounded-xl bg-stone-50">
                  <span className="w-9 h-9 rounded-full bg-stone-900 text-white text-sm font-semibold flex items-center justify-center shrink-0">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-stone-900 truncate">{fullName}</p>
                    <p className="text-xs text-stone-400 truncate">{user?.email}</p>
                  </div>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <User className="w-4 h-4 text-stone-400" /> Profil Saya
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  <Package className="w-4 h-4 text-stone-400" /> Pesanan Saya
                </Link>
                {user?.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-stone-400" /> Admin Panel
                  </Link>
                )}
              </div>
            ) : (
              <div className="px-1 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-medium text-stone-700 border border-stone-200 hover:bg-stone-50 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center w-full py-2.5 rounded-xl text-sm font-medium text-white bg-stone-900 hover:bg-stone-700 transition-colors"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Drawer footer — logout */}
        {isAuthenticated && (
          <div className="px-4 py-4 border-t border-stone-100 shrink-0">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
