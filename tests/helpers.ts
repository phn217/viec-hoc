import { createClient } from "@supabase/supabase-js";

// Mọi dữ liệu do test tạo đều có tiền tố này để dọn đúng phần của test.
export const PREFIX = "PWTEST-";

export function client() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

// Đăng nhập tài khoản test, trả về client, token và id người dùng (không in ra log).
export async function signIn(email: string, password: string) {
  const c = client();
  const { data, error } = await c.auth.signInWithPassword({ email, password });
  if (error || !data.session) throw new Error("Đăng nhập tài khoản test thất bại.");
  return { c, token: data.session.access_token, userId: data.user.id };
}

// Chỉ xóa các dòng có tiền tố PWTEST- của chính tài khoản đó.
export async function cleanup(email: string, password: string) {
  const { c } = await signIn(email, password);
  await c.from("tasks").delete().like("title", `${PREFIX}%`);
}