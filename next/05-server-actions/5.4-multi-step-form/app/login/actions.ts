"use server";

import { redirect } from "next/navigation";
import { createSession } from "@/lib/session";

// משתמש לדוגמה. אימות אמיתי מול מסד נתונים מגיע בתרגיל 6.4
const USERS: Record<string, string> = { dana: "1234" };

export async function login(_prev: string, formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (USERS[username] !== password) return "שם משתמש או סיסמה שגויים";

  await createSession(username);
  redirect("/new");
}
