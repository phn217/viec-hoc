# Ghi chú thiết kế giao diện

Giao diện được thiết kế với Claude. Không có link dự án thiết kế; hai ảnh tham khảo duy nhất được lưu trong repo:

- `reference/login-desktop.png`: màn hình đăng nhập desktop.
- `reference/task-desktop.png`: màn hình quản lý nhiệm vụ desktop.

## Đối chiếu với code hiện tại

- Bảng màu: nền xanh xám nhạt `#eaf0ed`, xanh mực `#052326`, xanh lime `#d3fb52`; các token còn lại nằm trong `src/app/globals.css`.
- Font: Plus Jakarta Sans với tập con tiếng Việt, khai báo trong `src/app/layout.tsx`.
- Đăng nhập: bố cục hai cột ở màn hình lớn, phần giới thiệu và logo nền tối bên trái, biểu mẫu Supabase Auth bên phải. Màn hình nhỏ ẩn phần giới thiệu. Đăng ký và khôi phục mật khẩu chưa được triển khai.
- Nhiệm vụ: header tối có thông tin học viên và nút đăng xuất; vùng chính có ngày, form tạo nhiệm vụ, ba bộ lọc và danh sách. Thẻ tiến độ nằm bên phải trên desktop, xếp bên dưới trên màn hình nhỏ.
- Tiến độ và bộ đếm được tính từ danh sách nhiệm vụ. Mỗi hàng có checkbox, môn học, hạn, ghi chú, nút sửa tên và nút xóa có xác nhận.
- Các thao tác tạo, sửa tên, hoàn thành và xóa gọi API rồi tải lại dữ liệu Supabase. Giao diện có trạng thái tải và thông báo lỗi.

## Khác biệt so với ảnh tham khảo

- Ảnh đăng nhập có chi tiết minh họa quên mật khẩu và đăng ký; code không hiển thị các mục này vì chưa có luồng tương ứng.
- Dashboard code dùng thẻ tiến độ bên phải thay cho thanh bên và các thẻ thống kê riêng trong ảnh.
- Chỉ có ảnh desktop làm tham khảo; giao diện màn hình nhỏ được bố trí bằng breakpoint Tailwind trong code.
