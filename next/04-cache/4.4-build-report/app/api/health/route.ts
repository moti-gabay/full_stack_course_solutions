import { connection } from "next/server";

export async function GET() {
  await connection(); // the time must be of this request, not of the build
  return Response.json({ status: "ok", time: new Date().toISOString() });
}
