# תרגיל 5.4 · סטטיסטיקות עם aggregation

ממשיך את תרגיל 5.2. נוספו לו תגיות למתכונים, ביקורות עם דירוג ממוצע, ו-`GET /api/stats`.

```json
// GET /api/stats
{
  "byDifficulty": { "easy": 31, "hard": 36, "medium": 33 },
  "avgPrepMinutes": 92.4,
  "topTags": [{ "tag": "quick", "count": 27 }, ...]
}
```

| Method | נתיב | פעולה | Status |
| --- | --- | --- | --- |
| GET | `/api/stats` | מתכונים לכל רמת קושי, זמן הכנה ממוצע, 5 התגיות הנפוצות | 200 |
| POST | `/api/recipes/:id/reviews` | ביקורת חדשה (`rating` 1-5, `comment`) | 201 / 400 / 404 |

`GET /api/recipes/:id` מחזיר עכשיו גם `averageRating` ו-`reviewsCount`.

## הרצה

```bash
docker run -d --name mongo -p 27017:27017 mongo:8   # אם עוד לא רץ
npm install
cp .env.example .env
npm run seed    # 100 מתכונים, עכשיו עם תגיות
npm run dev
curl localhost:3000/api/stats
npm test
```

## משתני סביבה

| משתנה | משמעות | דוגמה |
| --- | --- | --- |
| `PORT` | הפורט שהשרת מאזין בו | `3000` |
| `MONGODB_URI` | כתובת המסד | `mongodb://127.0.0.1:27017/recipes` |

## החלטות מרכזיות

- **aggregation pipeline**: החישוב נעשה במסד, ולשרת חוזרות רק התוצאות ולא 100 מסמכים. `$group` לפי `$difficulty` עם `$sum: 1` סופר, ו-`$avg` מחשב ממוצע.
- **התגיות הנפוצות**: `$unwind` הופך מתכון עם 3 תגיות ל-3 מסמכים, ואחריו `$group` סופר כל תגית, `$sort` מסדר מהנפוצה ביותר ו-`$limit: 5` חותך. שדה המיון השני (`_id`) מבטיח שבמקרה של תיקו הסדר יהיה קבוע.
- **מחיקה רכה גם ב-aggregate**: ה-hooks של `find` לא רצים על `aggregate`. לכן יש hook של `pre("aggregate")` שמוסיף `$match: { deletedAt: null }` בתחילת כל pipeline, כך שמתכון מחוק לא נספר בסטטיסטיקות.
- **הדירוג הממוצע נשמר על המתכון** (denormalization), ולא מחושב בכל קריאה. ב-`post("save")` של `Review` מחשבים מחדש את הממוצע של כל הביקורות של המתכון ומעדכנים את `averageRating` ו-`reviewsCount`. Mongoose ממתין ל-hook האסינכרוני לפני ש-`create` מסתיים, ולכן הדירוג מעודכן כבר בתשובה לבקשה הבאה.
- חישוב מחדש מכל הביקורות, ולא "ממוצע ישן ועוד ביקורת חדשה", לא מצטבר שגיאות עיגול ונשאר נכון גם אם בעתיד יימחקו ביקורות.
- הוולידציה של `rating` נמצאת בסכמה: `min: 1`, `max: 5` ו-`Number.isInteger`. ה-error handler הקיים מתרגם אותה ל-400.
