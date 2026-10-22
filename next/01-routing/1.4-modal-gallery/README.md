# תרגיל 1.4 · גלריה עם modal

גלריה שבה לחיצה על תמונה פותחת modal (Parallel Route בשם `@modal` + Intercepting Route בשם `(.)photo/[id]`), וכניסה ישירה ל-`/photo/<id>` מציגה דף מלא. כל דפי התמונות נבנים מראש עם `generateStaticParams`.

## הרצה

```bash
npm install
npm run dev
```

לבדיקת הבנייה המוקדמת:

```bash
npm run build && npm start
```

בפלט ה-build מופיעים `/photo/1`, `/photo/2` ועוד 7 נתיבים, וב-`.next/server/app/photo/` יש קובץ HTML לכל אחת מ-9 התמונות.

התמונות מגיעות מ-picsum.photos (מוגדר ב-`images.remotePatterns` ב-`next.config.ts`), ולכן צריך חיבור לאינטרנט.

## משתני סביבה

אין.

## החלטות מרכזיות

- המבנה:
  ```
  app/
    layout.tsx              ← מקבל children וגם modal
    page.tsx                ← הגלריה
    photo/[id]/page.tsx     ← הדף המלא (כניסה ישירה / רענון)
    @modal/default.tsx      ← null: כשאין modal פעיל
    @modal/(.)photo/[id]/page.tsx ← אותה תמונה בתוך modal (ניווט מתוך האתר)
  ```
- `@modal` הוא slot ולא סגמנט, ולכן הוא לא משפיע על הכתובת. ה-layout מקבל אותו כ-prop בשם `modal` ומרנדר אותו לצד `children`.
- `(.)photo` "מיירט" את `/photo/[id]` רק בניווט צד-לקוח (לחיצה על `<Link>`). ברענון או בכניסה ישירה אין יירוט, ומוצג `photo/[id]/page.tsx` הרגיל.
- `default.tsx` שמחזיר `null` חובה: בטעינה מלאה Next לא יודע מה היה ב-slot, ובלי `default` הוא מחזיר 404.
- הסגירה היא `router.back()`, ולכן גם כפתור Back בדפדפן סוגר את ה-modal: ה-modal הוא רשומה בהיסטוריה ולא state מקומי.
- רק `Modal` (העטיפה עם הלחיצות) הוא Client Component. תוכן התמונה (`PhotoView`) נשאר Server Component ומשותף לשני הדפים.
- `generateStaticParams` מוגדר גם בדף המלא וגם בדף ה-modal, כדי ששניהם ייבנו מראש לכל התמונות.
