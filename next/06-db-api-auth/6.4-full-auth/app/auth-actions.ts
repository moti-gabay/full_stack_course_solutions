"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function loginWithGitHub() {
  await signIn("github", { redirectTo: "/dashboard" });
}

export async function loginWithPassword(_prev: string, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (err) {
    // signIn מצליח על ידי זריקת redirect, ולכן תופסים רק שגיאות של Auth.js
    if (err instanceof AuthError) return "אימייל או סיסמה שגויים";
    throw err;
  }
  return "";
}

export async function register(_prev: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!name || !email.includes("@") || password.length < 8) {
    return "צריך שם, אימייל תקין וסיסמה של לפחות 8 תווים";
  }

  await connectDB();
  if (await User.exists({ email })) return "האימייל כבר רשום";
  await User.create({ name, email, passwordHash: await bcrypt.hash(password, 10) });

  await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  return "";
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
