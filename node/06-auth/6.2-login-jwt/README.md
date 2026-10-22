# תרגיל 6.2 · התחברות עם JWT

ממשיך את תרגיל 6.1.

| Method | נתיב | פעולה | Status |
| --- | --- | --- | --- |
| POST | `/auth/register` | הרשמה (`email`, `password`) | 201 / 400 / 409 |
| POST | `/auth/login` | התחברות, מחזיר `{ token }` | 200 / 400 / 401 |
| GET | `/auth/me` | המשתמש המחובר (דורש `Authorization: Bearer <token>`) | 200 / 401 |

## הרצה

```bash
docker run -d --name mongo -p 27017:27017 mongo:8   # אם עוד לא רץ
npm install
cp .env.example .env    # קבעו JWT_SECRET אקראי: node -e "console.log(crypto.randomBytes(32).toString('hex'))"
npm run dev

TOKEN=$(curl -s -X POST localhost:3000/auth/login -H "Content-Type: application/json" \
  -d '{"email":"dana@example.com","password":"secret123"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')
curl localhost:3000/auth/me -H "Authorization: Bearer $TOKEN"
npm test
```

לבדיקה ידנית של token שפג תוקפו: `JWT_EXPIRES_IN=10s` ב-`.env`, מתחברים, מחכים 10 שניות ושולחים שוב.

## משתני סביבה

| משתנה | משמעות | דוגמה |
| --- | --- | --- |
| `PORT` | הפורט שהשרת מאזין בו | `3000` |
| `MONGODB_URI` | כתובת המסד | `mongodb://127.0.0.1:27017/auth` |
| `JWT_SECRET` | המפתח שחותם על ה-tokens. מי שמחזיק בו יכול לזייף כל משתמש | מחרוזת אקראית של 32 bytes לפחות |
| `JWT_EXPIRES_IN` | תוקף ה-token | `1h` |

## החלטות מרכזיות

- **JWT חתום, לא מוצפן**: כל אחד יכול לקרוא את ה-payload (נסו ב-jwt.io). החתימה רק מבטיחה שאף אחד לא שינה אותו. לכן ה-payload מכיל רק `sub` (מזהה המשתמש), בלי מייל או תפקיד שעלולים להתיישן.
- `jwt.verify` זורק שגיאה על חתימה לא נכונה, על token פגום ועל `exp` שעבר. שלושת המקרים מחזירים 401. `algorithms: ["HS256"]` מונע מתוקף לבחור אלגוריתם אחר דרך ה-header של ה-token.
- **אותה הודעה** ל"משתמש לא קיים" ול"סיסמה שגויה": תשובות שונות היו מאפשרות לבדוק אילו מיילים רשומים במערכת.
- ב-login צריך `.select("+password")`, כי בתרגיל 6.1 הסיסמה הוגדרה `select: false`.
- `requireAuth` טוען את המשתמש מהמסד ושם אותו ב-`req.user`. כך משתמש שנמחק מאבד גישה מיד, גם אם ה-token שלו עדיין בתוקף. כל נתיב שצריך משתמש מחובר מקבל את ה-middleware כפרמטר: `router.get("/me", requireAuth, ...)`.
