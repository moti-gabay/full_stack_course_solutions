# תרגיל 4.2 · חדשות שמתעדכנות

דף חדשות שנשמר ב-cache עם `cacheLife("minutes")` ו-`cacheTag("news")`. כפתור admin מפעיל Server Action עם `updateTag("news")`, והדף מתעדכן מיד.

## הרצה

```bash
npm install
npm run build && npm start   # http://localhost:3000
```

- מרעננים כמה פעמים בתוך אותה דקה: "נמשך ב-" ורשימת הכותרות לא משתנים.
- לוחצים "רענן חדשות עכשיו": הדף מציג מיד שעה חדשה ורשימה אחרת.

## משתני סביבה

אין.

## החלטות מרכזיות

- **ה-cache נמצא על פונקציית הנתונים `getNews()`** ב-`lib/news.ts`, ולא על הדף. התג `news` מסמן את הנתונים עצמם, וכל דף שמשתמש בהם יתעדכן כשהתג מתבטל. הפונקציה מדמה API של חדשות: היא מגרילה 3 כותרות ומחזירה את שעת ההבאה, כדי שיהיה קל לראות מתי הנתונים חדשים.
- **`cacheLife("minutes")`**: ‏revalidate של דקה ו-expire של שעה. בפלט ה-build הדף מסומן `○` עם `Revalidate 1m, Expire 1h`. אחרי דקה, הבקשה הבאה עדיין מקבלת את הגרסה השמורה, ו-Next מחדש אותה ברקע (stale-while-revalidate).
- **`updateTag` ולא `revalidateTag`**: ‏`updateTag` מיועד ל-Server Actions, במצב של "read your own writes". הוא מוחק את הרשומה מיד, וה-render שחוזר מאותו action כבר מחכה לנתונים טריים. ‏`revalidateTag("news", "max")` היה מגיש שוב את הגרסה הישנה ומחדש ברקע, ומי שלחץ על הכפתור לא היה רואה שינוי מיד.
- **הכפתור הוא `<form action={refreshNews}>` בתוך Server Component**, בלי `"use client"` ובלי `onClick`. הטופס עובד גם לפני שה-JavaScript נטען.

## אימות (production)

נבדק עם curl מול `npm start` (ה-build רץ ב-14:43:44):

| זמן | פעולה | "נמשך ב-" |
| --- | --- | --- |
| 14:43:53 | GET | 14:43:44 |
| 14:43:56 | GET | 14:43:44 (אותם נתונים) |
| 14:43:57 | POST של הטופס (Server Action ← `updateTag`) | |
| 14:43:57 | GET | 14:43:57 (נתונים חדשים מיד) |
| 14:43:59 | GET | 14:43:57 (הערך החדש נשמר שוב ב-cache) |

הקריאה ל-action נעשתה כמו שדפדפן בלי JavaScript שולח טופס: `curl -X POST -F '$ACTION_ID_<id>=' localhost:3000/`, כאשר ה-id לקוח מה-input הנסתר שבתוך ה-HTML של הטופס.
