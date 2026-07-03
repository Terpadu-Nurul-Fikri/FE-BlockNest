import { API_BASE_URL } from "./apiConfig";

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    name?: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    photoUrl?: string;
    role: string;
    createdAt?: string;
    updatedAt?: string;
  };
  token?: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  resetToken?: string;
  resetUrl?: string;
}

interface UploadPhotoResponse {
  status: string;
  message: string;
  data: {
    id: string;
    firstName: string;
    lastName?: string;
    email: string;
    photoUrl: string;
  };
}

export const authService = {
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName?: string;
    phone?: string;
  }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Register gagal");
    }

    return res.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Login gagal");
    }

    return res.json();
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Gagal meminta reset password");
    }

    return json;
  },

  async resetPassword(
    token: string,
    password: string,
  ): Promise<ForgotPasswordResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Gagal reset password");
    }

    return json;
  },

  async getProfile(token: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Gagal ambil profile");
    }

    return res.json();
  },

  saveToken(token: string): void {
    localStorage.setItem("auth_token", token);
  },

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  },

  removeToken(): void {
    localStorage.removeItem("auth_token");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  },

  async updateProfile(
    token: string,
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      currentPassword?: string;
      newPassword?: string;
    },
  ): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Gagal update profil");
    }

    return res.json();
  },

  async uploadPhoto(token: string, file: File): Promise<UploadPhotoResponse> {
    const formData = new FormData();
    formData.append("photo", file);

    const res = await fetch(`${API_BASE_URL}/api/users/profile/photo`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Gagal mengunggah foto profil");
    }
    return json;
  },
};
