# תרגיל 5.1 · טופס ראשון

טופס הוספת משימה שעובד עם Server Action: הנתונים נשמרים בקובץ JSON, ו-`revalidatePath` מרענן את הרשימה.

## הרצה

```bash
npm install
npm run dev
```

פותחים את http://localhost:3000, מוסיפים משימה, והיא מופיעה ברשימה בלי רענון ידני. המשימות נשמרות ב-`data/tasks.json` (הקובץ נוצר בהוספה הראשונה, ונמצא ב-`.gitignore`).

## משתני סביבה

אין.

## החלטות מרכזיות

- **`<form action={createTask}>`**: הטופס מעביר את ה-Server Action ישירות ל-`action`. React שולח את ה-`FormData` לשרת בבקשת POST, ולכן אין `onSubmit` ואין `fetch` בקוד. הטופס עובד גם בלי JavaScript (progressive enhancement), כי הדף כולו Server Component.
- **`"use server"` בקובץ נפרד (`app/actions.ts`)**: כל פונקציה שמיוצאת מהקובץ היא Server Action. הקוד שלה לא מגיע לדפדפן; הדפדפן מקבל רק מזהה של ה-action.
- **`revalidatePath("/")` אחרי השמירה**: הוא מבטל את ה-cache של הדף, ו-Next מחזיר את הדף המעודכן באותה תשובה של ה-action. זה מה שגורם למשימה להופיע בלי רענון.
- **רשימה בתוך `<Suspense>`**: קריאת הקובץ היא I/O שלא נשמר ב-cache. עם `cacheComponents` היא חייבת לשבת בתוך Suspense, אחרת ה-build נכשל. הכותרת והטופס נכנסים ל-static shell, והרשימה נטענת בזמן הבקשה (בפלט ה-build הנתיב `/` מסומן ◐ Partial Prerender).
- **`lib/tasks.ts` עם `import "server-only"`**: הגישה לקובץ מרוכזת במקום אחד, וייבוא שלו מקומפוננטת לקוח ייכשל ב-build.
