import { cacheLife, cacheTag } from "next/cache";

const HEADLINES = [
  "הכנסת אישרה את התקציב בקריאה ראשונה",
  "גל חום צפוי בסוף השבוע",
  "נבחרת הכדורסל עלתה לחצי הגמר",
  "מחיר הדלק יירד בחודש הבא",
  "נפתח קו רכבת חדש לצפון",
  "חברת הייטק ישראלית גייסה 50 מיליון דולר",
  "שביתה בנמלים הסתיימה הלילה",
  "פסטיבל הקולנוע נפתח בירושלים",
];

// Stands in for a slow news API: returns a random selection and the time it was fetched
export async function getNews() {
  "use cache";
  cacheLife("minutes");
  cacheTag("news");

  const items = [...HEADLINES].sort(() => Math.random() - 0.5).slice(0, 3);
  return {
    items,
    fetchedAt: new Date().toLocaleTimeString("he-IL", { timeZone: "Asia/Jerusalem" }),
  };
}
