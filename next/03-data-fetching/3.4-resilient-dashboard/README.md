# תרגיל 3.4 · דשבורד עמיד

דשבורד עם 4 ווידג'טים, כל אחד ממקור אחר. כל ווידג'ט נמצא ב-`<Suspense>` וב-error boundary משלו, כך שכשל של מקור אחד לא מפיל את הדף. כל הגישה לנתונים נמצאת ב-`lib/data.ts`, שמתחיל ב-`import "server-only"`.

| ווידג'ט | מקור |
| --- | --- |
| מזג אוויר | ‏API ציבורי: open-meteo.com |
| שערי מטבע | ‏API ציבורי: open.er-api.com |
| פוסטים אחרונים | ‏API ציבורי: jsonplaceholder.typicode.com |
| השרת | ‏`node:os` בשרת עצמו, עם השהיה מדומה של 1.5 שניות |

## הרצה

```bash
npm install
npm run dev          # http://localhost:3000
```

שבירה מכוונת של מקור, כדי לבדוק את ה-error boundary:

```bash
FAIL_WIDGET=weather npm run dev        # רק ווידג'ט מזג האוויר מציג שגיאה
FAIL_WIDGET=weather,rates npm run dev  # שניים נכשלים, השניים האחרים עובדים
```

## משתני סביבה

| משתנה | חובה | תיאור |
| --- | --- | --- |
| `FAIL_WIDGET` | לא | רשימה מופרדת בפסיקים מתוך `weather,rates,posts,server`. המקורות שברשימה זורקים שגיאה. |

## החלטות מרכזיות

- **סדר העטיפה: error boundary מבחוץ ו-Suspense מבפנים**, בקומפוננטה אחת בשם `Widget`. ה-Suspense מציג skeleton עד שהנתונים מגיעים, וה-boundary תופס שגיאה שנזרקת בזמן הרינדור ומציג במקום הווידג'ט הודעה וכפתור "נסו שוב". שאר הדף לא מושפע.
- **ה-boundary בנוי עם `catchError` מ-`next/error`**, בקובץ אחד עם `"use client"`. זו החלופה של Next לכתיבת class של React Error Boundary. ‏`retry()` מביא מחדש את הנתונים מהשרת, ו-`redirect()`/`notFound()` לא נתפסים בטעות. ‏`error.tsx` לא מתאים כאן, כי הוא תופס שגיאות של כל ה-segment ולא של ווידג'ט אחד.
- **`await connection()` בתחילת כל מקור**. בדשבורד הנתונים צריכים להיות טריים בכל בקשה. בלי השורה הזו, `os.uptime()` (שהוא סינכרוני) היה מחושב פעם אחת ב-build ונשמר ב-HTML. בפלט ה-build הדף מסומן `◐`: הכותרת והשלדים סטטיים, והווידג'טים מוזרמים.
- **`FAIL_WIDGET` במקום כשל אקראי**. כך הבדיקה צפויה וחוזרת על עצמה: אותו ווידג'ט נכשל בכל רענון.
- **`import "server-only"` ב-`lib/data.ts`** מבטיח שהקובץ, שמשתמש ב-`node:os` ושבעתיד יחזיק מפתחות API, לא ייכנס בטעות ל-bundle של הדפדפן.

## בדיקה: ייבוא של `lib/data.ts` מ-Client Component נכשל ב-build

הוספנו זמנית את `components/leak.tsx` עם `"use client"`, שמייבא את `getWeather` מ-`lib/data.ts`, והרצנו `npm run build`:

```
> Build error occurred
Error: Turbopack build failed with 2 errors:
./lib/data.ts:1:1
Error: You're importing a module that depends on "server-only". This API is only available in Server Components in the App Router, but you are using it in the Pages Router.
> 1 | import "server-only";
Import traces:
  Client Component Browser:
    ./lib/data.ts [Client Component Browser]
    ./components/leak.tsx [Client Component Browser]
```

ה-build נכשל (exit code 1). אחרי שמחקנו את הקובץ, ה-build עבר שוב. (הטקסט "Pages Router" בהודעה הוא ניסוח כללי של Next. מה שחשוב הוא ה-Import trace, שמראה את השרשרת `leak.tsx [Client Component Browser]` ← `lib/data.ts`.)

## אימות

נבדק בדפדפן headless מול `npm start`: בלי `FAIL_WIDGET` ארבעת הווידג'טים מציגים נתונים. עם `FAIL_WIDGET=weather` רק ווידג'ט מזג האוויר מציג "לא הצלחנו לטעון את הנתונים", ושלושת האחרים מציגים נתונים כרגיל.
