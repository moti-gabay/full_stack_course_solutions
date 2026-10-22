# תרגיל 1.1 · שלושה דפים וניווט

שלושה דפים (`/`, `/recipes`, `/about`), תפריט משותף ב-`layout.tsx` עם `<Link>`, והדגשה של הקישור הפעיל עם `usePathname`.

## הרצה

```bash
npm install
npm run dev
```

פותחים את http://localhost:3000 ועוברים בין הדפים בתפריט.

## משתני סביבה

אין.

## החלטות מרכזיות

- כל דף הוא תיקייה עם `page.tsx`: ‏`app/recipes/page.tsx` הוא `/recipes`. אין קובץ הגדרות ניתוב.
- התפריט נמצא ב-`app/layout.tsx`, ולכן הוא מופיע בכל הדפים ולא מתרנדר מחדש במעבר ביניהם.
- `<Link>` מבצע ניווט בצד הלקוח: אין בקשת document חדשה בלשונית Network, רק בקשת RSC קטנה.
- `usePathname` הוא hook, ולכן רק רכיב התפריט (`app/components/nav.tsx`) מסומן `"use client"`. ה-layout והדפים נשארים Server Components.
- ההדגשה משתמשת גם ב-`aria-current="page"`, כך שהיא נגישה ולא רק צבע.
