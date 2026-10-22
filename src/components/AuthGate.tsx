"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import TaskDashboard from "./TaskDashboard";

// Chưa đăng nhập thì chuyển về /login. Đây chỉ là bảo vệ giao diện;
// việc bảo vệ dữ liệu thật do API và RLS đảm nhiệm (chặng B).
export default function AuthGate() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecked(true);
      if (!data.session) router.replace("/login");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (!s) router.replace("/login");
    });
    return () => sub.subscription.unsubscribe();
  }, [router]);

  if (!checked || !session) {
    return (
      <p className="flex min-h-screen items-center justify-center bg-paper text-slate-600">
        Đang kiểm tra đăng nhập...
      </p>
    );
  }
  return <TaskDashboard email={session.user.email ?? ""} />;
}