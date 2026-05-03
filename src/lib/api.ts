/**
 * Lightweight API client for the Fanja FastAPI backend.
 *
 * In dev (Vite), set VITE_API_BASE=http://localhost:8000 in a .env file
 * (or rely on a Vite proxy). In production behind Nginx, requests go to
 * the same origin (`/api/...`) and the proxy forwards them.
 *
 * Admin endpoints are protected by Nginx Basic Auth — the browser
 * automatically attaches the credentials popup result, so the client
 * doesn't need to handle auth tokens itself.
 */

const BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include", // send Basic Auth cookie/header on admin paths
    headers: {
      ...(init.body && !(init.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(init.headers || {}),
    },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} — ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---------- Types ----------
export type Room = {
  id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  size: number;
  image: string;
  description: string;
  amenities: string[];
};

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  created_at: string;
};

export type Promo = {
  id: string;
  title: string;
  description: string;
  discount_percent: number;
  valid_until: string;
  image?: string;
  active: boolean;
};

export type Photo = {
  id: string;
  url: string;
  caption?: string;
  category: string;
  uploaded_at?: string;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  icon: string;
  image?: string | null;
  featured: boolean;
  order: number;
};

export type Reservation = {
  id: string;
  booking_number: string;
  room_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  total: number;
  nights: number;
  status: string;
  created_at: string;
};

// ---------- Public API ----------
export const api = {
  rooms: () => request<Room[]>("/api/rooms"),
  articles: () => request<Article[]>("/api/articles"),
  promos: () => request<Promo[]>("/api/promos"),
  photos: () => request<Photo[]>("/api/photos"),
  activities: () => request<Activity[]>("/api/activities"),
  createReservation: (data: Omit<Reservation, "id" | "booking_number" | "total" | "nights" | "status" | "created_at">) =>
    request<Reservation>("/api/reservations", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ---------- Admin API (requires Basic Auth via Nginx) ----------
export const adminApi = {
  me: () => request<{ user: string; authenticated: boolean }>("/api/admin/me"),

  // Rooms
  createRoom: (data: Omit<Room, "id">) =>
    request<Room>("/api/admin/rooms", { method: "POST", body: JSON.stringify(data) }),
  updateRoom: (id: string, data: Omit<Room, "id">) =>
    request<Room>(`/api/admin/rooms/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteRoom: (id: string) =>
    request<{ deleted: boolean }>(`/api/admin/rooms/${id}`, { method: "DELETE" }),

  // Articles
  createArticle: (data: Omit<Article, "id" | "created_at">) =>
    request<Article>("/api/admin/articles", { method: "POST", body: JSON.stringify(data) }),
  updateArticle: (id: string, data: Omit<Article, "id" | "created_at">) =>
    request<Article>(`/api/admin/articles/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteArticle: (id: string) =>
    request<{ deleted: boolean }>(`/api/admin/articles/${id}`, { method: "DELETE" }),

  // Promos
  createPromo: (data: Omit<Promo, "id">) =>
    request<Promo>("/api/admin/promos", { method: "POST", body: JSON.stringify(data) }),
  updatePromo: (id: string, data: Omit<Promo, "id">) =>
    request<Promo>(`/api/admin/promos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePromo: (id: string) =>
    request<{ deleted: boolean }>(`/api/admin/promos/${id}`, { method: "DELETE" }),

  // Photos
  createPhoto: (data: Omit<Photo, "id" | "uploaded_at">) =>
    request<Photo>("/api/admin/photos", { method: "POST", body: JSON.stringify(data) }),
  updatePhoto: (id: string, data: Omit<Photo, "id" | "uploaded_at">) =>
    request<Photo>(`/api/admin/photos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePhoto: (id: string) =>
    request<{ deleted: boolean }>(`/api/admin/photos/${id}`, { method: "DELETE" }),

  // Activities
  createActivity: (data: Omit<Activity, "id">) =>
    request<Activity>("/api/admin/activities", { method: "POST", body: JSON.stringify(data) }),
  updateActivity: (id: string, data: Omit<Activity, "id">) =>
    request<Activity>(`/api/admin/activities/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteActivity: (id: string) =>
    request<{ deleted: boolean }>(`/api/admin/activities/${id}`, { method: "DELETE" }),

  // Upload
  upload: async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return request<{ url: string; filename: string }>("/api/admin/upload", {
      method: "POST",
      body: fd,
    });
  },

  // Reservations
  reservations: () => request<Reservation[]>("/api/admin/reservations"),
  deleteReservation: (id: string) =>
    request<{ deleted: boolean }>(`/api/admin/reservations/${id}`, { method: "DELETE" }),
  confirmReservation: (id: string) =>
    request<Reservation>(`/api/admin/reservations/${id}/confirm`, { method: "POST" }),
  notifications: () =>
    request<{ count: number; items: Reservation[] }>(`/api/admin/notifications`),
};
