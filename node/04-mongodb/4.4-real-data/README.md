# תרגיל 4.4 · נתונים אמיתיים

ממשיך את תרגיל 4.3: seed עם faker, `slug` ייחודי, מחיקה רכה ו-PATCH עם ולידציה.

## הרצה

```bash
docker run -d --name mongo -p 27017:27017 mongo:8   # אם עוד לא רץ
npm install
cp .env.example .env
npm run seed    # מוחק את האוסף ומכניס 100 מתכונים
npm run dev
npm test
```

## משתני סביבה

| משתנה | משמעות | דוגמה |
| --- | --- | --- |
| `PORT` | הפורט שהשרת מאזין בו | `3000` |
| `MONGODB_URI` | כתובת המסד | `mongodb://127.0.0.1:27017/recipes` |

## החלטות מרכזיות

- **`slug`** נוצר תמיד מה-title ולא נשלח על ידי הלקוח. ב-POST זה קורה ב-`pre("validate")`. PATCH עובר דרך `findOneAndUpdate`, שלא מריץ hooks של מסמך, ולכן יש לו hook נפרד שמעדכן את ה-slug כשה-title משתנה.
- **`unique: true` הוא אינדקס במסד, לא ולידציה.** Mongoose לא בודק כפילויות; MongoDB דוחה את הכתיבה עם קוד `11000`, וה-error handler מתרגם אותו ל-409. האינדקס חייב להיות קיים לפני הכתיבה, ולכן ה-seed קורא ל-`Recipe.init()`.
- **מחיקה רכה**: `DELETE` רק מסמן `deletedAt`. hook על `/^find/` ועל `countDocuments` מוסיף `deletedAt: null` לכל שאילתה, כך שאי אפשר לשכוח את הסינון בנתיב חדש. בגלל זה גם GET, PATCH ו-DELETE על מתכון מחוק מחזירים 404.
- **`runValidators: true`**: בלי זה, `findByIdAndUpdate` לא מריץ את כללי הסכמה, ו-`difficulty: "x"` היה נשמר. עם האפשרות הזו בודקים רק את השדות שנשלחו, ושאר השדות לא נוגעים בהם.
- ה-seed משתמש ב-`Recipe.create` ולא ב-`insertMany`, כדי שה-hook של ה-slug ירוץ על כל מסמך. הכותרות נבחרות כך שה-slug שלהן ייחודי.
- **שימו לב**: מתכון שנמחק מחיקה רכה עדיין תופס את ה-slug שלו. יצירה מחדש של אותה כותרת תחזיר 409. אם רוצים לאפשר את זה, משתמשים ב-partial index (`partialFilterExpression: { deletedAt: null }`).
