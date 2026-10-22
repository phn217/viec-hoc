import LoginForm from "@/components/LoginForm";
import Logo from "@/components/Logo";

export const metadata = { title: "Đăng nhập | studia" };

const POINTS = [
  "Thêm, sửa và đánh dấu hoàn thành chỉ với vài thao tác",
  "Lọc nhanh việc chưa xong và việc đã xong",
  "Dữ liệu của bạn chỉ mình bạn nhìn thấy",
];

export default function LoginPage() {
  return (
    <div className="grid min-h-screen text-ink lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-ink p-10 text-white sm:p-14 lg:flex">
        <Logo size={38} />
        <div className="max-w-2xl">
          <h2 className="text-5xl font-extrabold leading-[1.15] tracking-tight xl:text-6xl">
            Học đều mỗi ngày,<br /><span className="text-lime">từng việc một.</span>
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-[#a9bfc0]">Ghi lại bài tập, mục tiêu ôn thi và nhiệm vụ hằng ngày ở một nơi gọn gàng.</p>
          <ul className="mt-7 space-y-3.5">
            {POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[15px] leading-normal text-[#d8e6e6]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#D3FB52" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-[#7f9a9c]">© 2026 studia</p>
      </section>
      <section className="flex items-center justify-center bg-[#f5f8f6] px-6 py-12"><LoginForm /></section>
    </div>
  );
}
