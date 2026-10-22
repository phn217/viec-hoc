-- Bảng công việc. Mỗi dòng thuộc về một người dùng (user_id).
-- Tài liệu gốc có 5 cột; thêm subject, due, note để khớp giao diện hiện tại.
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 120),
  is_done boolean not null default false,
  created_at timestamptz not null default now(),
  subject text not null default '',
  due text not null default '',
  note text not null default ''
);

-- Bật RLS: mặc định không ai đọc/ghi được, trừ khi có chính sách cho phép.
alter table public.tasks enable row level security;

-- Chỉ người đã đăng nhập (authenticated) mới có quyền thao tác bảng.
revoke all on public.tasks from anon;
grant select, insert, update, delete on public.tasks to authenticated;

-- Bốn chính sách: mỗi người chỉ thao tác trên dòng có user_id của mình.
create policy "tasks_select_own" on public.tasks
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "tasks_insert_own" on public.tasks
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "tasks_update_own" on public.tasks
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "tasks_delete_own" on public.tasks
  for delete to authenticated
  using ((select auth.uid()) = user_id);