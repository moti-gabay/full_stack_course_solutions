import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

function pickLocale(request: NextRequest): Locale {
  // 1. בחירה שמורה ב-cookie
  const fromCookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (fromCookie && isLocale(fromCookie)) return fromCookie;

  // 2. העדפת הדפדפן, למשל "en-US,en;q=0.9,he;q=0.8". לוקחים את השפה הראשונה שנתמכת
  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const lang = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (isLocale(lang)) return lang;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("[proxy]", request.method, pathname);

  const [, first, ...rest] = pathname.split("/");
  const hasLocale = isLocale(first);
  const locale = hasLocale ? first : pickLocale(request);
  const path = hasLocale ? `/${rest.join("/")}` : pathname;

  // בדיקה אופטימית: רק אם יש cookie, לא אם הוא תקף. בדיקה אמיתית שייכת לשכבת הנתונים
  const isDashboard = path === "/dashboard" || path.startsWith("/dashboard/");
  if (isDashboard && !request.cookies.has("session")) {
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }
}

export const config = {
  // לא מריצים את ה-proxy על קבצים סטטיים: _next/static, אופטימיזציית תמונות, favicon וקבצים עם סיומת של תמונה
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)"],
};
