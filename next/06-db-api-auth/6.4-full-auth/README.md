# תרגיל 6.4 · אימות מלא

Auth.js (`next-auth@5`) עם התחברות GitHub ועם סיסמה, דשבורד מוגן, ובדיקת בעלות בכל Server Action. בסוף ה-README יש הדגמה מתועדת של ניסיון התקפה.

## הרצה

```bash
docker run -d --name mongo -p 27017:27017 mongo:8   # אם אין MongoDB מקומי
npm install
cp .env.example .env.local
npx auth secret        # כותב AUTH_SECRET אקראי ל-.env.local
npm run dev
```

- `/register`: הרשמה עם שם, אימייל וסיסמה. אחרי ההרשמה מתחברים אוטומטית.
- `/login`: התחברות עם GitHub או עם אימייל וסיסמה.
- `/dashboard`: המתכונים של המשתמש המחובר: הוספה, עריכה ומחיקה. משתמש לא מחובר מופנה ל-`/login`.

## משתני סביבה

| משתנה | משמעות | דוגמה |
| --- | --- | --- |
| `MONGODB_URI` | כתובת MongoDB (משתמשים ומתכונים) | `mongodb://127.0.0.1:27017/full-auth` |
| `AUTH_SECRET` | מפתח להצפנת ה-JWT ב-cookie. יוצרים עם `npx auth secret` | `replace-with-a-random-secret` |
| `AUTH_GITHUB_ID` | Client ID של ה-OAuth App ב-GitHub | `your-github-oauth-client-id` |
| `AUTH_GITHUB_SECRET` | Client secret של ה-OAuth App | `your-github-oauth-client-secret` |
| `AUTH_TRUST_HOST` | נדרש ב-`next start` מחוץ ל-Vercel, כדי ש-Auth.js יסמוך על ה-Host של הבקשה | `true` |

## הגדרת GitHub OAuth (צעדים ידניים)

ההתחברות עם סיסמה עובדת בלי שום הגדרה חיצונית. כדי שגם GitHub יעבוד:

1. ב-GitHub: **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. ממלאים:
   - **Application name**: כל שם, למשל `recipes-local`.
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. אחרי **Register application** מעתיקים את ה-**Client ID** ל-`AUTH_GITHUB_ID`, לוחצים **Generate a new client secret** ומעתיקים אותו ל-`AUTH_GITHUB_SECRET`.
4. מפעילים מחדש את `npm run dev` ולוחצים "התחברות עם GitHub".

בפריסה (למשל Vercel) יוצרים OAuth App נפרד, עם callback של הדומיין האמיתי: `https://<domain>/api/auth/callback/github`. ל-OAuth App ב-GitHub יש callback URL אחד בלבד.

בלי ערכים אמיתיים, הכפתור עדיין מפנה ל-`https://github.com/login/oauth/authorize?...&client_id=placeholder-client-id`, ושם GitHub מחזיר שגיאה. זה מראה שה-flow בצד שלנו מחובר נכון.

## החלטות מרכזיות

- **Auth.js v5 (`next-auth@beta`)**: הוא מתקין בלי התנגשויות עם Next 16.4 ו-React 19.3 (ה-peer dependency הוא `next: ^16`). הקובץ `auth.ts` מייצא `auth`, `signIn`, `signOut` ו-`handlers`, ו-`app/api/auth/[...nextauth]/route.ts` רק מחבר את ה-handlers.
- **`session: { strategy: "jwt" }`**: ספק Credentials עובד רק עם sessions מסוג JWT. ה-session הוא cookie מוצפן (`authjs.session-token`, httpOnly), ולכן לא צריך adapter של מסד.
- **מזהה אחיד לכל המשתמשים**: ב-callback של `jwt`, משתמש GitHub נשמר (upsert לפי `githubId`) באותו אוסף `users` שבו נשמרים משתמשי הסיסמה, ו-`token.uid` מקבל את ה-`_id` שלו במסד. כך `owner` של מתכון הוא תמיד `ObjectId` של משתמש, לא משנה איך הוא התחבר.
- **הסיסמה**: נשמר hash של bcrypt (`bcryptjs`, בלי בינארי native שצריך להתקין), והשדה `passwordHash` הוא `select: false`, כך שהוא לא נשלף בטעות. בכשל, `authorize` זורק `CredentialsSignin`, וה-action מציג "אימייל או סיסמה שגויים".
- **בדיקת בעלות בתוך השאילתה**: כל action מתחיל ב-`requireUserId()`, שקורא את המשתמש מה-session ולא ממה שהלקוח שלח. העדכון והמחיקה הם `findOneAndUpdate({ _id: id, owner: userId })` ו-`findOneAndDelete({ _id: id, owner: userId })`. מזהה של מתכון של מישהו אחר פשוט לא מוצא מסמך, וה-action מחזיר "אין לך הרשאה". ביצירה, `owner` נלקח מה-session.
- **הדשבורד מוגן בשרת**: `auth()` קורא cookies, ולכן הוא יושב בתוך `<Suspense>` (דרישה של `cacheComponents`). בלי session יש `redirect("/login")`. כיוון שהדף כבר התחיל לזרום, ההפניה מגיעה בתוך התשובה (`NEXT_REDIRECT;replace;/login;307` ו-`<meta http-equiv="refresh">`), והדפדפן עובר ל-`/login`.

## הדגמת התקפה: action עם מזהה של משתמש אחר

ההתקפה בודקת מה קורה כשמשתמש מחובר שולח ל-action מזהה של משאב שלא שייך לו. ב-UI זה נראה כך: ב-DevTools משנים את ה-`<input type="hidden" name="id">` בטופס המחיקה למזהה של מתכון של משתמש אחר, ולוחצים "מחיקה". ההדגמה כאן נעשתה עם `curl` מול `npm run build && npm start`:

1. נרשמו שני משתמשים, `alice` ו-`bob`, דרך `/register` (בכל אחד מהם נשמר hash שמתחיל ב-`$2b$10$`).
2. `alice` יצרה מתכון: `עוגת גבינה של אליס`, עם `_id` `6ad9fa82d774bb8d6af34e0c`. `bob` יצר מתכון משלו.
3. בדשבורד של `bob` לא מופיע המתכון של `alice`.
4. **ההתקפה**: `bob` לקח מהדשבורד שלו את השדות של טופס המחיקה (מזהה ה-action וה-`$ACTION_KEY`), והחליף רק את `id` במזהה של `alice`:

   | מה נשלח | מה חזר | מה במסד אחרי זה |
   | --- | --- | --- |
   | POST ל-`/dashboard` עם ה-cookie של `bob`, action של `deleteRecipe`, `id=6ad9fa82d774bb8d6af34e0c` | התשובה כוללת **"אין לך הרשאה למחוק את המתכון הזה"** | המתכון של `alice` קיים |
   | אותו דבר עם `updateRecipe`, `id` של `alice` ו-`title=נפרצת` | **"אין לך הרשאה לערוך את המתכון הזה"** | הכותרת עדיין `עוגת גבינה של אליס` |
   | אותה מחיקה **בלי cookie** בכלל | `500`: `requireUserId()` זרק `Unauthorized`, ולא בוצעה שום פעולה | המתכון קיים |
   | `bob` מוחק את **המתכון שלו** | "נמחק" | המתכון של `bob` נמחק |

   בלוג השרת:

   ```
   [forbidden] user 6ad9fa82d774bb8d6af34e0b tried to delete recipe 6ad9fa82d774bb8d6af34e0c
   [forbidden] user 6ad9fa82d774bb8d6af34e0b tried to update recipe 6ad9fa82d774bb8d6af34e0c
   ⨯ Error: Unauthorized
   ```

המסקנה: מזהה ה-action, השדות המוסתרים וה-`id` נמצאים כולם בידי הלקוח, ואפשר לזייף אותם. מה שאי אפשר לזייף זה ה-session המוצפן, ולכן הבעלות נבדקת מול `session.user.id` בכל action.
