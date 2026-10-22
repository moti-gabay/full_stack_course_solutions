# תרגיל 6.3 · proxy

`proxy.ts` (ב-Next 16 זה השם החדש של `middleware.ts`) שמפנה מ-`/dashboard` ל-`/login` כשאין cookie של session, ומפנה לשפה (`/he` או `/en`) לפי cookie או לפי `Accept-Language`. ה-matcher לא נוגע בקבצים סטטיים.

## הרצה

```bash
npm install
npm run dev
```

- `/login`: כפתור שיוצר cookie בשם `session` (התחברות מדומה) ומפנה לדשבורד. בדשבורד יש כפתור התנתקות שמוחק אותו.
- שפה: ה-proxy בודק קודם cookie בשם `NEXT_LOCALE` (`he` או `en`), אחר כך את `Accept-Language`, וברירת המחדל היא עברית.
- כל בקשה שעוברת ב-proxy מודפסת בטרמינל כ-`[proxy] GET /path`.

## משתני סביבה

אין.

## בדיקה (במצב production, עם `curl`)

| בקשה | תוצאה |
| --- | --- |
| `/dashboard` בלי cookie | `307` ל-`/he/login` |
| `/en/dashboard` בלי cookie | `307` ל-`/en/login` |
| `/he/dashboard` עם `session` | `200` |
| `/` עם `Accept-Language: en-US,en;q=0.9` | `307` ל-`/en` |
| `/` עם `Accept-Language: fr-FR,fr;q=0.9,en;q=0.8` | `307` ל-`/en` (השפה הנתמכת הראשונה) |
| `/` עם cookie `NEXT_LOCALE=en` ו-`Accept-Language: he` | `307` ל-`/en`: ה-cookie קודם ל-header |
| `/` בלי כלום | `307` ל-`/he` |
| `/_next/static/...css` ו-`/favicon.ico` | `200`, **בלי** שורת `[proxy]` בלוג |

## החלטות מרכזיות

- **ה-matcher עם negative lookahead**: `/((?!_next/static|_next/image|favicon.ico|.*\.(?:png|jpg|...)$).*)`. בלי matcher, ה-proxy רץ על כל בקשה, כולל קובצי JS, CSS ותמונות. הפניה לשפה הייתה שוברת אותם, ובכל מקרה זו עבודה מיותרת לכל קובץ.
- **הבדיקה ב-proxy היא אופטימית**: היא בודקת רק שקיים cookie בשם `session`, בלי לאמת אותו. ה-proxy רץ לפני כל בקשה ונועד להפניות מהירות. בדיקת הרשאה אמיתית (האם ה-session תקף ושל מי הוא) שייכת לשכבת הנתונים ול-Server Actions, כמו בתרגיל 6.4.
- **קודם הרשאה, אחר כך שפה**: `/dashboard` בלי cookie מפנה ישר ל-`/he/login` בהפניה אחת, ולא בשתיים (`/he/dashboard` ואז `/he/login`).
- **`app/[lang]` עם `generateStaticParams`**: ה-layout של `[lang]` הוא ה-root layout, וקובע `lang` ו-`dir` לפי השפה. כל הדפים נבנים מראש לשתי השפות (בפלט ה-build מופיעים `/he/...` ו-`/en/...`), ושפה לא מוכרת מגיעה ל-`notFound()`.
- **התחברות והתנתקות כ-Server Actions שמגדירים cookie**: `cookies().set` בתוך action. ה-cookie הוא `httpOnly`, כך ש-JavaScript בדפדפן לא יכול לקרוא אותו.
