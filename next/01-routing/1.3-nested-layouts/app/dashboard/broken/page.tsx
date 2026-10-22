import { connection } from "next/server";

// Simulates an unreliable source that fails about half the time, so "try again" can succeed
async function getReport() {
  if (Math.random() < 0.5) {
    throw new Error("משהו השתבש בטעינת הדוח");
  }
  return "הפעם הדוח נטען בהצלחה";
}

export default async function BrokenPage() {
  await connection();
  const report = await getReport();

  return <h1 className="text-2xl font-bold">{report}</h1>;
}
