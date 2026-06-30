import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../../lib/authService";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Token reset password tidak ditemukan");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.resetPassword(token, password);
      setSuccess(response.message);
      setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-semibold tracking-tight text-stone-900">
            Block<span className="text-stone-400">Nest</span>
          </Link>
          <h2 className="text-xl font-light text-stone-700 mt-3">Password baru</h2>
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
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Password baru</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
                placeholder="Minimal 6 karakter"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Konfirmasi password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
                placeholder="Ulangi password baru"
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-700 disabled:bg-stone-400 text-white font-medium text-sm rounded-xl transition-colors cursor-pointer"
            >
              {loading ? "Memproses..." : "Reset password"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-stone-500">
            Kembali ke{" "}
            <Link to="/login" className="text-stone-900 font-medium hover:underline">
              login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
