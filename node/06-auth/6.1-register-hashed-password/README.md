# תרגיל 6.1 · הרשמה עם סיסמה מוצפנת

## הרצה

```bash
docker run -d --name mongo -p 27017:27017 mongo:8   # אם עוד לא רץ
npm install
cp .env.example .env
npm run dev
curl -X POST localhost:3000/auth/register -H "Content-Type: application/json" \
  -d '{"email":"dana@example.com","password":"secret123"}'
npm test
```

## משתני סביבה

| משתנה | משמעות | דוגמה |
| --- | --- | --- |
| `PORT` | הפורט שהשרת מאזין בו | `3000` |
| `MONGODB_URI` | כתובת המסד | `mongodb://127.0.0.1:27017/auth` |
| `JWT_SECRET` | עוד לא בשימוש; נדרש מתרגיל 6.2 | מחרוזת אקראית ארוכה |

## החלטות מרכזיות

- **hash, לא הצפנה**: bcrypt הוא חד-כיווני. בהתחברות לא "מפענחים" את הסיסמה, אלא מחשבים hash לסיסמה שנשלחה ומשווים (`bcrypt.compare`). ה-salt נשמר בתוך ה-hash עצמו (`$2b$10$<salt><hash>`), ולכן אין שדה נפרד בשבילו.
- `SALT_ROUNDS = 10` קובע כמה זמן לוקח כל hash (2^10 סיבובים). האיטיות מכוונת: היא מה שהופך ניחוש של מיליוני סיסמאות ליקר.
- ה-hash נעשה ב-`pre("save")` של המודל ולא בנתיב, כך שכל שמירה של סיסמה חדשה עוברת hash. `isModified("password")` מונע hash כפול כשמעדכנים שדה אחר. הוולידציה (`minlength: 8`) רצה לפני ה-hook, ולכן היא בודקת את הסיסמה המקורית.
- **הסיסמה לא יוצאת בשתי דרכים**: `select: false` מונע ממנה להיטען ב-`find`. אבל המסמך שזה עתה נוצר עדיין מחזיק את ה-hash בזיכרון, ולכן `toJSON` מוחק אותה גם מכל תשובה.
- **email ייחודי** הוא אינדקס במסד (`unique: true`), ו-`lowercase: true` מבטיח ש-`Dana@` ו-`dana@` נחשבים לאותו מייל. כפילות מחזירה מהמסד קוד `11000`, וה-error handler מתרגם אותה ל-409. בדיקה מראש עם `findOne` הייתה משאירה race condition בין שתי בקשות במקביל.
