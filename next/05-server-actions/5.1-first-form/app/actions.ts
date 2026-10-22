"use server";

import { revalidatePath } from "next/cache";
import { addTask } from "@/lib/tasks";

export async function createTask(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  await addTask(title);
  revalidatePath("/");
}
