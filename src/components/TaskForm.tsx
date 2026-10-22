"use client";

import { useState } from "react";

export type NewTask = { title: string; subject: string; due: string; note: string };
type Props = { onAdd: (task: NewTask) => Promise<string | null> };

const SUBJECTS = ["Toán học", "Tiếng Anh", "Vật lý", "Lập trình", "Hóa học"];
const DUES = ["Hôm nay", "Ngày mai", "Tuần này"];
const field = "min-w-0 rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-[#849396] focus:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/25";

export default function TaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [due, setDue] = useState(DUES[0]);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    const err = await onAdd({ title, subject, due, note: note.trim() });
    setBusy(false);
    if (err) return setError(err);
    setError(null);
    setTitle("");
    setNote("");
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="new-task" className="mb-3 block text-lg font-extrabold">Tạo nhiệm vụ học tập mới</label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input id="new-task" value={title} onChange={(event) => setTitle(event.target.value)} aria-invalid={!!error} aria-describedby={error ? "new-task-error" : undefined} placeholder="Ví dụ: Ôn tập chương 3 Toán giải tích" className={`${field} flex-1 text-base`} />
        <button type="submit" disabled={busy} className="shrink-0 rounded-2xl bg-ink px-6 py-3 text-sm font-extrabold text-lime transition hover:bg-[#0b3236] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink">
          {busy ? "Đang thêm..." : "+ Thêm công việc"}
        </button>
      </div>
      {error && <p id="new-task-error" role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-[auto_auto_minmax(0,1fr)]">
        <select aria-label="Môn học" value={subject} onChange={(event) => setSubject(event.target.value)} className={field}>{SUBJECTS.map((item) => <option key={item}>{item}</option>)}</select>
        <select aria-label="Hạn hoàn thành" value={due} onChange={(event) => setDue(event.target.value)} className={field}>{DUES.map((item) => <option key={item}>{item}</option>)}</select>
        <input aria-label="Ghi chú nhanh" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Ghi chú nhanh (ví dụ: Làm trang 45–50 giáo trình)" className={`${field} col-span-2 sm:col-span-1`} />
      </div>
    </form>
  );
}
