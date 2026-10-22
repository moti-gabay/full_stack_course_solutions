import { readFile } from "node:fs/promises";
import path from "node:path";
import { uploadsDir } from "@/lib/recipes";

const TYPES: Record<string, string> = { png: "image/png", jpeg: "image/jpeg", webp: "image/webp" };

// קבצים שנוספים ל-public אחרי ה-build לא מוגשים ב-next start, ולכן מגישים את ההעלאות כאן
export async function GET(_req: Request, ctx: RouteContext<"/uploads/[name]">) {
  const { name } = await ctx.params;
  // שם בפורמט שאנחנו יצרנו בלבד, כדי למנוע path traversal (../)
  const match = /^[0-9a-f-]{36}\.(png|jpeg|webp)$/.exec(name);
  if (!match) return new Response("Not found", { status: 404 });

  try {
    const file = await readFile(path.join(uploadsDir, name));
    return new Response(file, { headers: { "Content-Type": TYPES[match[1]] } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
