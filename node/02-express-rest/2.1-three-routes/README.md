# תרגיל 2.1 · שלושה נתיבים

## הרצה

```bash
npm install
cp .env.example .env
npm run dev        # node --env-file=.env --watch server.js
curl -i localhost:3000/time
npm test
```

## משתני סביבה

| משתנה | משמעות | דוגמה |
| --- | --- | --- |
| `PORT` | הפורט שהשרת מאזין בו | `3000` |

## החלטות מרכזיות

- `res.json()` ממיר את האובייקט ל-JSON וקובע לבד `Content-Type: application/json`. לא צריך `JSON.stringify` או `setHeader`.
- `app.js` רק מגדיר את האפליקציה ומייצא אותה, ו-`server.js` רק מפעיל `listen`. ההפרדה מאפשרת ל-supertest לבדוק את האפליקציה בלי לפתוח פורט אמיתי.
- `node --env-file=.env` טוען את הקובץ ל-`process.env` ישירות מ-Node, בלי `dotenv`. הקובץ `.env` ב-`.gitignore`, ולצידו `.env.example` שמראה אילו משתנים צריך.
- הבדיקה של הפורט מריצה את `server.js` אמיתי עם קובץ env זמני, ובודקת שהשרת עונה על הפורט שהוגדר בו.
