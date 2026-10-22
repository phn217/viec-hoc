import { test, expect, type Page } from "@playwright/test";
import { PREFIX, cleanup, signIn } from "./helpers";

const email = process.env.TEST_EMAIL_A;
const password = process.env.TEST_PASSWORD_A;

test.skip(!email || !password, "Thiếu TEST_EMAIL_A / TEST_PASSWORD_A trong .env.local");

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Địa chỉ Email").fill(email!);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(password!);
  await page.getByRole("button", { name: /^Đăng nhập/ }).click();
  await expect(page).toHaveURL(/\/tasks/);
}

// Dọn dữ liệu do test tạo, kể cả khi test thất bại.
test.afterEach(async () => {
  await cleanup(email!, password!);
});

test("T01: chưa đăng nhập vào /tasks thì về /login", async ({ page }) => {
  await page.goto("/tasks");
  await expect(page).toHaveURL(/\/login/);
});

test("T02: đăng nhập sai rồi đúng", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Địa chỉ Email").fill(email!);
  await page.getByLabel("Mật khẩu", { exact: true }).fill(`sai-${Date.now()}`);
  await page.getByRole("button", { name: /^Đăng nhập/ }).click();
  await expect(page.getByRole("alert")).toContainText("không đúng");
  await login(page);
});

test("T03 + T05: thêm, reload, sửa, hoàn thành, xóa (có Hủy)", async ({ page }) => {
  const name = `${PREFIX}${Date.now()}`;
  const renamed = `${name} sửa`;
  await login(page);

  await page.getByLabel("Tạo nhiệm vụ học tập mới").fill(name);
  await page.getByRole("button", { name: "+ Thêm công việc" }).click();
  const newItem = page.getByTestId("task-item").filter({ hasText: name });
  await expect(newItem).toBeVisible();
  const taskId = await newItem.getAttribute("data-task-id");
  if (!taskId) throw new Error("Không tìm thấy ID của công việc vừa tạo.");
  const item = page.locator(`[data-task-id="${taskId}"]`);

  await page.reload();
  await expect(item).toBeVisible();

  await item.getByRole("button", { name: "Sửa" }).click();
  await item.getByLabel("Sửa tên công việc").fill(renamed);
  await item.getByRole("button", { name: "Lưu" }).click();
  await expect(item.getByText(renamed)).toBeVisible();

  await item.getByRole("checkbox").click();
  await expect(item.getByRole("checkbox")).toBeChecked();
  await page.reload();
  await expect(item.getByRole("checkbox")).toBeChecked();

  // T05: bấm Xóa rồi Hủy thì dòng còn.
  page.once("dialog", (d) => d.dismiss());
  await item.getByRole("button", { name: "Xóa" }).click();
  await expect(item).toBeVisible();

  // Xóa thật.
  page.once("dialog", (d) => d.accept());
  await item.getByRole("button", { name: "Xóa" }).click();
  await expect(item).toHaveCount(0);
  await page.reload();
  await expect(page.getByTestId("task-item").filter({ hasText: name })).toHaveCount(0);
});

test("T07: tắt mạng thì báo lỗi, không báo lưu giả", async ({ page }) => {
  const name = `${PREFIX}offline-${Date.now()}`;
  await login(page);
  await expect(page.getByText("Đang tải công việc...")).toHaveCount(0);

  await page.context().setOffline(true);
  await page.getByLabel("Tạo nhiệm vụ học tập mới").fill(name);
  await page.getByRole("button", { name: "+ Thêm công việc" }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByTestId("task-item").filter({ hasText: name })).toHaveCount(0);
  await page.context().setOffline(false);
});

test("T12: đăng xuất rồi Back thì không hiện lại dữ liệu", async ({ page }) => {
  await login(page);
  await page.getByRole("button", { name: "Đăng xuất" }).click();
  await expect(page).toHaveURL(/\/login/);
  await page.goBack();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText("Danh sách công việc học tập")).toHaveCount(0);
});

test("T04: tên rỗng, dấu cách, 121 ký tự bị API từ chối (400)", async ({ request }) => {
  const { token } = await signIn(email!, password!);
  const headers = { Authorization: `Bearer ${token}` };
  for (const title of ["", "   ", "x".repeat(121)]) {
    const res = await request.post("/api/tasks", { headers, data: { title } });
    expect(res.status()).toBe(400);
  }
});

test("T08: thiếu token hoặc token sai thì 401", async ({ request }) => {
  expect((await request.get("/api/tasks")).status()).toBe(401);
  const bad = await request.get("/api/tasks", { headers: { Authorization: "Bearer token-sai" } });
  expect(bad.status()).toBe(401);
});