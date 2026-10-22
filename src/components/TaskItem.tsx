"use client";

import { useState } from "react";

export type Task = {
  id: string;
  title: string;
  is_done: boolean;
  subject: string;
  due: string;
  note: string;
};

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onRename: (id: string, title: string) => Promise<string | null>;
  onDelete: (id: string) => void;
};

export default function TaskItem({ task, onToggle, onRename, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    if (busy) return;
    setBusy(true);
    const err = await onRename(task.id, draft);
    setBusy(false);
    if (err) return setError(err);
    setError(null);
    setEditing(false);
  }

  function cancel() {
    setDraft(task.title);
    setError(null);
    setEditing(false);
  }

  function remove() {
    if (window.confirm(`Xóa công việc "${task.title}"?`)) onDelete(task.id);
  }

  const button = "rounded-xl px-4 py-2.5 text-sm font-extrabold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";
  const chip = "inline-block max-w-full truncate rounded-full px-3 py-1 text-xs font-bold";

  return (
    <li data-testid="task-item" data-task-id={task.id} className={`flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[22px] border border-line px-4 py-4 sm:px-5 ${task.is_done ? "bg-donebg" : "bg-white"}`}>
      <input type="checkbox" checked={task.is_done} onChange={() => onToggle(task.id)} aria-label={`Hoàn thành: ${task.title}`} className="h-6 w-6 shrink-0 accent-ink" />
      <div className="min-w-0 flex-1 basis-48">
        <div className="flex flex-wrap gap-1.5">
          {task.subject && <span className={`${chip} bg-limesoft text-[#394900]`}>{task.subject}</span>}
          {task.due && <span className={`${chip} ${task.due === "Hôm nay" && !task.is_done ? "bg-[#fde8e4] text-[#a3291d]" : "bg-[#edf0ef] text-[#52666a]"}`}>{task.due}</span>}
          {task.note && <span className={`${chip} bg-[#edf0ef] text-[#52666a]`}>{task.note}</span>}
        </div>
        {editing ? (
          <div className="mt-2">
            <input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => event.key === "Enter" && save()} aria-label="Sửa tên công việc" aria-invalid={!!error} className="w-full rounded-xl border border-line px-3 py-2 text-ink focus:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/25" autoFocus />
            {error && <p role="alert" className="mt-1 text-sm text-red-700">{error}</p>}
          </div>
        ) : (
          <p className={`mt-2 break-words text-base font-extrabold leading-snug ${task.is_done ? "text-[#5b7072] line-through" : "text-ink"}`}>{task.title}</p>
        )}
      </div>
      <div className="ml-auto flex gap-2">
        {editing ? <>
          <button onClick={save} disabled={busy} className={`${button} bg-ink text-lime hover:bg-[#0b3236] disabled:opacity-60`}>{busy ? "Đang lưu..." : "Lưu"}</button>
          <button onClick={cancel} className={`${button} bg-sage text-ink hover:bg-tabbg`}>Hủy</button>
        </> : <>
          <button onClick={() => setEditing(true)} className={`${button} bg-sage text-ink hover:bg-tabbg`}>Sửa</button>
          <button onClick={remove} className={`${button} bg-[#fdecea] text-[#b42318] hover:bg-[#fbd9d4]`}>Xóa</button>
        </>}
      </div>
    </li>
  );
}
