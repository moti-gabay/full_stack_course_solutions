# תרגיל 2.2 · לפרק דף מוצר

דף מוצר שהוא Server Component (`app/page.tsx`), וכפתור "הוסף לסל" עם מונה כ-Client Component קטן (`app/components/add-to-cart-button.tsx`).

## הרצה

```bash
npm install
npm run dev
```

בדיקה שרק הכפתור מסומן:

```bash
grep -r "use client" app
# app/components/add-to-cart-button.tsx:"use client";
```

## משתני סביבה

אין.

## החלטות מרכזיות

- ה-state (`useState`) וה-`onClick` נמצאים רק בכפתור, ולכן רק הוא צריך `"use client"`. בקובץ הדף אין hooks ואין event handlers.
- `"use client"` מסמן גבול: הקובץ וכל מה שהוא מייבא נכנסים ל-bundle של הדפדפן. כשהגבול נמצא בעלה הכי קטן, הכותרת, התיאור והמחיר נשלחים כ-HTML בלבד, בלי JavaScript.
- הדף מייבא את הכפתור ומרנדר אותו כרגיל. Server Component יכול לרנדר Client Component (ההפך לא, אלא רק דרך `children` או props).
- הדף סטטי (`○` בפלט ה-build): אין בו נתוני runtime, ולכן הוא נבנה פעם אחת. הכפתור עובר hydration בדפדפן ומתחיל לעבוד.
