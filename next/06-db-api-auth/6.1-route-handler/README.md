# תרגיל 6.1 · Route Handler

`app/api/recipes/route.ts` עם `GET` שמחזיר את רשימת המתכונים ב-JSON, ו-`POST` שיוצר מתכון. המתכונים נשמרים במערך בזיכרון.

## הרצה

```bash
npm install
npm run dev
```

את הבקשות מריצים מ-`requests.http` (בעזרת התוסף REST Client ב-VS Code, או עם HTTP Client של JetBrains): `GET`, `POST` תקין, `POST` לא תקין שמחזיר 400, ו-`GET` שמראה את המתכון החדש. בבדיקה עם `curl`, ה-`POST` החזיר `201` עם `id: 3`, וה-`GET` שאחריו כלל את המתכון.

## משתני סביבה

אין.

## החלטות מרכזיות

- **הקובץ `route.ts` מייצא פונקציה לכל method**: `GET` ו-`POST` מקבלים `Request` רגיל ומחזירים `Response` רגיל (`Response.json(data, { status })`). אין `req`/`res` כמו ב-Express.
- **`await connection()` ב-`GET`**: כש-`cacheComponents` מופעל, `GET` שלא ניגש לנתוני זמן ריצה נבנה מראש ב-build כתשובה סטטית. במקרה כזה, מתכון שנוצר ב-`POST` לא היה מופיע ב-`GET`. `connection()` אומר ל-Next שהתשובה תלויה בבקשה, ולכן ה-handler רץ בכל בקשה (בפלט ה-build הנתיב מסומן `ƒ`).
- **ולידציה בסיסית ו-400**: גוף שאינו JSON, `title` של פחות מ-3 תווים, או `prepMinutes` לא תקין מחזירים 400 עם הודעה. יצירה מוצלחת מחזירה 201 עם המתכון שנוצר, כמו ב-REST של Express.
- **מערך בזיכרון**: הנתונים מתאפסים בכל הפעלה מחדש, ובסביבת serverless כל instance מחזיק עותק משלו. בתרגיל 6.2 עוברים ל-MongoDB.
