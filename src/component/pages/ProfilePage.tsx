import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../lib/authService";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  phone?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await authService.getProfile(token);
      if (response.success) {
        setProfile(response.data);
      } else {
        setError("Gagal memuat profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      // Jika token expired, redirect ke login
      if ((err as Error).message.includes("401") || (err as Error).message.includes("expired")) {
        authService.removeToken();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.removeToken();
    navigate("/login");
  };

  if (!authService.isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Anda harus login terlebih dahulu</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Ke Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Memuat profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProfile}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-blue-600">
                {profile?.firstName[0].toUpperCase()}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {profile?.firstName} {profile?.lastName}
            </h1>
            <p className="text-gray-600 text-sm mt-1">{profile?.role}</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">Email:</span>
              <span className="text-gray-900">{profile?.email}</span>
            </div>

            {profile?.phone && (
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">Telepon:</span>
                <span className="text-gray-900">{profile.phone}</span>
              </div>
            )}

            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">User ID:</span>
              <span className="text-gray-900 text-sm">{profile?.id}</span>
            </div>

            {profile?.createdAt && (
              <div className="flex justify-between items-start">
                <span className="text-gray-600 font-medium">Bergabung:</span>
                <span className="text-gray-900 text-sm">
                  {new Date(profile.createdAt).toLocaleDateString("id-ID")}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded-md transition duration-200"
            >
              Kembali ke Beranda
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
