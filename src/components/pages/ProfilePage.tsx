import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Package, Edit2, Save, X, Lock } from "lucide-react";
import Navbar from "../ui/Navbar";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../lib/authService";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
  });

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwMode, setPwMode] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  const handleEditToggle = () => {
    if (!editMode) {
      setForm({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
      });
    }
    setEditMode((v) => !v);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSave = async () => {
    if (!form.firstName.trim()) {
      setErrorMsg("Nama depan tidak boleh kosong");
      return;
    }
    setSaving(true);
    setErrorMsg("");
    try {
      const token = authService.getToken()!;
      await authService.updateProfile(token, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
      });
      await refreshUser();
      setSuccessMsg("Profil berhasil diperbarui");
      setEditMode(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError("Password baru tidak cocok");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwError("Password baru minimal 6 karakter");
      return;
    }

    setSaving(true);
    try {
      const token = authService.getToken()!;
      await authService.updateProfile(token, {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwSuccess("Password berhasil diubah");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPwMode(false);
      setTimeout(() => setPwSuccess(""), 3000);
    } catch (err) {
      setPwError(err instanceof Error ? err.message : "Gagal mengubah password");
    } finally {
      setSaving(false);
    }
  };

  const displayName = user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const initials = (user?.firstName || user?.name || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-light text-stone-900">Akun Saya</h1>
          <p className="text-sm text-stone-400 mt-1">Kelola informasi profil dan keamanan akun</p>
        </div>

        {/* Success / Error global */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {errorMsg}
          </div>
        )}

        <div className="space-y-6">
          {/* Profile card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-stone-900 px-6 py-8 flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-2xl font-semibold text-white">{initials}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{displayName}</h2>
                <p className="text-stone-400 text-sm mt-0.5">{user?.email}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 bg-white/10 text-white text-xs rounded-full">
                  {user?.role === "ADMIN" ? "Administrator" : "Customer"}
                </span>
              </div>
            </div>

            {/* Info fields */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider">
                  Informasi Pribadi
                </h3>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  {editMode ? (
                    <><X className="w-4 h-4" /> Batal</>
                  ) : (
                    <><Edit2 className="w-4 h-4" /> Edit</>
                  )}
                </button>
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1.5">
                        Nama Depan *
                      </label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1.5">
                        Nama Belakang
                      </label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-500 mb-1.5">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                      placeholder="08xxxxxxxxxx"
                      className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-300"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-700 disabled:bg-stone-400 transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 py-3 border-b border-stone-50">
                    <User className="w-4 h-4 text-stone-300 shrink-0" />
                    <div>
                      <p className="text-xs text-stone-400">Nama Lengkap</p>
                      <p className="text-sm font-medium text-stone-800 mt-0.5">{displayName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-3 border-b border-stone-50">
                    <Mail className="w-4 h-4 text-stone-300 shrink-0" />
                    <div>
                      <p className="text-xs text-stone-400">Email</p>
                      <p className="text-sm font-medium text-stone-800 mt-0.5">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-3">
                    <Phone className="w-4 h-4 text-stone-300 shrink-0" />
                    <div>
                      <p className="text-xs text-stone-400">Telepon</p>
                      <p className="text-sm font-medium text-stone-800 mt-0.5">
                        {user?.phone || <span className="text-stone-400 italic">Belum diisi</span>}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Password card */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-stone-400" />
                <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider">
                  Keamanan
                </h3>
              </div>
              {!pwMode && (
                <button
                  onClick={() => setPwMode(true)}
                  className="text-sm text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  Ubah Password
                </button>
              )}
            </div>

            {pwSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
                {pwSuccess}
              </div>
            )}

            {pwMode ? (
              <form onSubmit={handlePasswordChange} className="space-y-4">
                {pwError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                    {pwError}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">
                    Password Lama *
                  </label>
                  <input
                    type="password"
                    value={pwForm.currentPassword}
                    onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">
                    Password Baru *
                  </label>
                  <input
                    type="password"
                    value={pwForm.newPassword}
                    onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-500 mb-1.5">
                    Konfirmasi Password Baru *
                  </label>
                  <input
                    type="password"
                    value={pwForm.confirmPassword}
                    onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-700 disabled:bg-stone-400 transition-colors cursor-pointer"
                  >
                    {saving ? "Menyimpan..." : "Simpan Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPwMode(false); setPwError(""); }}
                    className="px-5 py-2.5 text-stone-600 text-sm font-medium rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm text-stone-400">
                Password terakhir diubah: tidak diketahui. Disarankan menggunakan password yang kuat dan unik.
              </p>
            )}
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider mb-4">
              Aktivitas
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/orders"
                className="flex items-center gap-3 p-4 rounded-xl border border-stone-100 hover:border-stone-300 hover:bg-stone-50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center transition-colors">
                  <Package className="w-5 h-5 text-stone-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">Pesanan Saya</p>
                  <p className="text-xs text-stone-400">Lihat riwayat pesanan</p>
                </div>
              </Link>
              <Link
                to="/cart"
                className="flex items-center gap-3 p-4 rounded-xl border border-stone-100 hover:border-stone-300 hover:bg-stone-50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-stone-200 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-800">Keranjang</p>
                  <p className="text-xs text-stone-400">Lihat item di keranjang</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
