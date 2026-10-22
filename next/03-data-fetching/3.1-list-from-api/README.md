# תרגיל 3.1 · רשימה מ-API

דף `async` שמושך 10 פוסטים מ-[JSONPlaceholder](https://jsonplaceholder.typicode.com) בשרת ומציג אותם, בלי `useEffect` ובלי `"use client"`.

## הרצה

```bash
npm install
npm run dev          # http://localhost:3000
# או במצב production:
npm run build && npm start
```

בדיקה: `curl -s localhost:3000 | grep "sunt aut facere"` מוצא את כותרת הפוסט הראשון בתוך ה-HTML עצמו.

## משתני סביבה

אין.

## החלטות מרכזיות

- **הקומפוננטה של הדף היא `async` ועושה `await getPosts()`**. ההבאה רצה בשרת, ולכן הפוסטים כבר נמצאים ב-HTML ש-View Source מציג. אין צורך ב-state, ב-loading או ב-`useEffect`.
- **שכבת נתונים נפרדת ב-`lib/posts.ts`**. הדף רק מציג, והפונקציה אחראית על ה-fetch ועל בדיקת `res.ok`. תשובה שגויה זורקת שגיאה, ולא מציגה רשימה ריקה בשקט.
- **`"use cache"` עם `cacheLife("hours")` על `getPosts`**. בפרויקט שבו `cacheComponents: true`, ‏fetch שלא שמור ב-cache חייב להיות בתוך `<Suspense>`, אחרת ה-build נכשל עם שגיאת blocking route. הפוסטים לא תלויים בבקשה, ולכן שמרנו אותם ב-cache. כך הדף כולו נבנה מראש (`○` בפלט ה-build, עם Revalidate של שעה).
- הטקסט של ה-API באנגלית, ולכן הפריטים מסומנים `dir="ltr"` בתוך דף RTL.
