# תרגיל 2.3 · API מתכונים בזיכרון

## הרצה

```bash
npm install
cp .env.example .env
npm run dev
npm test
```

את `requests.http` מריצים בתוסף REST Client של VS Code: יש בו בקשה לכל נתיב, כולל מקרי 400 ו-404.

## משתני סביבה

| משתנה | משמעות | דוגמה |
| --- | --- | --- |
| `PORT` | הפורט שהשרת מאזין בו | `3000` |

## הנתיבים

| Method | נתיב | פעולה | Status |
| --- | --- | --- | --- |
| GET | `/api/recipes` | כל המתכונים | 200 |
| GET | `/api/recipes/:id` | מתכון אחד | 200 / 404 |
| POST | `/api/recipes` | יצירה | 201 / 400 |
| PATCH | `/api/recipes/:id` | עדכון חלקי | 200 / 400 / 404 |
| DELETE | `/api/recipes/:id` | מחיקה | 204 / 404 |

## החלטות מרכזיות

- `Router` נפרד ב-`routes/recipes.js`, שמחובר ב-`app.use("/api/recipes", ...)`. בתוך ה-router הנתיבים יחסיים (`/` ו-`/:id`).
- בלי `express.json()` הערך של `req.body` הוא `undefined`. ה-middleware חייב להירשם לפני ה-router.
- `validate` אחת משמשת גם ל-POST וגם ל-PATCH. ב-PATCH (`partial`) בודקים רק את השדות שנשלחו.
- `pick` מעתיקה רק שדות מוכרים, כך שלקוח לא יכול לדרוס את `id` ב-PATCH.
- `204` נשלח עם `res.sendStatus(204)` ובלי גוף. מזהה מה-URL הוא מחרוזת, ולכן משווים עם `Number(id)`.
- הנתונים נשמרים בזיכרון ונמחקים בכל הפעלה מחדש. את זה פותרים בתרגיל 4.3 עם MongoDB.
