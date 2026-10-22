# תרגיל 1.3 · layouts מקוננים

דשבורד עם layout של סרגל צד, Route Group בשם `(marketing)` עם layout אחר, ו-`loading.tsx`, `error.tsx` ו-`not-found.tsx` מעוצבים.

## הרצה

```bash
npm install
npm run dev
```

- `/` ו-`/about`: דפי `(marketing)` עם header ו-footer, בלי סרגל צד.
- `/dashboard` ו-`/dashboard/settings`: עם סרגל הצד.
- `/dashboard/slow`: מחכה 3 שניות, ובינתיים מוצג `loading.tsx`.
- `/dashboard/broken`: נכשל בערך בחצי מהפעמים ומציג את `error.tsx`. "נסו שוב" מרנדר את הדף מחדש, ולפעמים הוא מצליח.
- כל כתובת שלא קיימת (למשל `/nope`) מציגה את `not-found.tsx` המעוצב.

## משתני סביבה

אין.

## החלטות מרכזיות

- תיקייה בסוגריים, `(marketing)`, מקבצת דפים תחת layout משותף בלי להשפיע על הכתובת: `app/(marketing)/about/page.tsx` הוא `/about`, ו-`/marketing` מחזיר 404.
- ה-layout הראשי (`app/layout.tsx`) מכיל רק `<html>` ו-`<body>`. כל קבוצה מוסיפה layout משלה, ולכן לדשבורד ולאתר השיווקי יש מבנה שונה לגמרי.
- `loading.tsx` הוא בעצם `<Suspense>` שעוטף את הדפים באותה תיקייה. כדי שההשהיה תקרה בזמן בקשה ולא בזמן ה-build, הדף האיטי קורא קודם ל-`connection()` (עם Cache Components, דף בלי נתוני runtime נבנה מראש כסטטי).
- `error.tsx` חייב להיות Client Component, כי זה Error Boundary של React. ב-Next 16 הוא מקבל את `retry()` (שמרנדר מחדש את הסגמנט), במקום `reset()` מגרסאות קודמות.
- `error.tsx` עוטף את הדפים שמתחתיו, אבל לא את ה-layout של אותה תיקייה, ולכן סרגל הצד נשאר גם כשיש שגיאה.
- `app/not-found.tsx` תופס כל כתובת שלא קיימת באפליקציה.
