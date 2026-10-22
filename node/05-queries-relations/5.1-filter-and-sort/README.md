# תרגיל 5.1 · סינון ומיון

ממשיך את תרגיל 4.4. `GET /api/recipes` מקבל עכשיו פרמטרים אופציונליים:

| פרמטר | משמעות | דוגמה |
| --- | --- | --- |
| `difficulty` | רק מתכונים ברמת הקושי הזו (`easy` / `medium` / `hard`) | `difficulty=easy` |
| `maxTime` | רק מתכונים של עד X דקות (`prepMinutes <= X`) | `maxTime=30` |
| `sort` | מיון לפי `createdAt`, `prepMinutes` או `title`. `-` בהתחלה פירושו סדר יורד | `sort=-createdAt` |

## הרצה

```bash
docker run -d --name mongo -p 27017:27017 mongo:8   # אם עוד לא רץ
npm install
cp .env.example .env
npm run seed
npm run dev
curl "localhost:3000/api/recipes?difficulty=easy&maxTime=30&sort=-createdAt"
npm test
```

## משתני סביבה

| משתנה | משמעות | דוגמה |
| --- | --- | --- |
| `PORT` | הפורט שהשרת מאזין בו | `3000` |
| `MONGODB_URI` | כתובת המסד | `mongodb://127.0.0.1:27017/recipes` |

## החלטות מרכזיות

- `parseListQuery` מתרגמת את ה-query string לאובייקט `filter` ולאובייקט `sort` של Mongo, והנתיב עצמו נשאר שורה אחת. פרמטר שלא נשלח לא נכנס לסינון בכלל.
- **לא מעבירים את `req.query` כמו שהוא ל-`find`.** כל פרמטר נבדק מול רשימה מותרת (`DIFFICULTIES`, `SORT_FIELDS`), וכך לקוח לא יכול לסנן או למיין לפי שדות שלא התכוונו לחשוף.
- `maxTime` מגיע כמחרוזת. `Number("abc")` הוא `NaN`, ולכן בודקים `Number.isInteger` וערך חיובי. הסינון עצמו הוא `{ prepMinutes: { $lte: 30 } }`.
- `sort=-createdAt` נכתב כ-`{ createdAt: -1 }`. אותו פורמט עם `-` הוא מוסכמה נפוצה ב-REST APIs.
- פרמטר שהוזכר פעמיים (`?sort=a&sort=b`) מגיע כמערך, ונדחה עם 400 במקום לגרום ל-500.
- ה-hook של המחיקה הרכה מתרגיל 4.4 עדיין פעיל: `find(filter)` מוסיף `deletedAt: null` לכל סינון.
