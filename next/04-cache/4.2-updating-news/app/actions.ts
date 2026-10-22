"use server";

import { updateTag } from "next/cache";

export async function refreshNews() {
  // Expires the "news" entry now, so this same response already renders fresh data
  updateTag("news");
}
