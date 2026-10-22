# Kết quả kiểm thử

## Lần chạy gần nhất

- Ngày ghi nhận: 22-10-2026.
- Môi trường: localhost, Playwright Chromium.
- Lệnh: `npx playwright test --project=chromium`.
- Kết quả: 8 passed, 0 failed (21.8 giây).
- Phạm vi: các test trong `tests/tasks.spec.ts` và `tests/security.spec.ts`. Thông tin tài khoản test được lấy từ biến môi trường; không ghi mật khẩu vào tài liệu.

| Bộ test | Số test | Phạm vi | Kết quả |
| --- | ---: | --- | --- |
| `tests/tasks.spec.ts` | 7 | Xác thực route, đăng nhập sai/đúng, CRUD và reload, validation API, lỗi mạng, đăng xuất và token API. Bao gồm các mã T01–T05, T07, T08 và T12; T03/T05 nằm trong cùng một test. | Đạt |
| `tests/security.spec.ts` | 1 | Cách ly dữ liệu giữa hai tài khoản qua API và Row Level Security. Bao gồm T09–T11 trong cùng một test. | Đạt |
| **Tổng** | **8** | Tất cả test tự động trong hai file trên. | **8 passed (21.8 giây)** |

T06 là kiểm tra giao diện ở 390 px và thao tác bàn phím; đây là kiểm tra thủ công, không nằm trong 8 test Playwright trên.

## Các kịch bản

| Mã | Kiểm tra | Kết quả mong đợi |
| --- | --- | --- |
| T01 | Mở `/tasks` khi chưa đăng nhập | Chuyển về `/login`. |
| T02 | Đăng nhập sai rồi đúng | Báo lỗi khi sai; vào danh sách khi đúng. |
| T03 | Tạo, tải lại, sửa, hoàn thành và xóa nhiệm vụ | Dữ liệu lưu và hiển thị đúng sau khi tải lại. |
| T04 | Gửi tên rỗng, chỉ có khoảng trắng hoặc dài 121 ký tự qua API | API trả 400 và không tạo nhiệm vụ. |
| T05 | Hủy xác nhận xóa | Nhiệm vụ vẫn còn. |
| T06 | Giao diện ở 390 px và thao tác bằng Tab | Không tràn ngang; điều khiển có thể truy cập bằng bàn phím. Kiểm tra thủ công. |
| T07 | Mất mạng khi tạo nhiệm vụ | Hiện lỗi và không báo lưu thành công giả. |
| T08 | Gọi API thiếu token hoặc dùng token sai | API trả 401. |
| T09 | Người dùng B đọc danh sách của A | B không thấy nhiệm vụ của A. |
| T10 | B sửa hoặc xóa ID nhiệm vụ của A qua API | API không cho B thay đổi nhiệm vụ của A. |
| T11 | B thao tác trực tiếp với hàng của A qua Supabase | Chính sách RLS ngăn truy cập trái phép. |
| T12 | Đăng xuất rồi dùng Back/reload | Không hiển thị lại dashboard đã bảo vệ. |

Các test tự động trên bao phủ đầy đủ luồng ứng dụng và bảo mật được mô tả trong mã T01–T05, T07–T12. T06 được theo dõi riêng vì không phải test tự động.
