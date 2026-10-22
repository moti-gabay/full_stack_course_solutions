import { getTeam } from "@/lib/api";

export default async function Team() {
  const team = await getTeam();
  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-4 text-3xl font-bold">הצוות</h1>
      <ul className="list-disc space-y-1 pr-6" dir="ltr">
        {team.map((u) => (
          <li key={u.id}>{u.name} · {u.email}</li>
        ))}
      </ul>
    </main>
  );
}
