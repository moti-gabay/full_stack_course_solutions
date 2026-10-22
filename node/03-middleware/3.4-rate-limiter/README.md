# תרגיל 3.4 · Rate limiter בלי ספרייה

## הרצה

```bash
npm install
cp .env.example .env
npm run dev
for i in $(seq 11); do curl -s -o /dev/null -w "%{http_code}\n" localhost:3000/; done   # 10x200 ואז 429
curl -i localhost:3000/        # Retry-After ו-X-Request-Id ב-headers
curl localhost:3000/crash      # אותו requestId בתשובה ובהדפסת השגיאה בטרמינל
npm test
```

## משתני סביבה

| משתנה | משמעות | דוגמה |
| --- | --- | --- |
| `PORT` | הפורט שהשרת מאזין בו | `3000` |

## החלטות מרכזיות

- **Fixed window**: לכל IP יש רשומה `{ count, resetAt }` ב-`Map`. כשהחלון נגמר, הרשומה מתאפסת. זה פשוט יותר מ-sliding window, במחיר של אפשרות ל-burst של עד 20 בקשות סביב גבול החלון.
- `Retry-After` הוא מספר השניות עד `resetAt`, מעוגל למעלה, כך שהלקוח יודע בדיוק מתי לנסות שוב.
- **ניקוי**: `setInterval` מוחק רשומות שהחלון שלהן נגמר, כדי שה-`Map` לא יגדל עם כל IP שאי פעם פנה לשרת. `unref()` מאפשר לתהליך להיסגר למרות הטיימר.
- `rateLimit({ windowMs, max })` היא factory, ולכן אפשר להגדיר אותה בבדיקות עם חלון של 300ms בלי לחכות דקה. גם `createApp` הוא factory, כך שכל בדיקה מתחילה עם מונים נקיים.
- **הסדר**: `requestId` רץ ראשון, כדי שכל מה שאחריו (logger, rate limiter, error handler) ישתמש באותו `req.id`. גם תשובת 429 מקבלת מזהה ומופיעה בלוג.
- **מגבלות**: המונים נשמרים בזיכרון של תהליך אחד. מאחורי load balancer עם כמה שרתים צריך store משותף כמו Redis. מאחורי proxy צריך `app.set("trust proxy", ...)`, אחרת `req.ip` יהיה ה-IP של ה-proxy.
