import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Plus, Pencil, Trash2, Search, ArrowLeft, Save } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { productApi, categoryApi, type AdminProduct, type AdminCategory, type ProductFormData } from "../../lib/adminService";

// ── Product List ──────────────────────────────────────────────────────────────

export function AdminProductList() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [filtered, setFiltered] = useState<AdminProduct[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    productApi.getAll()
      .then((res) => { setProducts(res.data); setFiltered(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(products.filter((p) =>
      p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)
    ));
  }, [search, products]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus produk "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setDeleting(id);
    try {
      await productApi.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">Produk</h1>
            <p className="text-sm text-stone-400 mt-1">{products.length} produk terdaftar</p>
          </div>
          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Tambah Produk
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-stone-50 rounded-xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-stone-400 text-sm">
                {search ? "Tidak ada produk yang cocok" : "Belum ada produk"}
              </p>
              {!search && (
                <Link to="/admin/products/new" className="mt-3 inline-block text-sm text-stone-700 underline">
                  Tambah produk pertama
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">Produk</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-wider hidden sm:table-cell">Harga</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-wider hidden md:table-cell">Stok</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-wider hidden lg:table-cell">Kategori</th>
                    <th className="px-5 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.map((product) => (
                    <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">?</div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-stone-800">{product.name}</p>
                            <p className="text-xs text-stone-400 font-mono">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell text-stone-700">
                        Rp {Number(product.price).toLocaleString("id-ID")}
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          product.stockQuantity <= 0 ? "bg-red-100 text-red-600" :
                          product.stockQuantity <= 5 ? "bg-yellow-100 text-yellow-600" :
                          "bg-green-100 text-green-600"
                        }`}>
                          {product.stockQuantity} unit
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell text-stone-500 text-xs">
                        {product.category || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <Link
                            to={`/admin/products/${product.id}/edit`}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            disabled={deleting === product.id}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

// ── Product Form (Create / Edit) ──────────────────────────────────────────────

const EMPTY_FORM: ProductFormData & { subCategory: string } = {
  name: "", slug: "", subCategory: "", price: 0, stockQuantity: 0,
  categoryId: "", isNew: false,
  images: [{ imageUrl: "", imageAlt: "", isPrimary: true }],
};

export function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(EMPTY_FORM);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    categoryApi.getAll().then((res) => setCategories(res.data)).catch(() => {});
    if (isEdit) {
      productApi.getById(id!)
        .then((res) => {
          const p = res.data;
          setForm({
            name: p.name,
            slug: p.slug,
            subCategory: p.category || "",
            price: Number(p.price),
            stockQuantity: p.stockQuantity,
            categoryId: p.categoryId || "",
            isNew: p.isNew,
            images: p.images?.length
              ? p.images.map((img) => ({ imageUrl: img.imageUrl, imageAlt: img.imageAlt || "", isPrimary: img.isPrimary }))
              : [{ imageUrl: "", imageAlt: "", isPrimary: true }],
          });
        })
        .catch(() => setError("Gagal memuat produk"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.slug || form.price <= 0) {
      setError("Nama, slug, dan harga wajib diisi");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
        categoryId: form.categoryId || undefined,
        images: form.images?.filter((img) => img.imageUrl.trim()),
      };
      if (isEdit) {
        await productApi.update(id!, payload);
      } else {
        await productApi.create(payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const updateImage = (index: number, field: string, value: string) => {
    setForm((f) => ({
      ...f,
      images: f.images!.map((img, i) => i === index ? { ...img, [field]: value } : img),
    }));
  };

  const addImage = () => setForm((f) => ({
    ...f,
    images: [...(f.images || []), { imageUrl: "", imageAlt: "", isPrimary: false }],
  }));

  const removeImage = (index: number) => setForm((f) => ({
    ...f,
    images: f.images!.filter((_, i) => i !== index),
  }));

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin/products" className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-stone-900">
              {isEdit ? "Edit Produk" : "Tambah Produk"}
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic info */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wider">Informasi Dasar</h2>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Nama Produk *</label>
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Slug *</label>
                <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-stone-300" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Sub-Kategori</label>
                <input type="text" value={form.subCategory} onChange={(e) => setForm((f) => ({ ...f, subCategory: e.target.value }))}
                  placeholder="cth: Sofas, Chairs"
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Harga (Rp) *</label>
                <input type="number" min="0" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Stok *</label>
                <input type="number" min="0" value={form.stockQuantity} onChange={(e) => setForm((f) => ({ ...f, stockQuantity: Number(e.target.value) }))}
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Kategori</label>
              <select value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white">
                <option value="">— Tanpa Kategori —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.isNew} onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))}
                className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-300" />
              <span className="text-sm text-stone-700">Tandai sebagai produk baru</span>
            </label>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wider">Gambar Produk</h2>
              <button type="button" onClick={addImage}
                className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors cursor-pointer">
                <Plus className="w-3.5 h-3.5" /> Tambah Gambar
              </button>
            </div>
            {form.images?.map((img, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex-1 space-y-2">
                  <input type="url" value={img.imageUrl} onChange={(e) => updateImage(i, "imageUrl", e.target.value)}
                    placeholder="URL gambar (https://...)"
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" />
                  <input type="text" value={img.imageAlt} onChange={(e) => updateImage(i, "imageAlt", e.target.value)}
                    placeholder="Alt text (deskripsi gambar)"
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" />
                </div>
                {img.imageUrl && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
                {form.images!.length > 1 && (
                  <button type="button" onClick={() => removeImage(i)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer shrink-0 mt-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-700 disabled:bg-stone-400 transition-colors cursor-pointer">
              <Save className="w-4 h-4" />
              {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Produk"}
            </button>
            <Link to="/admin/products"
              className="px-6 py-3 text-stone-600 text-sm font-medium rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
