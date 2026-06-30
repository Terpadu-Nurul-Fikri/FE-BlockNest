import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  Images,
  Star,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Dashboard",  href: "/admin",            icon: LayoutDashboard },
  { label: "Produk",     href: "/admin/products",   icon: Package },
  { label: "Kategori",   href: "/admin/categories", icon: Tag },
  { label: "Pesanan",    href: "/admin/orders",      icon: ShoppingCart },
  { label: "Banner",     href: "/admin/banners",    icon: Images },
  { label: "Review",     href: "/admin/reviews",    icon: Star },
];

// ── Sidebar content ──────────────────────────────────────────────────────────

interface SidebarContentProps {
  pathname: string;
  userName: string;
  userEmail: string;
  userInitial: string;
  onLinkClick?: () => void;
  onLogout: () => void;
}

function SidebarContent({
  pathname,
  userName,
  userEmail,
  userInitial,
  onLinkClick,
  onLogout,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm shrink-0">
          BN
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">BlockNest</p>
          <p className="text-xs text-sidebar-foreground/50 truncate">Admin Panel</p>
        </div>
        <Badge variant="secondary" className="text-[10px] shrink-0">v1</Badge>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
          Navigasi
        </p>
        <ul className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/admin" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  to={href}
                  onClick={onLinkClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="flex-1">{label}</span>
                  {isActive && (
                    <ChevronRight className="size-3.5 text-sidebar-foreground/40" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <Separator className="my-4 bg-sidebar-border" />

        <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
          Quick Link
        </p>
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
        >
          <ExternalLink className="size-4 shrink-0" />
          Lihat Toko
        </Link>
      </nav>

      {/* User footer */}
      <div className="px-2 py-3 border-t border-sidebar-border shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-lg bg-sidebar-accent/30">
          <div className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold shrink-0">
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">{userEmail}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors cursor-pointer"
        >
          <LogOut className="size-4 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );
}

// ── Admin Layout ─────────────────────────────────────────────────────────────

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userName =
    user?.name || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
  const userEmail = user?.email ?? "";
  const userInitial = (user?.firstName || user?.name || "A")
    .charAt(0)
    .toUpperCase();

  const sidebarProps: SidebarContentProps = {
    pathname,
    userName,
    userEmail,
    userInitial,
    onLogout: handleLogout,
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-60 shrink-0 border-r border-border overflow-hidden">
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile sidebar drawer ── */}
      <aside
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-50 w-64 shadow-2xl transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          {...sidebarProps}
          onLinkClick={() => setMobileOpen(false)}
        />
      </aside>

      {/* ── Main content ── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between h-14 px-4 border-b border-border bg-background shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
          <span className="text-sm font-semibold">Admin Panel</span>
          <div className="size-8" />
        </header>

        {/* Desktop top bar */}
        <header className="hidden md:flex items-center justify-between h-14 px-6 border-b border-border bg-background shrink-0">
          <div className="flex items-center gap-2">
            {/* Breadcrumb: current section */}
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const isActive =
                pathname === href ||
                (href !== "/admin" && pathname.startsWith(href));
              if (!isActive) return null;
              return (
                <div key={href} className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Icon className="size-4 text-muted-foreground" />
                  {label}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{userName}</span>
            <Badge variant="outline" className="text-[10px]">ADMIN</Badge>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
