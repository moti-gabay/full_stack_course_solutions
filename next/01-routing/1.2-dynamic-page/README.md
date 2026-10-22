# תרגיל 1.2 · דף דינמי

דף מתכון ב-`/recipes/[slug]` מתוך מערך מקומי (`lib/recipes.ts`), עם `await params` ו-`notFound()` ל-slug שלא קיים.

## הרצה

```bash
npm install
npm run dev
```

- `/recipes/shakshuka`, `/recipes/pasta`, `/recipes/chocolate-cake`: מתכונים קיימים.
- `/recipes/nope`: דף 404.

## משתני סביבה

אין.

## החלטות מרכזיות

- `params` הוא Promise ב-Next 16, ולכן הדף הוא `async` ו-`const { slug } = await params`. הטיפוס `PageProps<"/recipes/[slug]">` נוצר אוטומטית מהנתיב.
- `notFound()` זורק, ולכן אחרי `if (!recipe) notFound()` ה-TypeScript כבר יודע ש-`recipe` קיים.
- `generateStaticParams` בונה מראש את שלושת המתכונים (מסומנים ○ בפלט ה-build). slug אחר מרונדר בזמן בקשה ומגיע ל-`notFound()`.
- הנתונים בקובץ נפרד ב-`lib/`, ולא בתוך הדף: גם רשימת המתכונים בדף הבית וגם דף המתכון קוראים מאותו מקור.
- שימו לב: `/recipes/nope` מציג את דף ה-404, אבל הסטטוס הוא 200. ה-slug לא נבנה מראש, אז התשובה מתחילה להיות מוזרמת לפני ש-`notFound()` רץ. Next מוסיף `<meta name="robots" content="noindex">` כדי שמנועי חיפוש לא יאנדקסו את הדף. כש-Cache Components מופעל אין `dynamicParams`. אם צריך סטטוס 404 אמיתי, בודקים את ה-slug ב-`proxy.ts`, לפני שהדף מתחיל להתרנדר.
