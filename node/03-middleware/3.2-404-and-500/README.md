# תרגיל 3.2 · 404 ו-500

## הרצה

```bash
npm install
cp .env.example .env
npm run dev
curl -i localhost:3000/nope    # 404 ב-JSON
curl -i localhost:3000/crash   # 500 ב-JSON, והשרת ממשיך לרוץ
curl -i localhost:3000/
npm test
```

## משתני סביבה

| משתנה | משמעות | דוגמה |
| --- | --- | --- |
| `PORT` | הפורט שהשרת מאזין בו | `3000` |

## החלטות מרכזיות

- הסדר קובע: `notFound` נרשם אחרי כל הנתיבים, ולכן מגיעים אליו רק כשאף נתיב לא ענה. ה-`errorHandler` נרשם אחרון.
- Express מזהה error handler לפי ארבעה פרמטרים `(err, req, res, next)`, ולכן `next` נשאר בחתימה גם כשלא משתמשים בו.
- שגיאה שנזרקת בנתיב לא מפילה את התהליך: Express תופס אותה ומעביר אותה ל-error handler. ב-Express 5 זה עובד גם בפונקציות `async`.
- את השגיאה המלאה מדפיסים בשרת (`console.error`), אבל ללקוח שולחים רק "שגיאת שרת". הודעות פנימיות ו-stack trace הם מידע לתוקף. שגיאה עם `err.status` (למשל 400) מחזירה את ההודעה שלה, כי היא מיועדת ללקוח.
