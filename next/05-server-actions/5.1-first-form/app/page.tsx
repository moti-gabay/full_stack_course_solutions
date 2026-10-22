import { Suspense } from "react";
import { getTasks } from "@/lib/tasks";
import { createTask } from "./actions";

async function TaskList() {
  const tasks = await getTasks();
  if (tasks.length === 0) return <p className="text-zinc-500">אין משימות עדיין</p>;

  return (
    <ul className="list-disc ps-6">
      {tasks.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-md space-y-6 p-8">
      <h1 className="text-2xl font-bold">המשימות שלי</h1>

      <form action={createTask} className="flex gap-2">
        <input
          name="title"
          required
          placeholder="משימה חדשה"
          className="flex-1 rounded border px-3 py-2"
        />
        <button className="rounded bg-black px-4 py-2 text-white">הוסף</button>
      </form>

      <Suspense fallback={<p>טוען משימות...</p>}>
        <TaskList />
      </Suspense>
    </main>
  );
}
