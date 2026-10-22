"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Logo from "./Logo";

const field = "w-full rounded-2xl border border-line bg-white px-4 py-3.5 text-[15px] text-ink placeholder:text-[#7a8d90] focus:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/25";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }
    setLoading(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (signInError) {
      setError("Email hoặc mật khẩu không đúng.");
      return;
    }
    router.replace("/tasks");
  }

  return (
    <div className="w-full max-w-[440px] text-ink">
      <div className="mb-8 inline-flex rounded-xl bg-ink px-3 py-2 lg:hidden"><Logo size={28} /></div>
      <h1 className="text-4xl font-extrabold tracking-tight">Đăng nhập</h1>
      <p className="mb-8 mt-2 text-base text-mute">Chào mừng bạn quay lại với hành trình học tập.</p>
      <form onSubmit={submit} noValidate>
        <label htmlFor="email" className="mb-2 block text-sm font-extrabold">Địa chỉ Email</label>
        <input id="email" type="email" autoComplete="email" placeholder="vidu@email.com" value={email} onChange={(event) => setEmail(event.target.value)} className={field} />
        <label htmlFor="password" className="mb-2 mt-5 block text-sm font-extrabold">Mật khẩu</label>
        <div className="relative">
          <input id="password" type={show ? "text" : "password"} autoComplete="current-password" placeholder="Nhập mật khẩu" value={password} onChange={(event) => setPassword(event.target.value)} className={`${field} pr-20`} />
          <button type="button" onClick={() => setShow(!show)} aria-pressed={show} className="absolute right-2 top-2.5 rounded-lg px-2.5 py-1.5 text-sm font-bold text-mute hover:bg-sage focus-visible:outline-2 focus-visible:outline-ink">{show ? "Ẩn" : "Hiện"}</button>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm text-[#52666a]">
          <input type="checkbox" className="h-[18px] w-[18px] accent-ink" /> Ghi nhớ đăng nhập
        </label>
        {error && <p role="alert" className="mt-3 rounded-xl bg-[#fdecea] px-3 py-2 text-sm text-[#b42318]">{error}</p>}
        <button type="submit" disabled={loading} className="mt-5 w-full rounded-2xl bg-ink px-4 py-4 text-base font-extrabold text-lime transition hover:bg-[#0b3236] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
          {loading ? "Đang đăng nhập..." : "Đăng nhập →"}
        </button>
      </form>
    </div>
  );
}
