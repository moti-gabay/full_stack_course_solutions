# תרגיל 4.1 · חיבור ראשון

## הרצה

מפעילים MongoDB מקומי ב-Docker (או משתמשים בכתובת של Atlas):

```bash
docker run -d --name mongo -p 27017:27017 mongo:8
npm install
cp .env.example .env
npm start            # node --env-file=.env index.js
npm test             # רץ מול mongodb-memory-server, בלי Docker
```

כל הרצה מוסיפה 3 ספרים ומדפיסה את כל האוסף, כך שבהרצה השנייה יודפסו 6 ספרים. ב-Compass מתחברים לאותה כתובת ורואים את האוסף `books` במסד `library`.

## משתני סביבה

| משתנה | משמעות | דוגמה |
| --- | --- | --- |
| `MONGODB_URI` | כתובת המסד, כולל שם המסד בסוף | `mongodb://127.0.0.1:27017/library` |

ב-Atlas הכתובת נראית כך: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/library`.

## החלטות מרכזיות

- הכתובת מגיעה רק מ-`process.env.MONGODB_URI` ולא כתובה בקוד. סיסמה של Atlas שנכנסת ל-Git נשארת בהיסטוריה לתמיד.
- מודל בשם `Book` נשמר אוטומטית באוסף `books`: Mongoose מוריד לאותיות קטנות ומוסיף s.
- `insertMany` שולח את שלושת הספרים בפקודה אחת למסד, במקום שלוש קריאות `create`.
- `finally` עם `mongoose.disconnect()`: חיבור פתוח משאיר את התהליך חי, ובלי ניתוק הסקריפט לא מסתיים. בגלל זה גם לא מריצים את הסקריפט עם `--watch`.
- הבדיקות מריצות את הסקריפט מול `mongodb-memory-server`, מסד אמיתי שעולה בזיכרון לכל ריצת בדיקות.
