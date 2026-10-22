# תרגיל 7.1 · בסיס SEO

אתר מתכונים קטן עם שלושה דפים (`/`, `/recipes`, `/about`), עם `metadata` ב-layout ובכל דף, favicon משלו ופונט Rubik דרך `next/font`.

## הרצה

```bash
npm install
npm run dev          # http://localhost:3000
# או במצב production:
npm run build && npm start
```

## משתני סביבה

אין.

## החלטות מרכזיות

- **title template ב-layout:** `title: { template: "%s | המטבח של דנה", default: "המטבח של דנה" }`. כל דף מגדיר רק `title: "מתכונים"`, והלשונית מציגה `מתכונים | המטבח של דנה`. בדף הבית, שלא מגדיר כותרת, מוצג ה-`default`.
- **description:** מוגדר ב-layout ומשמש כברירת מחדל. `/recipes` דורס אותו בתיאור משלו, ו-`/about` יורש אותו. ב-View Source מופיע `<meta name="description">`.
- **favicon:** הקובץ `app/icon.svg` הוא file convention, ו-Next מוסיף לבד `<link rel="icon">`. את `favicon.ico` של התבנית מחקנו, כדי שלא יהיו שני אייקונים.
- **פונט בלי קפיצת טקסט:** `next/font/google` מוריד את Rubik ב-build ומגיש אותו מהשרת שלנו, בלי בקשה ל-Google בזמן ריצה. הוא גם מייצר fallback בשם `Rubik Fallback` עם `size-adjust` ו-`ascent-override`, כך שהטקסט תופס את אותו מקום לפני ואחרי שהפונט נטען.
- **צריך לחבר את הפונט ל-CSS:** בתבנית של create-next-app, `globals.css` קובע `font-family: Arial` על `body`. החלפנו אותו ב-`var(--font-sans)`, שמצביע על המשתנה `--font-rubik`. בלי השינוי הזה הפונט נטען אבל לא מוצג.
- `lang="he"` ו-`dir="rtl"` על `<html>`: חשוב לנגישות ול-SEO.

## מה נבדק

- כותרות הלשוניות (מתוך `npm start` ו-curl): `המטבח של דנה`, `מתכונים | המטבח של דנה`, `אודות | המטבח של דנה`.
- `<meta name="description">` ו-`<link rel="icon" href="/icon.svg?...">` מופיעים בכל הדפים.
- Lighthouse על `/` (Chromium headless, מקומית): **CLS = 0**, SEO = 100.
