import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "session";

function sign(username: string) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return createHmac("sha256", secret).update(username).digest("hex");
}

export async function createSession(username: string) {
  (await cookies()).set(COOKIE, `${username}.${sign(username)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

// מחזיר את שם המשתמש רק אם החתימה תקינה, כך שאי אפשר לזייף cookie
export async function getUser(): Promise<string | null> {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return null;

  const [username, signature] = value.split(".");
  const expected = Buffer.from(sign(username));
  const actual = Buffer.from(signature ?? "");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  return username;
}
