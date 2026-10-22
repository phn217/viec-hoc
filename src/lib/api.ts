import { supabase } from "./supabase";

// G?i API c?a m?nh, t? g?n token c?a ng??i ?ang ??ng nh?p.
export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("B?n ch?a ??ng nh?p.");

  const res = await fetch(path, {
    ...init,
    headers: {
      ...init.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error ?? "C? l?i x?y ra, vui l?ng th? l?i.");
  return body as T;
}

export function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : "C? l?i x?y ra, vui l?ng th? l?i.";
}
