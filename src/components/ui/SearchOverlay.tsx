/**
 * SearchOverlay — Simple, minimal search dropdown
 * Opens directly below the navbar, no full-screen takeover.
 * Debounced API calls + frontend fuzzy re-ranking.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ArrowRight } from "lucide-react";
import { API_BASE_URL } from "../../lib/apiConfig";
import { formatIDR } from "../../lib/utils";

interface SearchProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  imageAlt: string;
  slug: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// ── Relevance scoring ────────────────────────────────────────────────────────
function score(p: SearchProduct, q: string): number {
  const name = p.name.toLowerCase();
  const cat = (p.category || "").toLowerCase();
  const lq = q.toLowerCase();
  if (name === lq) return 100;
  if (name.startsWith(lq)) return 80;
  if (name.includes(lq)) return 60;
  if (cat.includes(lq)) return 40;
  return 10;
}

export default function SearchOverlay({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  // Auto-focus & reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults([]);
      setActiveIdx(-1);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  // Debounced fetch
  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/products/search?q=${encodeURIComponent(q)}&limit=15`
      );
      const json = await res.json();
      if (json.success) {
        const ranked = (json.data as SearchProduct[])
          .map((p) => ({ p, s: score(p, q) }))
          .sort((a, b) => b.s - a.s)
          .map((x) => x.p)
          .slice(0, 6);
        setResults(ranked);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => doSearch(query), 280);
    return () => clearTimeout(t);
  }, [query, doSearch]);

  const go = (product: SearchProduct) => {
    onClose();
    navigate(`/product/${product.slug}`);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }
    if (!results.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
    if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); go(results[activeIdx]); }
  };

  if (!isOpen) return null;

  const hasResults = results.length > 0;
  const isEmpty = !loading && query.trim() && !hasResults;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cari produk"
      className="absolute left-0 right-0 top-full z-50 bg-white border-b border-stone-100 shadow-lg rounded-b-2xl"
    >
      {/* Input row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-3.5 border-b border-stone-100">
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIdx(-1); }}
            onKeyDown={handleKey}
            placeholder="Cari produk..."
            className="flex-1 text-sm text-stone-900 placeholder:text-stone-400 bg-transparent border-none outline-none"
          />
          {loading && (
            <div className="w-3.5 h-3.5 border-[1.5px] border-stone-200 border-t-stone-500 rounded-full animate-spin shrink-0" />
          )}
          {query && !loading && (
            <button
              type="button"
              onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
              aria-label="Clear"
              className="text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-stone-400 hover:text-stone-700 transition-colors cursor-pointer ml-1 shrink-0"
          >
            Tutup
          </button>
        </div>

        {/* Results */}
        {hasResults && (
          <ul className="py-2">
            {results.map((p, i) => (
              <li key={p.id}>
                <button
                  onClick={() => go(p)}
                  className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    i === activeIdx ? "bg-stone-50" : "hover:bg-stone-50/80"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                    {p.imageUrl && (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate">{p.name}</p>
                    <p className="text-xs text-stone-400">{p.category}</p>
                  </div>
                  <span className="text-xs font-medium text-stone-700 whitespace-nowrap shrink-0">
                    {formatIDR(p.price)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                </button>
              </li>
            ))}
            {query.trim() && (
              <li className="border-t border-stone-100 mt-1 pt-1">
                <button
                  onClick={() => { onClose(); navigate(`/search?q=${encodeURIComponent(query.trim())}`); }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  <Search className="w-3 h-3" />
                  Lihat semua hasil untuk &ldquo;{query}&rdquo;
                </button>
              </li>
            )}
          </ul>
        )}

        {isEmpty && (
          <div className="py-6 text-center">
            <p className="text-sm text-stone-400">
              Tidak ada hasil untuk &ldquo;<span className="text-stone-700 font-medium">{query}</span>&rdquo;
            </p>
          </div>
        )}

        {!query && !loading && (
          <div className="py-5 text-center">
            <p className="text-xs text-stone-400">Ketik nama produk untuk mencari...</p>
          </div>
        )}
      </div>
    </div>
  );
}
