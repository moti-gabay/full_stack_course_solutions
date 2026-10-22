import { connection } from "next/server";

export default async function SlowPage() {
  // connection() makes this page render per request, so the delay happens at runtime and not in the build
  await connection();
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return <h1 className="text-2xl font-bold">הדף האיטי נטען אחרי 3 שניות</h1>;
}
