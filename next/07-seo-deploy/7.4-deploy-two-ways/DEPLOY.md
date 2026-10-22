# רשימת בדיקות לפני פריסה

## קוד

- [ ] `npm run lint` עובר בלי שגיאות.
- [ ] `npm run build` עובר **בלי** `MONGODB_URI` בסביבה. אם לא, משהו ניגש למסד בזמן build.
- [ ] בפלט ה-build, הנתיבים מסומנים כמו שציפינו: `/` הוא `◐` ולא נכשל על גישה למסד.
- [ ] `npm run build && node .next/standalone/server.js` (אחרי העתקת `public` ו-`.next/static`) עובד מקומית.

## סודות ומשתני סביבה

- [ ] אין `.env` ב-Git (`git status` ו-`git ls-files | grep .env` מציגים רק `.env.example`).
- [ ] `.env.example` מעודכן, עם כל המשתנים ובלי ערכים אמיתיים.
- [ ] `MONGODB_URI` מוגדר ב-Vercel (Settings ← Environment Variables) לסביבת Production.
- [ ] אין סודות במשתנים שמתחילים ב-`NEXT_PUBLIC_` (הם נכנסים לקוד שנשלח לדפדפן).

## מסד הנתונים (Atlas)

- [ ] יש משתמש DB ייעודי לאפליקציה, עם סיסמה חזקה והרשאות רק למסד שלה.
- [ ] ב-Network Access מוגדרת גישה מ-Vercel (`0.0.0.0/0` בתוכנית החינמית).
- [ ] ב-connection string מופיע שם המסד, כך שלא כותבים בטעות ל-`test`.
- [ ] יש נתונים במסד (seed הורץ מול Atlas).

## Docker

- [ ] `docker build -t ex-7-4-deploy-two-ways .` עובר.
- [ ] `docker run --rm --network host --env-file .env ex-7-4-deploy-two-ways` עולה, והדף מציג נתונים.
- [ ] CSS ו-JS נטענים (בקשות ל-`/_next/static/...` מחזירות 200).
- [ ] `.env` לא נמצא בתוך ה-image (`docker run --rm ex-7-4-deploy-two-ways ls -a` לא מציג אותו).

## אחרי הפריסה

- [ ] הכתובת החיה ב-Vercel נפתחת ומציגה את המתכונים מ-Atlas.
- [ ] אין שגיאות ב-Vercel ← Logs.
- [ ] בדיקה במצב גלישה פרטית, כדי לא לראות גרסה שמורה ב-cache.
