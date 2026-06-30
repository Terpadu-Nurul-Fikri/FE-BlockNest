import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Plus, Pencil, Trash2, ArrowLeft, Save } from "lucide-react";
import AdminLayout from "./AdminLayout";
import { categoryApi, type AdminCategory, type CategoryFormData } from "../../lib/adminService";

// ── Category List ─────────────────────────────────────────────────────────────

export function AdminCategoryList() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    categoryApi.getAll()
      .then((res) => setCategories(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Hapus kategori "${label}"?`)) return;
    setDeleting(id);
    try {
      await categoryApi.delete(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">Kategori</h1>
            <p className="text-sm text-stone-400 mt-1">{categories.length} kategori terdaftar</p>
          </div>
          <Link to="/admin/categories/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-700 transition-colors">
            <Plus className="w-4 h-4" /> Tambah Kategori
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-stone-50 rounded-xl animate-pulse" />)}
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-stone-400 text-sm">Belum ada kategori</p>
              <Link to="/admin/categories/new" className="mt-3 inline-block text-sm text-stone-700 underline">
                Tambah kategori pertama
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">Kategori</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-wider hidden sm:table-cell">Slug</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-400 uppercase tracking-wider hidden md:table-cell">Produk</th>
                    <th className="px-5 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {cat.heroImage ? (
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                              <img src={cat.heroImage} alt={cat.label} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-stone-400 text-xs shrink-0">
                              {cat.label.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-stone-800">{cat.label}</p>
                            {cat.headline && <p className="text-xs text-stone-400 truncate max-w-xs">{cat.headline}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell text-stone-400 font-mono text-xs">{cat.slug}</td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded-full text-xs">
                          {cat._count?.products ?? 0} produk
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <Link to={`/admin/categories/${cat.id}/edit`}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors" title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          <button onClick={() => handleDelete(cat.id, cat.label)} disabled={deleting === cat.id}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50" title="Hapus">
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

// ── Category Form ─────────────────────────────────────────────────────────────

const EMPTY: CategoryFormData = {
  slug: "", label: "", headline: "", description: "",
  seoDescription: "", heroImage: "", heroAlt: "", ogImage: "",
};

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export function AdminCategoryForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState<CategoryFormData>(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      categoryApi.getById(id!)
        .then((res) => {
          const c = res.data;
          setForm({
            slug: c.slug, label: c.label, headline: c.headline || "",
            description: c.description || "", seoDescription: c.seoDescription || "",
            heroImage: c.heroImage || "", heroAlt: c.heroAlt || "", ogImage: c.ogImage || "",
          });
        })
        .catch(() => setError("Gagal memuat kategori"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const set = (field: keyof CategoryFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const label = e.target.value;
    setForm((f) => ({
      ...f,
      label,
      slug: !isEdit || !f.slug ? toSlug(label) : f.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.label) {
      setError("Label wajib diisi");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, slug: form.slug || toSlug(form.label) };
      if (isEdit) {
        await categoryApi.update(id!, payload);
      } else {
        await categoryApi.create(payload);
      }
      navigate("/admin/categories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const Field = ({ label, field, placeholder, required = false }: { label: string; field: keyof CategoryFormData; placeholder?: string; required?: boolean }) => (
    <div>
      <label className="block text-xs font-medium text-stone-500 mb-1.5">{label}{required && " *"}</label>
      <input type="text" value={form[field] as string} onChange={set(field)} placeholder={placeholder} required={required}
        className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" />
    </div>
  );

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin/categories" className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-semibold text-stone-900">
            {isEdit ? "Edit Kategori" : "Tambah Kategori"}
          </h1>
        </div>

        {error && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wider">Informasi Dasar</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Label *</label>
                <input type="text" value={form.label} onChange={handleLabelChange} placeholder="Living Room" required
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-500 mb-1.5">Slug</label>
                <input type="text" value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: toSlug(e.target.value) }))}
                  placeholder="otomatis dari label"
                  className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-stone-300" />
              </div>
            </div>
            <Field label="Headline" field="headline" placeholder="Living Room Furniture" />
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">Deskripsi</label>
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Deskripsi kategori untuk halaman kategori..."
                rows={3}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">SEO Description</label>
              <textarea value={form.seoDescription} onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
                placeholder="Deskripsi untuk mesin pencari..."
                rows={2}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-stone-700 uppercase tracking-wider">Gambar</h2>
            <Field label="Hero Image URL" field="heroImage" placeholder="https://images.unsplash.com/..." />
            {form.heroImage && (
              <div className="rounded-xl overflow-hidden h-32 bg-stone-100">
                <img src={form.heroImage} alt="preview" className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
            <Field label="Hero Alt Text" field="heroAlt" placeholder="Deskripsi gambar hero" />
            <Field label="OG Image URL" field="ogImage" placeholder="https://..." />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-700 disabled:bg-stone-400 transition-colors cursor-pointer">
              <Save className="w-4 h-4" />
              {saving ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Buat Kategori"}
            </button>
            <Link to="/admin/categories"
              className="px-6 py-3 text-stone-600 text-sm font-medium rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors">
              Batal
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
