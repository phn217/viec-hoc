import { z } from "zod";
import { getAuth, unauthorized } from "@/lib/auth-request";

const Patch = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    is_done: z.boolean().optional(),
  })
  .refine((v) => v.title !== undefined || v.is_done !== undefined);

const notFound = () => Response.json({ error: "Không tìm thấy công việc." }, { status: 404 });
const isId = (id: string) => z.string().uuid().safeParse(id).success;

type Ctx = { params: Promise<{ id: string }> };

// PATCH /api/tasks/:id: đổi tên hoặc trạng thái. Chỉ tác động dòng của chính người gọi.
export async function PATCH(request: Request, { params }: Ctx) {
  const auth = await getAuth(request);
  if (!auth) return unauthorized();

  const { id } = await params;
  if (!isId(id)) return notFound();

  const raw = await request.json().catch(() => null);
  const parsed = Patch.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
  }

  const { data, error } = await auth.db
    .from("tasks")
    .update(parsed.data)
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .select("id, title, is_done, subject, due, note, created_at")
    .maybeSingle();

  if (error) return Response.json({ error: "Không cập nhật được công việc." }, { status: 500 });
  if (!data) return notFound(); // không có dòng thuộc người này (kể cả dòng của người khác)
  return Response.json({ task: data });
}

// DELETE /api/tasks/:id
export async function DELETE(request: Request, { params }: Ctx) {
  const auth = await getAuth(request);
  if (!auth) return unauthorized();

  const { id } = await params;
  if (!isId(id)) return notFound();

  const { data, error } = await auth.db
    .from("tasks")
    .delete()
    .eq("id", id)
    .eq("user_id", auth.user.id)
    .select("id");

  if (error) return Response.json({ error: "Không xóa được công việc." }, { status: 500 });
  if (!data || data.length === 0) return notFound();
  return Response.json({ ok: true });
}