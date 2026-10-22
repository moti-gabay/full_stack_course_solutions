# תרגיל 3.3 · ולידציה ומפתח API

## הרצה

```bash
npm install
cp .env.example .env    # קבעו API_KEY משלכם
npm run dev
curl -X POST localhost:3000/api/books -H "Content-Type: application/json" \
  -H "x-api-key: change-me" -d '{"title":"Dune"}'      # 400, missing: ["author"]
npm test
```

## משתני סביבה

| משתנה | משמעות | דוגמה |
| --- | --- | --- |
| `PORT` | הפורט שהשרת מאזין בו | `3000` |
| `API_KEY` | המפתח שנדרש ב-header `x-api-key` לפעולות כתיבה | `change-me` |

## החלטות מרכזיות

- `validate(fields)` היא factory: פונקציה שמחזירה middleware. ה-closure זוכר את `fields`, ולכן אותו קוד משמש לכל נתיב עם רשימת שדות אחרת.
- התשובה מחזירה את כל השדות החסרים בבת אחת (`missing`) ולא רק את הראשון. הלקוח מתקן הכל בסבב אחד.
- `requireApiKey` נרשם ברמת האפליקציה ובודק בעצמו את ה-method: `GET` עובר תמיד, ו-`POST`, `PATCH` ו-`DELETE` דורשים מפתח.
- המפתח נקרא מ-`process.env` בזמן הבקשה ולא נכתב בקוד. אם `API_KEY` לא מוגדר, כל פעולות הכתיבה נחסמות: שרת שהוגדר לא נכון נשאר נעול ולא פתוח.
- `401` פירושו "לא הזדהית" (אין מפתח או שהוא שגוי). `403` שמור למצב שבו הזהות ידועה אבל אין הרשאה, וזה יגיע בתרגיל 6.3.
