import "server-only";
import os from "node:os";
import { connection } from "next/server";

export type WidgetName = "weather" | "rates" | "posts" | "server";

// FAIL_WIDGET=weather,rates makes those sources throw, to test the error boundaries
async function prepare(name: WidgetName) {
  await connection(); // dashboard data is fresh on every request
  const failing = process.env.FAIL_WIDGET?.split(",").map((s) => s.trim()) ?? [];
  if (failing.includes(name)) throw new Error(`Source "${name}" is down`);
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} responded ${res.status}`);
  return res.json();
}

export async function getWeather() {
  await prepare("weather");
  const data = await getJson<{ current: { temperature_2m: number; wind_speed_10m: number } }>(
    "https://api.open-meteo.com/v1/forecast?latitude=32.08&longitude=34.78&current=temperature_2m,wind_speed_10m",
  );
  return { temperature: data.current.temperature_2m, wind: data.current.wind_speed_10m };
}

export async function getRates() {
  await prepare("rates");
  const data = await getJson<{ rates: Record<string, number> }>("https://open.er-api.com/v6/latest/USD");
  return { ILS: data.rates.ILS, EUR: data.rates.EUR };
}

export async function getLatestPosts() {
  await prepare("posts");
  return getJson<{ id: number; title: string }[]>("https://jsonplaceholder.typicode.com/posts?_limit=3");
}

export async function getServerStats() {
  await prepare("server");
  await new Promise((r) => setTimeout(r, 1500)); // simulate a slow internal service
  return {
    uptimeMinutes: Math.round(os.uptime() / 60),
    load: os.loadavg()[0].toFixed(2),
    freeMemGb: (os.freemem() / 1024 ** 3).toFixed(1),
  };
}
