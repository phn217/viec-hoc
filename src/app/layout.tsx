import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import RouteAnnouncerFix from "@/components/RouteAnnouncerFix";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "studia – Quản lý việc học",
  description: "Ghi lại bài tập, mục tiêu ôn thi và nhiệm vụ hằng ngày.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={`${jakarta.className} antialiased`}>
        <RouteAnnouncerFix />
        {children}
      </body>
    </html>
  );
}
