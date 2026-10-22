import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

export type Auth = { user: User; db: SupabaseClient };

// ??c token t? header "Authorization: Bearer <token>" v? x?c minh v?i Supabase.
// Tr? v? null n?u thi?u ho?c sai token. Client "db" mang token c?a ng??i d?ng,
// n?n m?i truy v?n qua n? ??u ch?u s? ki?m so?t c?a RLS.
export async function getAuth(request: Request): Promise<Auth | null> {
  const header = request.headers.get("authorization") ?? "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  const token = match[1];

  const db = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );

  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user) return null;
  return { user: data.user, db };
}

export const unauthorized = () => Response.json({ error: "B?n ch?a ??ng nh?p." }, { status: 401 });
