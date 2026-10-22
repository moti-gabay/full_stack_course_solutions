# תרגיל 6.4 · תפקידים ו-refresh token

ממשיך את תרגיל 6.3.

| Method | נתיב | פעולה | Status |
| --- | --- | --- | --- |
| POST | `/auth/register` | הרשמה; תפקיד ברירת המחדל הוא `user` | 201 / 400 / 409 |
| POST | `/auth/login` | מחזיר `{ accessToken }` וקובע cookie בשם `refreshToken` | 200 / 400 / 401 / 429 |
| POST | `/auth/refresh` | עם ה-cookie: access token חדש ו-cookie חדש | 200 / 401 |
| POST | `/auth/logout` | מבטל את ה-refresh token ומוחק את ה-cookie | 204 |
| GET | `/auth/me` | המשתמש המחובר | 200 / 401 |
| GET | `/api/admin/users` | כל המשתמשים, רק ל-admin | 200 / 401 / 403 |

נתיבי `/api/recipes` זהים לתרגיל 6.3.

## הרצה

```bash
docker run -d --name mongo -p 27017:27017 mongo:8   # אם עוד לא רץ
npm install
cp .env.example .env    # שני סודות שונים ל-JWT_SECRET ול-REFRESH_TOKEN_SECRET
npm run dev
npm test                # כל זרימת האימות עם supertest
```

הפיכת משתמש ל-admin (אין לזה נתיב ב-API, בכוונה):

```bash
mongosh "mongodb://127.0.0.1:27017/auth" --eval 'db.users.updateOne({ email: "dana@example.com" }, { $set: { role: "admin" } })'
```

אחרי השינוי צריך להתחבר מחדש, כי התפקיד נקבע ב-access token ברגע ההתחברות.

בדיקה ידנית עם curl (קובץ `cookies.txt` משמש כ-cookie jar):

```bash
curl -i -c cookies.txt -X POST localhost:3000/auth/login -H "Content-Type: application/json" \
  -d '{"email":"dana@example.com","password":"secret123"}'    # Set-Cookie: refreshToken=...; HttpOnly
curl -b cookies.txt -c cookies.txt -X POST localhost:3000/auth/refresh
curl -b cookies.txt -X POST localhost:3000/auth/logout
curl -b cookies.txt -X POST localhost:3000/auth/refresh      # 401
```

## משתני סביבה

| משתנה | משמעות | דוגמה |
| --- | --- | --- |
| `PORT` | הפורט שהשרת מאזין בו | `3000` |
| `MONGODB_URI` | כתובת המסד | `mongodb://127.0.0.1:27017/auth` |
| `JWT_SECRET` | חותם על ה-access tokens | מחרוזת אקראית ארוכה |
| `REFRESH_TOKEN_SECRET` | חותם על ה-refresh tokens; סוד **שונה** מ-`JWT_SECRET` | מחרוזת אקראית ארוכה |
| `ACCESS_TOKEN_TTL` | תוקף ה-access token | `15m` |
| `REFRESH_TOKEN_TTL` | תוקף ה-refresh token | `7d` |
| `NODE_ENV` | ב-`production` ה-cookie מקבל `Secure` ונשלח רק ב-HTTPS | `production` |

## החלטות מרכזיות

- **שני tokens, שני תפקידים**: ה-access token קצר (15 דקות) ונשלח ב-header בכל בקשה. אם הוא דולף, הנזק מוגבל בזמן. ה-refresh token ארוך (7 ימים) ונמצא רק ב-cookie מסוג `httpOnly`, ש-JavaScript בדפדפן לא יכול לקרוא, ולכן XSS לא יכול לגנוב אותו. `sameSite: "strict"` ו-`path: "/auth"` מצמצמים את הבקשות שה-cookie נשלח בהן.
- **refresh token שאפשר לבטל**: JWT לבד אי אפשר "למחוק", כי הוא תקף עד שהוא פג. לכן כל refresh token מקבל `jti` אקראי, והמשתמש שומר במסד את ה-`jti` היחיד שתקף כרגע. `logout` מוחק אותו, וכל refresh מחליף אותו (rotation), כך ש-cookie ישן, למשל כזה שנגנב, מפסיק לעבוד. החיסרון של המימוש הזה: session אחד לכל משתמש. התחברות ממכשיר שני מנתקת את הראשון. לתמיכה בכמה מכשירים שומרים רשימה של `jti`.
- **התפקיד נמצא ב-access token, אבל לא סומכים עליו לבד**: `requireAuth` טוען את המשתמש מהמסד, ו-`requireRole` בודק את `req.user.role`. כך הורדת הרשאת admin נכנסת לתוקף מיד.
- `router.use(requireAuth, requireRole("admin"))` בראש ה-router של admin מגן על כל נתיב שיתווסף אליו בעתיד, בלי לסמן כל נתיב בנפרד.
- **הגבלת ניסיונות התחברות** נספרת לפי IP ומייל, ורק על כישלונות. אחרי 5 כישלונות ברצף, גם הסיסמה הנכונה נחסמת ל-15 דקות (429 עם `Retry-After`), והתחברות מוצלחת מאפסת את המונה. ההגבלה לפי שילוב של IP ומייל מונעת מתוקף לנעול משתמש אחר מכל מקום. ההגנה נגד ניחוש מתואם מהרבה IPs דורשת גם מונה לפי מייל בלבד, וזה מעבר להיקף התרגיל.
- הבדיקות משתמשות ב-`request.agent(app)`, ששומר cookies בין בקשות כמו דפדפן. `ACCESS_TOKEN_TTL=1s` בבדיקה מאפשר לראות token פג בלי לחכות 15 דקות.
