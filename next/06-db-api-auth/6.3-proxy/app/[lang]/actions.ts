"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// התחברות מדומה: התרגיל עוסק ב-proxy, לא באימות (אימות אמיתי בתרגיל 6.4)
export async function login(lang: string) {
  (await cookies()).set("session", crypto.randomUUID(), { httpOnly: true, sameSite: "lax", path: "/" });
  redirect(`/${lang}/dashboard`);
}

export async function logout(lang: string) {
  (await cookies()).delete("session");
  redirect(`/${lang}/login`);
}
