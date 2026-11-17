const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");

export type ApiOptions = Omit<RequestInit, "body"> & { body?: unknown };

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const token = typeof window !== "undefined" ? (localStorage.getItem("lenden_access_token") || sessionStorage.getItem("lenden_access_token")) : null;
  const headers = new Headers(options.headers);
  const { body, ...requestOptions } = options;
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.message || "Something went wrong");
  return payload as T;
}

export const auth = {
  sendOtp: (identifier: { phoneNumber?: string; email?: string }) => apiRequest<{ devOtpHint?: string }>("/auth/send-otp", { method: "POST", body: identifier }),
  verifyOtp: (identifier: { phoneNumber?: string; email?: string }, otp: string, fullName?: string) => apiRequest<{ accessToken: string; user: User }>("/auth/verify-otp", {
    method: "POST",
    body: {
      ...identifier,
      // OTPs are numeric; normalize pasted values before they reach the API.
      otp: otp.replace(/\D/g, "").slice(0, 4),
      ...(fullName ? { fullName } : {}),
    },
  }),
  login: (email: string, password: string) => apiRequest<{ accessToken: string; user: User }>("/auth/login", { method: "POST", body: { email, password } }),
  resetPassword: (email: string, otp: string, password: string) => apiRequest<{ success: boolean }>("/auth/reset-password", { method: "POST", body: { email, otp, password } }),
  setPassword: (password: string) => apiRequest<{ success: boolean }>("/auth/set-password", { method: "POST", body: { password } }),
  saveSession(session: { accessToken: string; user: User }, phoneNumber?: string, remember = true) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("lenden_access_token", session.accessToken);
    storage.setItem("lenden_user", JSON.stringify(session.user));
    if (phoneNumber) storage.setItem("lenden_phone", phoneNumber);
  },
  saveAvatar(avatarUrl: string) {
    if (avatarUrl) localStorage.setItem("lenden_avatar_url", avatarUrl);
    else localStorage.removeItem("lenden_avatar_url");
  },
  clearSession() { for (const storage of [localStorage, sessionStorage]) { storage.removeItem("lenden_access_token"); storage.removeItem("lenden_user"); storage.removeItem("lenden_phone"); } localStorage.removeItem("lenden_avatar_url"); },
};

export type User = { id: string; fullName: string; phoneNumber?: string | null; email?: string | null; avatarUrl?: string | null; language: string; appLockEnabled: boolean };
export type ApiContact = { id: string; fullName: string; phoneNumber: string; initials: string; avatarUrl?: string | null; note?: string | null; balanceType: "TO_RECEIVE" | "TO_PAY" | "SETTLED"; balanceAmount: number };
export type ApiTransaction = { id: string; contactId: string; contactName: string; type: "I_GAVE" | "I_TOOK"; title: string; amount: number; date: string; note?: string | null; dueDate?: string | null };

export const api = {
  people: () => apiRequest<ApiContact[]>("/contacts"),
  person: (id: string) => apiRequest<ApiContact & { transactions: ApiTransaction[] }>(`/contacts/${id}`),
  createPerson: (body: { fullName: string; phoneNumber: string; avatarUrl?: string; note?: string }) => apiRequest<ApiContact>("/contacts", { method: "POST", body }),
  updatePerson: (id: string, body: { fullName: string; phoneNumber: string; avatarUrl?: string; note?: string }) => apiRequest<ApiContact>(`/contacts/${id}`, { method: "PATCH", body }),
  deletePerson: (id: string) => apiRequest<{ success: boolean }>(`/contacts/${id}`, { method: "DELETE" }),
  activity: (filter?: string, month?: string) => apiRequest<ApiTransaction[]>(`/transactions/activity?${new URLSearchParams({ ...(filter && filter !== "all" ? { filter } : {}), ...(month ? { month } : {}) })}`),
  addEntry: (body: { contactId: string; type: "I_GAVE" | "I_TOOK"; amount: number; date?: string; note?: string; dueDate?: string }) => apiRequest<ApiTransaction>("/transactions/add-entry", { method: "POST", body }),
  dashboard: () => apiRequest<{ userName: string; avatarInitials: string; netBalance: number; totalToReceive: number; totalToPay: number; pendingReminders: unknown[]; recentPeople: unknown[] }>("/dashboard/summary"),
  profile: () => apiRequest<User & { avatarInitials: string }>("/users/me"),
  updateProfile: (body: Partial<Pick<User, "fullName" | "language" | "appLockEnabled" | "avatarUrl">>) => apiRequest<{ profile: User }>("/users/me", { method: "PATCH", body }),
  deleteAccount: () => apiRequest<{ success: boolean }>("/users/me", { method: "DELETE" }),
  exportRecords: () => apiRequest<{ downloadUrl: string }>("/reports/export-records"),
};
