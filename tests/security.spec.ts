import { test, expect } from "@playwright/test";
import { PREFIX, cleanup, signIn } from "./helpers";

const A = { email: process.env.TEST_EMAIL_A, password: process.env.TEST_PASSWORD_A };
const B = { email: process.env.TEST_EMAIL_B, password: process.env.TEST_PASSWORD_B };

test.skip(
  !A.email || !A.password || !B.email || !B.password,
  "Thiếu TEST_EMAIL_A/B hoặc TEST_PASSWORD_A/B trong .env.local"
);

test.afterEach(async () => {
  await cleanup(A.email!, A.password!);
});

test("T09-T11: B không đọc, sửa, xóa hay giả chủ dòng của A", async ({ request }) => {
  const a = await signIn(A.email!, A.password!);
  const b = await signIn(B.email!, B.password!);
  const title = `${PREFIX}${Date.now()}`;
  const authA = { Authorization: `Bearer ${a.token}` };
  const authB = { Authorization: `Bearer ${b.token}` };

  const created = await request.post("/api/tasks", { headers: authA, data: { title } });
  expect(created.status()).toBe(201);
  const id = (await created.json()).task.id as string;

  // T09: B đọc danh sách, không thấy dòng của A.
  const listB = await (await request.get("/api/tasks", { headers: authB })).json();
  expect(listB.tasks.some((t: { id: string }) => t.id === id)).toBe(false);

  // T10: B sửa/xóa id của A qua API thì nhận 404.
  const patch = await request.patch(`/api/tasks/${id}`, { headers: authB, data: { title: "bị sửa" } });
  expect(patch.status()).toBe(404);
  expect((await request.delete(`/api/tasks/${id}`, { headers: authB })).status()).toBe(404);

  // T11: B gọi thẳng Supabase bằng token của B, RLS phải chặn.
  const read = await b.c.from("tasks").select("id").eq("id", id);
  expect(read.data ?? []).toHaveLength(0);
  const upd = await b.c.from("tasks").update({ title: "bị sửa" }).eq("id", id).select();
  expect(upd.data ?? []).toHaveLength(0);
  const del = await b.c.from("tasks").delete().eq("id", id).select();
  expect(del.data ?? []).toHaveLength(0);
  const ins = await b.c.from("tasks").insert({ title: `${PREFIX}gia-chu`, user_id: a.userId });
  expect(ins.error).not.toBeNull();

  // Dữ liệu của A không đổi.
  const listA = await (await request.get("/api/tasks", { headers: authA })).json();
  const row = listA.tasks.find((t: { id: string }) => t.id === id);
  expect(row?.title).toBe(title);
});