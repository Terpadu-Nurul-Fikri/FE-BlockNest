import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Search,
  AlignLeft,
  ChevronDown,
  X,
} from "lucide-react";

const NAV_ROOMS = ["Living Room", "Bedroom", "Dining"];
const NAV_COLLECTIONS = ["Office", "Outdoor", "Sale"];

const toSlug = (value: string) => value.toLowerCase().replaceAll(" ", "-");

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount] = useState(2);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* Announcement ticker */}
        <div
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          className="bg-[#c9a96e] text-[#0f0e0c] text-[11px] tracking-[0.1em] uppercase text-center py-1.5 px-4"
        >
          Free delivery on orders over Rp 5.000.000 &nbsp;·&nbsp; New Spring
          Collection 2026 now available
        </div>

        {/* Main navbar */}
        <div
          className="relative"
          style={{
            background: "#0f0e0c",
            borderBottom: "1px solid rgba(245,237,224,0.08)",
          }}
        >
          <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-[68px] flex items-center justify-between gap-6">
            {/* ── LEFT ── */}
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "26px",
                  letterSpacing: "0.04em",
                  color: "#f5ede0",
                }}
              >
                BlockNest
                <span style={{ color: "rgba(245,237,224,0.28)" }}>.</span>
              </Link>

              {/* Category trigger — desktop */}
              <button
                type="button"
                onClick={toggleMenu}
                className="hidden md:flex items-center gap-2 transition-all duration-200"
                aria-expanded={menuOpen}
                aria-label="Toggle room menu"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: "none",
                  border: `1px solid ${menuOpen ? "rgba(245,237,224,0.25)" : "rgba(245,237,224,0.12)"}`,
                  borderRadius: "100px",
                  color: menuOpen ? "#f5ede0" : "rgba(245,237,224,0.5)",
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "7px 18px",
                  cursor: "pointer",
                }}
              >
                <AlignLeft size={13} />
                Rooms
                <ChevronDown
                  size={12}
                  style={{
                    transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.25s ease",
                  }}
                />
              </button>
            </div>

            {/* ── CENTER: Search ── */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="hidden md:flex flex-1 max-w-md relative"
            >
              <Search
                size={14}
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "rgba(245,237,224,0.28)" }}
              />
              <input
                type="text"
                placeholder="Search furniture..."
                aria-label="Search products"
                style={{
                  width: "100%",
                  background: "rgba(245,237,224,0.05)",
                  border: "1px solid rgba(245,237,224,0.1)",
                  borderRadius: "100px",
                  color: "#f5ede0",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  fontWeight: 300,
                  padding: "9px 16px 9px 38px",
                  outline: "none",
                  transition: "all 0.25s ease",
                }}
                onFocus={(e) => {
                  e.target.style.background = "rgba(245,237,224,0.08)";
                  e.target.style.borderColor = "rgba(245,237,224,0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.background = "rgba(245,237,224,0.05)";
                  e.target.style.borderColor = "rgba(245,237,224,0.1)";
                }}
              />
            </form>

            {/* ── RIGHT: Actions ── */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Sign in pill — desktop */}
              <button
                type="button"
                className="hidden md:block transition-all duration-200"
                style={{
                  background: "rgba(201,169,110,0.1)",
                  border: "1px solid rgba(201,169,110,0.25)",
                  borderRadius: "100px",
                  color: "#c9a96e",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  padding: "6px 18px",
                  cursor: "pointer",
                }}
              >
                Sign in
              </button>

              <div
                className="hidden md:block w-px h-5 mx-2"
                style={{ background: "rgba(245,237,224,0.1)" }}
              />

              {/* Wishlist */}
              <button
                type="button"
                aria-label="Wishlist"
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
                style={{ color: "rgba(245,237,224,0.45)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(245,237,224,0.06)";
                  e.currentTarget.style.color = "#f5ede0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "rgba(245,237,224,0.45)";
                }}
              >
                <Heart size={18} strokeWidth={1.4} />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                aria-label={`Cart — ${cartCount} items`}
                className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
                style={{ color: "rgba(245,237,224,0.45)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(245,237,224,0.06)";
                  e.currentTarget.style.color = "#f5ede0";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "rgba(245,237,224,0.45)";
                }}
              >
                <ShoppingCart size={18} strokeWidth={1.4} />
                {cartCount > 0 && (
                  <span
                    className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-medium"
                    style={{ background: "#c9a96e", color: "#0f0e0c" }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile hamburger */}
              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
                style={{ color: "rgba(245,237,224,0.5)" }}
              >
                {mobileOpen ? <X size={18} /> : <AlignLeft size={18} />}
              </button>
            </div>
          </nav>

          {/* ── MEGA MENU (desktop) ── */}
          <div
            style={{
              background: "#131210",
              borderTop: "1px solid rgba(245,237,224,0.06)",
              borderBottom: "1px solid rgba(245,237,224,0.06)",
              overflow: "hidden",
              maxHeight: menuOpen ? "340px" : "0px",
              opacity: menuOpen ? 1 : 0,
              transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
            }}
            className={`hidden md:block ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}
          >
            <div
              className="max-w-7xl mx-auto px-6 lg:px-8 py-10 grid gap-12"
              style={{ gridTemplateColumns: "1fr 1fr 300px" }}
            >
              {/* Column 1 */}
              <div>
                <p
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(245,237,224,0.25)",
                    marginBottom: "20px",
                  }}
                >
                  Shop by room
                </p>
                <div className="flex flex-col gap-0.5">
                  {NAV_ROOMS.map((room) => (
                    <Link
                      key={room}
                      to={`/${toSlug(room)}`}
                      onClick={closeMenu}
                      className="group flex items-center gap-2 py-1.5 transition-all duration-200"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "22px",
                        fontWeight: 300,
                        color:
                          pathname === `/${toSlug(room)}`
                            ? "#f5ede0"
                            : "rgba(245,237,224,0.4)",
                        letterSpacing: "0.02em",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#f5ede0")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "rgba(245,237,224,0.4)")
                      }
                    >
                      {room}
                      <span
                        style={{
                          opacity: 0,
                          transform: "translateX(-4px)",
                          transition: "all 0.2s ease",
                          color: "#c9a96e",
                          fontSize: "16px",
                        }}
                        className="group-hover:opacity-100 group-hover:translate-x-0"
                      >
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Column 2 */}
              <div
                style={{
                  borderLeft: "1px solid rgba(245,237,224,0.06)",
                  paddingLeft: "48px",
                }}
              >
                <p
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(245,237,224,0.25)",
                    marginBottom: "20px",
                  }}
                >
                  Collections
                </p>
                <div className="flex flex-col gap-0.5">
                  {NAV_COLLECTIONS.map((item) => (
                    <Link
                      key={item}
                      to={`/${toSlug(item)}`}
                      onClick={closeMenu}
                      className="group flex items-center gap-2 py-1.5 transition-all duration-200"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "22px",
                        fontWeight: 300,
                        color:
                          pathname === `/${toSlug(item)}`
                            ? item === "Sale"
                              ? "#e06b50"
                              : "#f5ede0"
                            : item === "Sale"
                              ? "rgba(205,100,80,0.55)"
                              : "rgba(245,237,224,0.4)",
                        letterSpacing: "0.02em",
                        textDecoration: "none",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color =
                          item === "Sale" ? "#e06b50" : "#f5ede0")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color =
                          item === "Sale"
                            ? "rgba(205,100,80,0.55)"
                            : "rgba(245,237,224,0.4)")
                      }
                    >
                      {item}
                      <span
                        style={{
                          opacity: 0,
                          transform: "translateX(-4px)",
                          transition: "all 0.2s ease",
                          color: "#c9a96e",
                          fontSize: "16px",
                        }}
                      >
                        →
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Promo card */}
              <Link
                to="/sale"
                onClick={closeMenu}
                className="relative rounded-lg overflow-hidden block"
                style={{ height: "220px", cursor: "pointer" }}
                aria-label="Explore spring collection sale"
              >
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop"
                  alt="Spring Collection"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div
                  className="absolute inset-0 flex flex-col justify-end p-5"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(15,14,12,0.85) 0%, rgba(15,14,12,0.1) 60%)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#c9a96e",
                      marginBottom: "6px",
                    }}
                  >
                    New Season
                  </p>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "20px",
                      fontWeight: 300,
                      color: "#f5ede0",
                      lineHeight: 1.2,
                    }}
                  >
                    Spring Collection 2026
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* ── MOBILE MENU ── */}
          {mobileOpen && (
            <div
              className="md:hidden absolute w-full z-40 overflow-y-auto"
              style={{
                background: "#131210",
                borderTop: "1px solid rgba(245,237,224,0.08)",
                height: "calc(100dvh - 68px)",
                top: "68px",
              }}
            >
              {/* Mobile search */}
              <div
                className="p-5 border-b"
                style={{ borderColor: "rgba(245,237,224,0.08)" }}
              >
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "rgba(245,237,224,0.3)" }}
                  />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search products..."
                    aria-label="Search products"
                    style={{
                      width: "100%",
                      background: "rgba(245,237,224,0.05)",
                      border: "1px solid rgba(245,237,224,0.12)",
                      borderRadius: "100px",
                      color: "#f5ede0",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "14px",
                      fontWeight: 300,
                      padding: "10px 16px 10px 38px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div className="p-5">
                <p
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(245,237,224,0.25)",
                    marginBottom: "16px",
                  }}
                >
                  Browse
                </p>
                {[...NAV_ROOMS, ...NAV_COLLECTIONS].map((item) => (
                  <Link
                    key={item}
                    to={`/${toSlug(item)}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-4 border-b transition-all duration-150"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "24px",
                      fontWeight: 300,
                      letterSpacing: "0.02em",
                      color:
                        pathname === `/${toSlug(item)}`
                          ? item === "Sale"
                            ? "#e06b50"
                            : "#f5ede0"
                          : item === "Sale"
                            ? "rgba(205,100,80,0.7)"
                            : "rgba(245,237,224,0.6)",
                      borderColor: "rgba(245,237,224,0.06)",
                      textDecoration: "none",
                    }}
                  >
                    {item}
                    <span
                      style={{
                        fontSize: "16px",
                        color: "rgba(245,237,224,0.2)",
                      }}
                    >
                      →
                    </span>
                  </Link>
                ))}
              </div>

              <div className="p-5 pt-0">
                <button
                  type="button"
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "100px",
                    background: "rgba(201,169,110,0.1)",
                    border: "1px solid rgba(201,169,110,0.3)",
                    color: "#c9a96e",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Backdrop */}
      {menuOpen && !mobileOpen && (
        <div className="fixed inset-0 z-40" onClick={closeMenu} />
      )}
    </>
  );
}
