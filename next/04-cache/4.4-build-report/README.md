# תרגיל 4.4 · דוח build

אתר קטן עם כמה סוגים של נתיבים. הרצנו `next build`, קראנו לכל נתיב את הסימון שלו ואת הסיבה, ומצאנו ותיקנו נתיב אחד שהפך לדינמי בטעות (`/team`).

## הרצה

```bash
npm install
npm run build      # מדפיס את טבלת הנתיבים
npm start          # http://localhost:3000
```

## משתני סביבה

אין.

## פלט ה-build (אחרי התיקון)

```
Route (app)            Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ◐ /account
├ ƒ /api/health
├ ○ /blog                      1h      1d
├   /blog/[id]
│ ├ ◐ /blog/[id]
│ ├ ○ /blog/1                  1h      1d
│ ├ ○ /blog/2                  1h      1d
│ └ ◐ [+3 more paths]
└ ○ /team                      1d      1w

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
ƒ  (Dynamic)            server-rendered on demand
```

## הדוח: כל נתיב ולמה

| נתיב | סימון | למה |
| --- | --- | --- |
| `/` | `○` Static | JSX קבוע, בלי נתונים ובלי API של זמן בקשה. ה-HTML המלא נבנה ב-build. |
| `/_not-found` | `○` Static | דף ה-404 שנוצר אוטומטית. תוכן קבוע. |
| `/about` | `○` Static | כמו דף הבית: תוכן קבוע בלבד. |
| `/account` | `◐` Partial Prerender | `Greeting` קורא `cookies()`, ולכן אפשר לרנדר אותו רק בזמן בקשה. הוא עטוף ב-`<Suspense>`, ולכן הכותרת וה-fallback "טוען..." נבנים מראש, והברכה מוזרמת. זה דינמי בכוונה: התוכן שונה לכל משתמש. |
| `/api/health` | `ƒ` Dynamic | Route Handler שמחזיר את השעה הנוכחית. הוא קורא ל-`await connection()`, כי השעה צריכה להיות של הבקשה ולא של ה-build. Route Handler תלוי-בקשה מסומן תמיד `ƒ` ולא משתמש ב-PPR. |
| `/blog` | `○` Static, ‏1h | הרשימה מגיעה מ-`getPosts()`, שמסומנת `"use cache"` עם `cacheLife("hours")`. ה-HTML המלא נבנה ב-build ומתחדש ברקע כל שעה (Revalidate 1h, Expire 1d). |
| `/blog/[id]` (השורה הראשונה) | `◐` | שורת ה-fallback, לכל `id` שלא הוחזר מ-`generateStaticParams`. עבורו מוגש static shell (ה-skeleton של `loading.tsx`), והפוסט מוזרם בזמן הבקשה. |
| `/blog/1`, `/blog/2` | `○` Static, ‏1h | ה-`id` ידוע מ-`generateStaticParams`, ו-`getPost` שמור ב-cache. לכן כל הדף נבנה מראש. |
| `[+3 more paths]` | `◐` (בשורה המקובצת) | ‏`/blog/3` עד `/blog/5`. Next מכווץ את השורות בפלט. בדקנו ב-`.next/server/app/blog/3.html`, ושם הפוסט נמצא ב-HTML המלא בלי "חורים" דינמיים (`<template id="B:...">`), בדיוק כמו `1.html`. גם ב-`prerender-manifest.json` לשלושה יש אותו מצב כמו ל-`/blog/1`. הסימון `◐` בשורה המקובצת הוא רק סיכום שלה. |
| `/team` | `○` Static, ‏1d | אחרי התיקון (ראו בהמשך). רשימת הצוות שמורה ב-cache ליום. |

## התיקון: `/team` הפך לדינמי בטעות

**לפני** (קטע מפלט ה-build):

```
├ ○ /blog                      1h      1d
...
└ ◐ /team
```

**הסיבה**: ‏`getTeam()` ב-`lib/api.ts` מושכת את רשימת הצוות בלי `"use cache"`. עם Cache Components, ה-build נכשל על fetch שלא שמור ב-cache, ולכן "התיקון" הראשון שנעשה היה לעטוף את הרשימה ב-`<Suspense>`. ה-build אכן עבר, אבל הנתיב הפך ל-`◐`: ב-HTML הסטטי היה רק "טוען...", וכל בקשה ל-`/team` הלכה שוב ל-API, אף שרשימת הצוות כמעט לא משתנה. זה נתיב שהפך לדינמי בלי שמישהו התכוון לכך.

**התיקון**: הוספנו ל-`getTeam()` את `"use cache"` ואת `cacheLife("days")`, והורדנו את ה-`<Suspense>`, שכבר לא נחוץ. הדף עכשיו `async` ומחכה לנתונים ישירות.

**אחרי**:

```
├ ○ /blog                      1h      1d
...
└ ○ /team                      1d      1w
```

הנתיב סטטי, ‏`.next/server/app/team.html` כבר מכיל את שמות הצוות (למשל `Leanne Graham`), והרשימה מתחדשת פעם ביום.

## החלטות מרכזיות

- **השאלה לכל נתיב: האם התוכן תלוי בבקשה?** ‏cookies, ‏headers, ‏searchParams ושעה נוכחית תלויים בבקשה, וזה דינמי בצדק (`/account`, ‏`/api/health`). נתונים שמגיעים מ-API אבל זהים לכל המשתמשים (`/blog`, ‏`/team`) צריכים `"use cache"` עם `cacheLife` שמתאים לקצב השינוי שלהם.
- **`<Suspense>` לא אומר "cache"**. הוא רק נותן fallback בזמן ההמתנה. כשה-build מתלונן על fetch שלא שמור ב-cache, צריך לשאול קודם אם הנתונים בכלל צריכים להיות טריים בכל בקשה.
- **`generateStaticParams` יחד עם cache** הופכים דפים דינמיים לפי `[id]` לסטטיים מלאים, ו-`loading.tsx` נותן shell לכל `id` שלא נבנה מראש.
