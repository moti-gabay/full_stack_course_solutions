# תרגיל 3.1 · Logger

## הרצה

```bash
npm install
cp .env.example .env
npm run dev
curl localhost:3000/ && curl localhost:3000/slow && curl localhost:3000/nope
npm test
```

דוגמה לפלט בטרמינל:

```
[14:32:05] GET / 200 1.8ms
[14:32:06] GET /slow 200 302.4ms
[14:32:06] GET /nope 404 0.9ms
```

## משתני סביבה

| משתנה | משמעות | דוגמה |
| --- | --- | --- |
| `PORT` | הפורט שהשרת מאזין בו | `3000` |

## החלטות מרכזיות

- ה-logger נרשם ראשון ב-`app.use`, ולכן הוא רץ על כל בקשה, גם על נתיב שלא קיים: ה-404 של Express מגיע רק בסוף השרשרת.
- שלב 1 היה `console.log` לפני `next()`. בשלב 2 ההדפסה עברה לתוך `res.on("finish")`. ב-`next()` הבקשה רק ממשיכה הלאה ועוד לא נענתה, ורק ב-`finish` יודעים את הסטטוס ואת משך הזמן.
- הזמן נמדד עם `performance.now()` ולא עם `Date.now()`: הוא מונוטוני ומדויק לשברי מילישנייה.
- `req.originalUrl` ולא `req.url`: בתוך router שמחובר על prefix, `req.url` מאבד את ה-prefix.
- `/slow` קיים כדי לראות שהזמן הנמדד הוא באמת זמן התגובה.
