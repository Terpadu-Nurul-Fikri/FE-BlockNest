/**
 * AdminBanners — redesigned with shadcn/ui components.
 *
 * Bug fix: The old `Field` component was defined INSIDE the `AdminBanners`
 * function, causing React to create a new component identity on every render
 * and unmount/remount every input → focus lost after each keystroke.
 * Fix: All helper components are now defined OUTSIDE the parent component.
 */
import { useEffect, useState } from "react";
import {
  Images,
  Plus,
  Pencil,
  Trash2,
  RefreshCcw,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import AdminLayout from "./AdminLayout";
import { bannerApi } from "../../lib/adminService";
import type { Banner, BannerFormData, BannerType } from "../../lib/bannerService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

// ── Static config ────────────────────────────────────────────────────────────

const BANNER_TYPES: BannerType[] = ["TOP_BAR", "HERO_SLIDER", "POPUP"];

const TYPE_LABELS: Record<BannerType, string> = {
  TOP_BAR: "Top Bar",
  HERO_SLIDER: "Hero Slider",
  POPUP: "Popup",
};

const EMPTY_FORM: BannerFormData = {
  title: "",
  type: "TOP_BAR",
  content: "",
  imageUrl: "",
  imageAlt: "",
  linkUrl: "",
  isActive: true,
  startDate: "",
  endDate: "",
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function typeBadgeVariant(type: BannerType): "default" | "secondary" | "outline" {
  if (type === "TOP_BAR") return "secondary";
  if (type === "HERO_SLIDER") return "default";
  return "outline";
}

// ── FormField — MUST be outside parent component to avoid focus loss ─────────
function FormField({
  id,
  label,
  children,
  required,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

// ── Banner form dialog ────────────────────────────────────────────────────────
interface BannerFormDialogProps {
  open: boolean;
  editId: string | null;
  form: BannerFormData;
  saving: boolean;
  formError: string;
  onChange: (patch: Partial<BannerFormData>) => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

function BannerFormDialog({
  open,
  editId,
  form,
  saving,
  formError,
  onChange,
  onClose,
  onSubmit,
}: BannerFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editId ? "Edit Banner" : "Tambah Banner Baru"}</DialogTitle>
          <DialogDescription>
            Isi form di bawah untuk {editId ? "memperbarui" : "membuat"} banner.
          </DialogDescription>
        </DialogHeader>

        <form id="banner-form" onSubmit={onSubmit} className="flex flex-col gap-4">
          {formError && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
              {formError}
            </p>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField id="banner-title" label="Judul" required>
              <Input
                id="banner-title"
                value={form.title}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="Nama banner"
                required
              />
            </FormField>

            <FormField id="banner-type" label="Tipe">
              <select
                id="banner-type"
                value={form.type}
                onChange={(e) => onChange({ type: e.target.value as BannerType })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {BANNER_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField id="banner-content" label="Konten / Teks">
            <Textarea
              id="banner-content"
              value={form.content}
              onChange={(e) => onChange({ content: e.target.value })}
              placeholder="Teks yang tampil di banner"
              rows={2}
              className="resize-none"
            />
          </FormField>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField id="banner-image-url" label="URL Gambar">
              <Input
                id="banner-image-url"
                type="url"
                value={form.imageUrl}
                onChange={(e) => onChange({ imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </FormField>
            <FormField id="banner-image-alt" label="Alt Gambar">
              <Input
                id="banner-image-alt"
                value={form.imageAlt}
                onChange={(e) => onChange({ imageAlt: e.target.value })}
                placeholder="Deskripsi gambar"
              />
            </FormField>
          </div>

          <FormField id="banner-link-url" label="Link URL">
            <Input
              id="banner-link-url"
              value={form.linkUrl}
              onChange={(e) => onChange({ linkUrl: e.target.value })}
              placeholder="/kategori atau URL lengkap"
            />
          </FormField>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField id="banner-start" label="Tanggal Mulai">
              <Input
                id="banner-start"
                type="date"
                value={form.startDate}
                onChange={(e) => onChange({ startDate: e.target.value })}
              />
            </FormField>
            <FormField id="banner-end" label="Tanggal Selesai">
              <Input
                id="banner-end"
                type="date"
                value={form.endDate}
                onChange={(e) => onChange({ endDate: e.target.value })}
              />
            </FormField>
          </div>

          <div className="flex items-center gap-3 py-1">
            <Switch
              id="banner-active"
              checked={form.isActive}
              onCheckedChange={(v) => onChange({ isActive: v })}
            />
            <Label htmlFor="banner-active" className="cursor-pointer">
              {form.isActive ? "Aktif" : "Nonaktif"}
            </Label>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Batal
          </Button>
          <Button type="submit" form="banner-form" disabled={saving}>
            {saving ? "Menyimpan…" : editId ? "Simpan Perubahan" : "Buat Banner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<BannerFormData>(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await bannerApi.getAll();
      setBanners(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat banner");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setDialogOpen(true);
  };

  const openEdit = (banner: Banner) => {
    setEditId(banner.id);
    setForm({
      title: banner.title,
      type: banner.type,
      content: banner.content || "",
      imageUrl: banner.imageUrl || "",
      imageAlt: banner.imageAlt || "",
      linkUrl: banner.linkUrl || "",
      isActive: banner.isActive,
      startDate: banner.startDate ? banner.startDate.slice(0, 10) : "",
      endDate: banner.endDate ? banner.endDate.slice(0, 10) : "",
    });
    setFormError("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setEditId(null);
    setFormError("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) { setFormError("Judul banner wajib diisi"); return; }
    setSaving(true);
    setFormError("");
    try {
      const payload: BannerFormData = {
        ...form,
        title: form.title.trim(),
        content: form.content?.trim() || undefined,
        imageUrl: form.imageUrl?.trim() || undefined,
        imageAlt: form.imageAlt?.trim() || undefined,
        linkUrl: form.linkUrl?.trim() || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      };
      if (editId) {
        const res = await bannerApi.update(editId, payload);
        setBanners((prev) => prev.map((b) => (b.id === editId ? res.data : b)));
      } else {
        const res = await bannerApi.create(payload);
        setBanners((prev) => [res.data, ...prev]);
      }
      closeDialog();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Gagal menyimpan banner");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus banner ini?")) return;
    try {
      await bannerApi.delete(id);
      setBanners((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus banner");
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      const res = await bannerApi.update(banner.id, { isActive: !banner.isActive });
      setBanners((prev) => prev.map((b) => (b.id === banner.id ? res.data : b)));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal mengubah status banner");
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Banner</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Kelola banner promosi yang ditampilkan di toko.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" onClick={load} disabled={loading}>
              <RefreshCcw data-icon="inline-start" />
              Refresh
            </Button>
            <Button onClick={openCreate}>
              <Plus data-icon="inline-start" />
              Tambah Banner
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="py-3 text-sm text-destructive">{error}</CardContent>
          </Card>
        )}

        {/* Banner form dialog */}
        <BannerFormDialog
          open={dialogOpen}
          editId={editId}
          form={form}
          saving={saving}
          formError={formError}
          onChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
          onClose={closeDialog}
          onSubmit={handleSubmit}
        />

        {/* Banner list */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Banner</CardTitle>
            <CardDescription>{banners.length} banner terdaftar</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex flex-col gap-2 p-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 rounded-md bg-muted animate-pulse" />
                ))}
              </div>
            ) : banners.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <Images className="size-10 text-muted-foreground/30" />
                <p className="text-sm font-medium">Belum ada banner</p>
                <p className="text-xs text-muted-foreground">Klik tombol Tambah Banner untuk mulai</p>
                <Button onClick={openCreate} size="sm">
                  <Plus data-icon="inline-start" />
                  Tambah pertama
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Banner</TableHead>
                    <TableHead className="hidden sm:table-cell">Tipe</TableHead>
                    <TableHead className="hidden md:table-cell">Periode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-sm font-medium truncate">{banner.title}</span>
                          {banner.content && (
                            <span className="text-xs text-muted-foreground truncate max-w-[220px]">
                              {banner.content}
                            </span>
                          )}
                          {banner.linkUrl && (
                            <a
                              href={banner.linkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline w-fit"
                            >
                              <ExternalLink className="size-3" />
                              {banner.linkUrl}
                            </a>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="hidden sm:table-cell">
                        <Badge variant={typeBadgeVariant(banner.type)}>
                          {TYPE_LABELS[banner.type]}
                        </Badge>
                      </TableCell>

                      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                        <div className="flex flex-col gap-0.5">
                          <span>{formatDate(banner.startDate)}</span>
                          <span>→ {formatDate(banner.endDate)}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <button
                          onClick={() => handleToggleActive(banner)}
                          title={banner.isActive ? "Nonaktifkan" : "Aktifkan"}
                          className="flex items-center gap-1.5 cursor-pointer"
                        >
                          {banner.isActive ? (
                            <>
                              <ToggleRight className="size-4 text-green-600" />
                              <span className="text-xs text-green-700 hidden sm:inline">Aktif</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="size-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground hidden sm:inline">Nonaktif</span>
                            </>
                          )}
                        </button>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {banner.imageUrl && (
                            <a
                              href={banner.imageUrl}
                              target="_blank"
                              rel="noreferrer"
                              title="Lihat gambar"
                            >
                              <Button variant="ghost" size="sm">
                                <Images />
                              </Button>
                            </a>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(banner)}
                            title="Edit"
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(banner.id)}
                            title="Hapus"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Image previews for banners with images */}
        {!loading && banners.some((b) => b.imageUrl) && (
          <Card>
            <CardHeader>
              <CardTitle>Preview Gambar Banner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {banners
                  .filter((b) => b.imageUrl)
                  .map((banner) => (
                    <div key={banner.id} className="flex flex-col gap-2">
                      <img
                        src={banner.imageUrl!}
                        alt={banner.imageAlt || banner.title}
                        className="w-full h-28 object-cover rounded-lg bg-muted"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <Separator />
                      <p className="text-xs font-medium truncate">{banner.title}</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
