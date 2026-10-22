"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { apiFetch, errMsg } from "@/lib/api";
import Logo from "./Logo";
import TaskForm, { NewTask } from "./TaskForm";
import TaskList from "./TaskList";
import { Task } from "./TaskItem";

type Filter = "all" | "todo" | "done";

async function fetchTasks(): Promise<Task[]> {
  const res = await apiFetch<{ tasks: Task[] }>("/api/tasks");
  return res.tasks;
}

function validate(raw: string): string | null {
  const len = raw.trim().length;
  return len >= 1 && len <= 120 ? null : "Tên công việc phải dài từ 1 đến 120 ký tự.";
}

const noopSubscribe = () => () => {};
const formatToday = () =>
  new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });

function ProgressCard({ total, todo, done }: { total: number; todo: number; done: number }) {
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100);
  const radius = 49;
  const circumference = 2 * Math.PI * radius;
  return (
    <aside aria-label="Tiến độ học tập" className="h-fit rounded-[28px] bg-ink p-6 text-white sm:p-8 lg:sticky lg:top-6">
      <h2 className="text-xl font-extrabold">Tiến độ hôm nay</h2>
      <div className="my-7 flex justify-center">
        <div className="relative grid h-40 w-40 place-items-center">
          <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#1f4a4d" strokeWidth="10" />
            <circle
              cx="60" cy="60" r={radius} fill="none" stroke="#d3fb52" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={circumference * (1 - percentage / 100)}
              className="transition-[stroke-dashoffset] duration-500"
            />
          </svg>
          <div className="text-center">
            <p className="text-4xl font-extrabold text-lime">{percentage}%</p>
            <p className="mt-1 text-sm text-[#a9bfc0]">{done} / {total} đã xong</p>
          </div>
        </div>
      </div>
      <dl className="divide-y divide-[#1f4a4d] border-t border-[#1f4a4d]">
        <div className="flex items-center justify-between py-4"><dt className="text-[#c0d0d0]">Tổng nhiệm vụ</dt><dd className="text-2xl font-extrabold">{total}</dd></div>
        <div className="flex items-center justify-between py-4"><dt className="text-[#c0d0d0]">Cần hoàn thành</dt><dd className="text-2xl font-extrabold">{todo}</dd></div>
        <div className="flex items-center justify-between pt-4"><dt className="text-[#c0d0d0]">Đã xong</dt><dd className="text-2xl font-extrabold">{done}</dd></div>
      </dl>
    </aside>
  );
}

export default function TaskDashboard({ email }: { email: string }) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const today = useSyncExternalStore(noopSubscribe, formatToday, () => "");

  useEffect(() => {
    let alive = true;
    fetchTasks()
      .then((t) => alive && setTasks(t))
      .catch((e) => alive && setLoadError(errMsg(e)))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  async function reload() {
    setLoading(true);
    setLoadError(null);
    try { setTasks(await fetchTasks()); }
    catch (e) { setLoadError(errMsg(e)); }
    finally { setLoading(false); }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const done = tasks.filter((task) => task.is_done).length;
  const todo = tasks.length - done;
  const visible = tasks.filter((task) => filter === "all" || (filter === "done" ? task.is_done : !task.is_done));
  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "Tất cả", count: tasks.length },
    { key: "todo", label: "Chưa xong", count: todo },
    { key: "done", label: "Đã xong", count: done },
  ];

  async function add(newTask: NewTask) {
    const error = validate(newTask.title);
    if (error) return error;
    setActionError(null);
    try {
      await apiFetch("/api/tasks", { method: "POST", body: JSON.stringify({ ...newTask, title: newTask.title.trim() }) });
      setTasks(await fetchTasks());
      return null;
    } catch (e) { return errMsg(e); }
  }

  async function rename(id: string, title: string) {
    const error = validate(title);
    if (error) return error;
    setActionError(null);
    try {
      await apiFetch(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify({ title: title.trim() }) });
      setTasks(await fetchTasks());
      return null;
    } catch (e) { return errMsg(e); }
  }

  async function toggle(id: string) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    setActionError(null);
    try {
      await apiFetch(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify({ is_done: !task.is_done }) });
      setTasks(await fetchTasks());
    } catch (e) { setActionError(errMsg(e)); }
  }

  async function remove(id: string) {
    setActionError(null);
    try {
      await apiFetch(`/api/tasks/${id}`, { method: "DELETE" });
      setTasks(await fetchTasks());
    } catch (e) { setActionError(errMsg(e)); }
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="flex items-center justify-between bg-ink px-4 py-4 sm:px-8 lg:px-10">
        <Logo />
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden text-right text-sm sm:block">
            <p className="font-bold text-white">Học viên</p>
            <p className="text-[#a9bfc0]">{email}</p>
          </div>
          <button onClick={logout} aria-label="Đăng xuất" title="Đăng xuất" className="grid h-12 w-12 place-items-center rounded-2xl border border-[#315557] text-lime transition hover:bg-[#123638] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/></svg>
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1600px] gap-7 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10 lg:px-10 lg:py-12 xl:grid-cols-[minmax(0,1fr)_390px]">
        <section className="min-w-0">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-bold text-link">Kỷ luật học tập</p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">Việc học hôm nay</h1>
            </div>
            {today && <p className="rounded-full bg-white/50 px-4 py-2 text-sm font-semibold capitalize text-mute">{today}</p>}
          </div>

          <section aria-label="Tạo nhiệm vụ" className="rounded-[26px] border border-line bg-white p-5 sm:p-7">
            <TaskForm onAdd={add} />
          </section>

          <div role="group" aria-label="Lọc công việc" className="mt-7 inline-flex max-w-full gap-1 rounded-2xl bg-[#dce7e2] p-1.5">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setFilter(tab.key)} aria-pressed={filter === tab.key} className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition sm:px-5 ${filter === tab.key ? "bg-ink text-lime" : "text-[#40575a] hover:bg-white/60"}`}>
                {tab.label}<span className={`rounded-full px-2 py-0.5 text-xs ${filter === tab.key ? "bg-lime text-ink" : "bg-white text-ink"}`}>{tab.count}</span>
              </button>
            ))}
          </div>

          {actionError && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</p>}

          <div className="mt-5">
            {loading ? (
              <p className="rounded-2xl border border-line bg-white py-10 text-center text-mute">Đang tải công việc...</p>
            ) : loadError ? (
              <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center text-sm text-red-700">
                <p>{loadError}</p>
                <button onClick={reload} className="mt-3 rounded-lg bg-white px-4 py-2 font-bold ring-1 ring-red-200">Thử lại</button>
              </div>
            ) : <TaskList tasks={visible} onToggle={toggle} onRename={rename} onDelete={remove} />}
          </div>
        </section>

        <ProgressCard total={tasks.length} todo={todo} done={done} />
      </main>
    </div>
  );
}
