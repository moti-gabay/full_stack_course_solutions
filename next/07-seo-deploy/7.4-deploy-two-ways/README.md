# תרגיל 7.4 · פריסה בשתי דרכים

אפליקציה קטנה שמציגה מתכונים מ-MongoDB, ופריסה שלה בשתי דרכים: ל-Vercel (עם Atlas), וכ-image של Docker עם `output: "standalone"`. רשימת הבדיקות לפני פריסה נמצאת ב-[DEPLOY.md](DEPLOY.md).

## הרצה מקומית

צריך MongoDB מקומי, למשל `docker run -d -p 27017:27017 mongo:8`.

```bash
npm install
cp .env.example .env
npm run seed                 # מכניס 3 מתכונים
npm run dev                  # http://localhost:3000
```

## משתני סביבה

| משתנה | מקומי | ב-Vercel |
| --- | --- | --- |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/fsc_next_7_4` | `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>` מ-Atlas |

ב-repo יש רק `.env.example`. הקובץ `.env` נמצא ב-`.gitignore` וגם ב-`.dockerignore`.

## דרך 1: Docker עם standalone

```bash
docker build -t ex-7-4-deploy-two-ways .
docker run --rm --network host --env-file .env ex-7-4-deploy-two-ways   # http://localhost:3000
```

**למה `--network host`:** בתוך הקונטיינר, `127.0.0.1` הוא הקונטיינר עצמו ולא המחשב שלכם. עם `--network host` הקונטיינר משתמש ברשת של המחשב, ו-`MONGODB_URI` מה-`.env` עובד כמו שהוא (ב-Linux וב-WSL). חלופה: `-p 3000:3000` וב-`.env` של הקונטיינר `MONGODB_URI=mongodb://host.docker.internal:27017/fsc_next_7_4` (ב-Linux צריך להוסיף `--add-host=host.docker.internal:host-gateway`).

**מה בדקנו:** `docker build` עבר, `docker run --network host --env-file .env` עלה, והדף הציג את המתכונים מהמסד המקומי. קובצי `/_next/static` חזרו עם 200. גודל ה-image: כ-300MB.

## דרך 2: Vercel עם MongoDB Atlas (שלבים ידניים)

את השלבים האלה עושים בדפדפן, עם החשבונות שלכם:

1. **Atlas:** יוצרים cluster חינמי (M0), ואז:
   - ב-Database Access יוצרים משתמש עם סיסמה.
   - ב-Network Access מוסיפים `0.0.0.0/0`. ל-Vercel אין כתובות IP קבועות, ולכן אין דרך אחרת בתוכנית החינמית. ההגנה היא המשתמש והסיסמה החזקה.
2. מעתיקים מ-Connect ← Drivers את ה-connection string, ומוסיפים בו את שם המסד (למשל `/recipes`).
3. מריצים seed מול Atlas מהמחשב: `MONGODB_URI="mongodb+srv://..." node scripts/seed.mjs`.
4. **Vercel:** מעלים את הפרויקט ל-GitHub, ב-Vercel לוחצים Add New ← Project ובוחרים את ה-repo. Vercel מזהה Next.js לבד.
5. ב-Settings ← Environment Variables מוסיפים `MONGODB_URI` עם הכתובת מ-Atlas, לפחות ל-Production. אם הוספתם אותו אחרי הפריסה הראשונה, עושים Redeploy.
6. פותחים את הכתובת החיה ובודקים שהמתכונים מ-Atlas מוצגים.

`output: "standalone"` לא מפריע ל-Vercel, שמתעלם ממנו ומשתמש בפורמט משלו.

## החלטות מרכזיות

- **הנתונים נקראים בזמן הבקשה (`await connection()` בתוך `<Suspense>`):** עם `cacheComponents`, Next מנסה לרנדר מראש כל מה שאפשר ב-build. בלי `connection()`, ה-build היה מנסה להתחבר למסד, ובשרת ה-build של Vercel או בתוך `docker build` אין מסד. בדרך הזאת ה-build עובר בלי `MONGODB_URI`. הנתיב `/` מסומן `◐` (Partial Prerender): הכותרת וה-fallback סטטיים, והרשימה מגיעה ב-streaming.
- **חיבור שמור ב-`globalThis`** (`lib/db.ts`): כל בקשה משתמשת באותו חיבור ולא פותחת חדש. `models.Recipe || model(...)` מונע שגיאה כשהמודל נטען פעמיים בפיתוח.
- **Dockerfile בשלושה שלבים:**
  - `deps`: מריץ `npm ci`. השלב נשמר ב-cache כל עוד `package-lock.json` לא משתנה.
  - `builder`: מריץ `next build`.
  - `runner`: מכיל רק את `.next/standalone`, ובלי `node_modules` מלא.
- **צריך להעתיק ידנית את `.next/static` ואת `public`:** standalone לא מעתיק אותם, ובלעדיהם הדף עולה בלי CSS ו-JS.
- **בתוך הקונטיינר:** `HOSTNAME=0.0.0.0`, אחרת השרת מאזין רק בתוך הקונטיינר. `USER node` כדי לא לרוץ כ-root.
- **`.env*` ב-`.dockerignore`:** סודות לא נכנסים ל-image. הם מגיעים בזמן ריצה עם `--env-file`.
