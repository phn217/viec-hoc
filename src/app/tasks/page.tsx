import AuthGate from "@/components/AuthGate";

export const metadata = { title: "Công việc | Việc học của tôi" };

export default function TasksPage() {
  return <AuthGate />;
}