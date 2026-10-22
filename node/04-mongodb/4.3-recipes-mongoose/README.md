# תרגיל 4.3 · API מתכונים עם Mongoose

ממשיך את תרגיל 2.3: אותם נתיבים ואותו `requests.http`, אבל הנתונים נשמרים ב-MongoDB.

## הרצה

```bash
docker run -d --name mongo -p 27017:27017 mongo:8   # אם עוד לא רץ
npm install
cp .env.example .env
npm run dev
npm test        # מול mongodb-memory-server, בלי Docker
```

ב-`requests.http` הבקשה הראשונה יוצרת מתכון, ו-`@id` לוקח את ה-`_id` מהתשובה שלה. לכן מריצים אותה ראשונה.

## משתני סביבה

| משתנה | משמעות | דוגמה |
| --- | --- | --- |
| `PORT` | הפורט שהשרת מאזין בו | `3000` |
| `MONGODB_URI` | כתובת המסד | `mongodb://127.0.0.1:27017/recipes` |

## החלטות מרכזיות

- הוולידציה עברה מהקוד בנתיב לסכמה: `required`, `minlength: 3`, `enum` ו-`min: 1`. ה-router כבר לא בודק שדות; הוא שולח את `req.body` ל-`Recipe.create`, והמודל אוכף את הכללים.
- **error handler אחד** מתרגם את שגיאות Mongoose: `ValidationError` מחזיר 400 עם הודעה לכל שדה, ו-`CastError` (מזהה כמו `abc` שאינו ObjectId) מחזיר 400 במקום 500. ב-Express 5 שגיאה מפונקציית `async` מגיעה לשם לבד, בלי `try/catch` בכל נתיב.
- `findById` מחזיר `null` כשאין מסמך, ולא זורק שגיאה. מזהה תקין שלא קיים מחזיר 404, ומזהה לא תקין מחזיר 400. אלה שני מקרים שונים.
- `{ timestamps: true }` מוסיף `createdAt` ו-`updatedAt` ומעדכן אותם לבד.
- `returnDocument: "after"` מחזיר את המסמך אחרי העדכון. במצגת מופיע `{ new: true }`, שעדיין עובד, אבל ב-Mongoose 9 הוא deprecated ומדפיס אזהרה.
- **שימו לב**: `findByIdAndUpdate` לא מריץ ולידציה כברירת מחדל, ולכן ב-PATCH אפשר עדיין לשמור `difficulty: "x"`. את זה סוגרים בתרגיל 4.4 עם `runValidators`.
- `server.js` ממתין ל-`connectDB()` ורק אחר כך קורא ל-`listen`. השרת לא מקבל בקשות לפני שיש מסד.
