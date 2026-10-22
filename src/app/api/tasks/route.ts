import { z } from "zod";
import { getAuth, unauthorized } from "@/lib/auth-request";

const NewTask = z.object({
  title: z.string().trim().min(1).max(120),
  subject: z.string().trim().max(50).default(""),
  due: z.string().trim().max(50).default(""),
  note: z.string().trim().max(200).default(""),
});

// GET /api/tasks: danh sách công việc của người đang đăng nhập.
export async function GET(request: Request) {
  const auth = await getAuth(request);
  if (!auth) return unauthorized();

  const { data, error } = await auth.db
    .from("tasks")
    .select("id, title, is_done, subject, due, note, created_at")
    .eq("user_id", auth.user.id)
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: "Không tải được danh sách." }, { status: 500 });
  return Response.json({ tasks: data });
}

// POST /api/tasks: thêm công việc. user_id lấy từ token, không nhận từ client.
export async function POST(request: Request) {
  const auth = await getAuth(request);
  if (!auth) return unauthorized();

  const raw = await request.json().catch(() => null);
  const parsed = NewTask.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "Tên công việc phải dài từ 1 đến 120 ký tự." }, { status: 400 });
  }

  const { data, error } = await auth.db
    .from("tasks")
    .insert({ ...parsed.data, user_id: auth.user.id })
    .select("id, title, is_done, subject, due, note, created_at")
    .single();

  if (error) return Response.json({ error: "Không thêm được công việc." }, { status: 500 });
  return Response.json({ task: data }, { status: 201 });
}