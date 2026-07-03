import { API_BASE_URL } from "./apiConfig";

export function getPhotoSrc(photoUrl?: string | null): string | null {
  if (!photoUrl) return null;
  if (photoUrl.startsWith("http")) return photoUrl;
  if (photoUrl.startsWith("/")) return `${API_BASE_URL}${photoUrl}`;
  return `${API_BASE_URL}/uploads/profiles/${photoUrl}`;
}
