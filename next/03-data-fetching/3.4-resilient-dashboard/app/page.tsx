import { Widget } from "@/components/widget";
import { getLatestPosts, getRates, getServerStats, getWeather } from "@/lib/data";

async function Weather() {
  const w = await getWeather();
  return <p>{w.temperature}°C · רוח {w.wind} קמ״ש</p>;
}

async function Rates() {
  const r = await getRates();
  return <p dir="ltr">1 USD = {r.ILS} ILS · {r.EUR} EUR</p>;
}

async function Posts() {
  const posts = await getLatestPosts();
  return (
    <ul className="list-disc pr-5 text-sm" dir="ltr">
      {posts.map((p) => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  );
}

async function ServerStats() {
  const s = await getServerStats();
  return (
    <p className="text-sm">
      uptime {s.uptimeMinutes} דק׳ · load {s.load} · {s.freeMemGb}GB פנויים
    </p>
  );
}

export default function Dashboard() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">דשבורד</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Widget title="מזג אוויר בתל אביב"><Weather /></Widget>
        <Widget title="שערי מטבע"><Rates /></Widget>
        <Widget title="פוסטים אחרונים"><Posts /></Widget>
        <Widget title="השרת"><ServerStats /></Widget>
      </div>
    </main>
  );
}
