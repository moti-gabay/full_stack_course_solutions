# תרגיל 2.2 · params ו-query

## הרצה

```bash
npm install
cp .env.example .env
npm run dev
curl "localhost:3000/greet/Dana?lang=he"
curl "localhost:3000/sum?a=3&b=4"
npm test
```

## משתני סביבה

| משתנה | משמעות | דוגמה |
| --- | --- | --- |
| `PORT` | הפורט שהשרת מאזין בו | `3000` |

## החלטות מרכזיות

- `req.params` הוא חלק מהנתיב עצמו (`/greet/:name`), ו-`req.query` הוא מה שאחרי ה-`?`. שניהם מגיעים תמיד כמחרוזות.
- `Number("")` מחזיר 0 ו-`Number(undefined)` מחזיר `NaN`, ולכן `toNumber` בודקת קודם שקיבלה מחרוזת לא ריקה ורק אחר כך את `Number.isFinite`. כך גם `?a=1&a=2`, שמגיע כמערך, נדחה עם 400.
- שפה שאינה `he` נופלת לאנגלית, כך שלא צריך להחזיר שגיאה על `lang` לא מוכר.
- `return res.status(400)...`: ה-`return` עוצר את הפונקציה, אחרת הקוד ממשיך ומנסה לשלוח תשובה שנייה.
