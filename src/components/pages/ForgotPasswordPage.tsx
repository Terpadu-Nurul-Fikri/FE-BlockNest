import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../lib/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setResetUrl("");

    if (!email.trim()) {
      setError("Email harus diisi");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.forgotPassword(email.trim());
      setMessage(response.message);
      if (response.resetUrl) setResetUrl(response.resetUrl);
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
          <h2 className="text-xl font-light text-stone-700 mt-3">Reset password</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-5 p-3.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
              {message}
            </div>
          )}
          {resetUrl && (
            <div className="mb-5 p-3.5 bg-stone-50 border border-stone-200 rounded-xl text-sm">
              <p className="text-stone-500 mb-2">Link reset development:</p>
              <Link to={new URL(resetUrl).pathname + new URL(resetUrl).search} className="text-stone-900 font-medium break-all hover:underline">
                {resetUrl}
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
                placeholder="email@kamu.com"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-stone-900 hover:bg-stone-700 disabled:bg-stone-400 text-white font-medium text-sm rounded-xl transition-colors cursor-pointer"
            >
              {loading ? "Memproses..." : "Kirim link reset"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-stone-500">
            Ingat password?{" "}
            <Link to="/login" className="text-stone-900 font-medium hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
