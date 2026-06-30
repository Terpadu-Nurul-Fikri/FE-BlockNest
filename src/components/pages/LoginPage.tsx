import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { authService } from "../../lib/authService";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || "/";
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getRedirectPath = (role?: string) => {
    if (role === "ADMIN") return "/admin";
    return from.startsWith("/admin") ? "/" : from;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Email dan password harus diisi");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(formData.email, formData.password);

      if (response.success && response.token) {
        const d = response.data;
        const [firstName, ...rest] = (d.name || d.firstName || "").split(" ");
        login(response.token, {
          id: d.id,
          name: d.name || `${d.firstName} ${d.lastName || ""}`.trim(),
          email: d.email,
          firstName: firstName || d.firstName,
          lastName: rest.join(" ") || d.lastName,
          phone: d.phone,
          role: d.role,
        });
        setSuccess("Login berhasil! Mengalihkan...");
        setTimeout(() => navigate(getRedirectPath(d.role), { replace: true }), 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-semibold tracking-tight text-stone-900">
            Block<span className="text-stone-400">Nest</span>
          </Link>
          <h2 className="text-xl font-light text-stone-700 mt-3">Masuk ke akun kamu</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 p-3.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
                placeholder="email@kamu.com"
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-stone-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-stone-500 hover:text-stone-900 hover:underline">
                  Lupa password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-700 disabled:bg-stone-400 text-white font-medium text-sm rounded-xl transition-colors cursor-pointer"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-stone-500">
            Belum punya akun?{" "}
            <Link to="/register" className="text-stone-900 font-medium hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
