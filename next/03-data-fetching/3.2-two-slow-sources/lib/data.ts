import { connection } from "next/server";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type SourceResult = { name: string; ms: number; doneAt: string };

async function slowSource(name: string, ms: number): Promise<SourceResult> {
  // Each request must wait for real, otherwise the build would prerender it once
  await connection();
  await sleep(ms);
  return { name, ms, doneAt: new Date().toLocaleTimeString("he-IL") };
}

export const getWeather = () => slowSource("מזג אוויר", 2000);
export const getNews = () => slowSource("חדשות", 4000);
