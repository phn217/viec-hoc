import TaskItem, { Task } from "./TaskItem";

type Props = {
  tasks: Task[];
  onToggle: (id: string) => void;
  onRename: (id: string, title: string) => Promise<string | null>;
  onDelete: (id: string) => void;
};

export default function TaskList({ tasks, ...handlers }: Props) {
  if (tasks.length === 0) {
    return <p className="rounded-2xl border border-line bg-white px-5 py-10 text-center text-mute">Chưa có công việc nào ở đây. Nhập tên công việc ở trên để thêm.</p>;
  }
  return <ul className="space-y-4">{tasks.map((task) => <TaskItem key={task.id} task={task} {...handlers} />)}</ul>;
}
