# Việc học của tôi

Ứng dụng quản lý nhiệm vụ học tập, xây dựng bằng Next.js 16, React, TypeScript và Tailwind CSS. Giao diện do Claude thiết kế dựa trên hai ảnh tham khảo `design/reference/login-desktop.png` và `design/reference/task-desktop.png`; không có link dự án thiết kế. Ứng dụng dùng Supabase Auth và lưu nhiệm vụ trong Supabase.

- Họ tên: Nguyễn Phi Nhung
- MSSV: 24521282
- Hai ảnh tham khảo: `design/reference/login-desktop.png` và `design/reference/task-desktop.png`.

## Chạy ứng dụng

Yêu cầu Node.js LTS và các biến môi trường Supabase trong `.env.local` (xem `.env.example`).

```bash
npm install
npm run dev
```

Tạo file cấu hình cục bộ từ mẫu rồi điền thông tin Supabase của bạn. File thật `.env.local` đã được Git bỏ qua; chỉ commit `.env.example` với các giá trị trống.

```powershell
Copy-Item .env.example .env.local
```

Mở <http://localhost:3000>. Lệnh kiểm tra hiện có:

```bash
npm run lint
npx tsc --noEmit
npm run build
npx playwright test --project=chromium
```

## Giao diện và luồng sử dụng

- `/` chuyển hướng đến `/tasks`.
- `/login` đăng nhập bằng email và mật khẩu qua Supabase Auth. Đăng nhập thành công chuyển đến `/tasks`; đăng nhập thất bại hiển thị thông báo chung. Chưa có luồng đăng ký hoặc khôi phục mật khẩu.
- `/tasks` yêu cầu phiên đăng nhập. Khi chưa có phiên, ứng dụng chuyển về `/login`; đăng xuất cũng trở về trang đăng nhập.
- Dashboard hiển thị ngày hiện tại, nhiệm vụ, bộ lọc Tất cả/Chưa xong/Đã xong và tiến độ tính từ số nhiệm vụ đã hoàn thành. Bố cục có thẻ tiến độ bên phải trên màn hình rộng và xếp dọc trên màn hình nhỏ.
- Có thể tạo nhiệm vụ với tên, môn học, hạn và ghi chú; sửa tên; đánh dấu hoàn thành; hoặc xóa sau khi xác nhận. Tên sau khi bỏ khoảng trắng đầu/cuối phải dài 1–120 ký tự. Môn học, hạn và ghi chú không được sửa sau khi tạo trong giao diện hiện tại.

## Dữ liệu và bảo vệ API

Các thao tác nhiệm vụ đi qua `/api/tasks` và `/api/tasks/[id]`. API yêu cầu bearer token Supabase, chỉ truy cập dữ liệu thuộc người dùng đang đăng nhập, và xác thực dữ liệu đầu vào. Bảng `public.tasks` bật Row Level Security; schema và chính sách nằm trong `supabase/schema.sql`.

Các trường nhiệm vụ gồm `title`, `subject`, `due`, `note`, `is_done` và `created_at`. Giới hạn API: tên tối đa 120 ký tự, môn học và hạn tối đa 50 ký tự mỗi trường, ghi chú tối đa 200 ký tự.

## Cấu trúc chính

- `src/app`: trang, layout, CSS toàn cục và API routes.
- `src/components`: biểu mẫu đăng nhập, cổng xác thực, dashboard và các thành phần nhiệm vụ.
- `src/lib`: Supabase client, gọi API có bearer token và xử lý lỗi.
- `supabase/schema.sql`: bảng nhiệm vụ và chính sách RLS.
- `tests`: kiểm thử Playwright cho luồng nhiệm vụ và cách ly dữ liệu.
- `design/reference`: hai ảnh login và task do Claude tạo; `design/notes.md` ghi lại đối chiếu thiết kế với code.
- `docs/test-results.md`: trạng thái các lần kiểm thử được ghi nhận.

