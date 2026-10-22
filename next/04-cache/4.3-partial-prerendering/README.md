# תרגיל 4.3 · Partial Prerendering

דף מוצר `/products/[id]`. פרטי המוצר סטטיים, שמורים ב-cache ונבנים מראש. הרכיב "צפית לאחרונה" קורא `cookies()` בתוך `<Suspense>`, ולכן מגיע רק בזמן הבקשה.

## הרצה

```bash
npm install
npm run build && npm start   # http://localhost:3000
```

נכנסים לכמה מוצרים בזה אחר זה. בכל דף, "צפית לאחרונה" מציג את המוצרים הקודמים.

## משתני סביבה

אין.

## פלט ה-build

```
Route (app)            Revalidate  Expire
┌ ○ /                          1d      1w
├ ○ /_not-found
└   /products/[id]
  ├ ◐ /products/[id]
  ├ ◐ /products/1              1d      1w
  ├ ◐ /products/2              1d      1w
  └ ◐ [+2 more paths]

◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

כל דף מוצר מסומן `◐`: המעטפת נבנתה מראש, והחלק הדינמי מוזרם בזמן הבקשה.

## מה מגיע מיד (View Source)

ב-HTML הראשוני של `/products/2` (בדיקה עם `curl -s localhost:3000/products/2`) מופיעים:

```html
<h1 class="text-3xl font-bold">מקלדת מכנית</h1>
...
<template id="B:0"></template>
<p class="text-sm text-zinc-500">טוען את המוצרים שצפית בהם...</p>
```

- **שם, תיאור ומחיר** כבר נמצאים ב-HTML, כי הם חלק מה-static shell שנבנה ב-build.
- **במקום "צפית לאחרונה"** מופיע ה-fallback של ה-Suspense, עם placeholder ‏(`B:0`). התוכן האמיתי מגיע בהמשך אותה תשובה, בתוך chunk נוסף שמחליף את ה-placeholder.

התוכן משתנה לפי ה-cookie:

- בלי cookie: "עוד לא צפית במוצרים אחרים."
- `curl -b 'recent=1%2C3' localhost:3000/products/2`: קישורים ל"אוזניות אלחוטיות" ול"עכבר ארגונומי".

## החלטות מרכזיות

- **`generateStaticParams` עם `"use cache"` על `getProduct`**. מזהי המוצרים ידועים ב-build, ולכן Next בונה מראש את הפרטים של כל מוצר. אילו `cookies()` היה נקרא בראש הדף, כל הדף היה מחכה לבקשה.
- **`cookies()` נקרא רק בתוך `RecentlyViewed`, שעטוף ב-`<Suspense>`**. זה מה שקובע את הגבול בין החלק הסטטי לחלק הדינמי. ככל שהקריאה ל-API של זמן בקשה נמצאת עמוק יותר בעץ, החלק הסטטי גדול יותר.
- **ה-cookie נכתב בצד הלקוח**, ב-`TrackView` (קומפוננטה קטנה עם `useEffect`), כי Server Component לא יכול לכתוב cookies. זה הרכיב היחיד עם `"use client"`, והוא לא מרנדר כלום.
- **`getAllProducts` שמור גם הוא ב-cache**. כך "צפית לאחרונה" יכול להמיר מזהים לשמות בלי לחשב שוב את רשימת המוצרים בכל בקשה. החלק הדינמי היחיד הוא קריאת ה-cookie.
