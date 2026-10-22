# תרגיל 6.2 · MongoDB בתוך Next

CRUD מלא של מתכונים מתוך Next: Mongoose עם חיבור שנשמר במשתנה גלובלי (`lib/db.ts`), וכל הפעולות דרך Server Actions. המודל זהה למודל של תרגיל Node 4.3.

## הרצה

```bash
docker run -d --name mongo -p 27017:27017 mongo:8   # אם אין MongoDB מקומי
npm install
cp .env.example .env.local
npm run dev
```

- `/`: טופס הוספה ורשימת המתכונים, עם כפתור מחיקה וקישור לעריכה בכל מתכון.
- `/recipes/<id>/edit`: טופס עריכה. השמירה מפנה חזרה לרשימה.

## משתני סביבה

| משתנה | משמעות | דוגמה |
| --- | --- | --- |
| `MONGODB_URI` | כתובת החיבור ל-MongoDB | `mongodb://127.0.0.1:27017/recipes` |

## החלטות מרכזיות

- **החיבור נשמר על `globalThis`**: ב-`npm run dev`, כל שמירה של קובץ טוענת מחדש את המודולים, ומשתנה רגיל ברמת המודול מתאפס. אז נפתח חיבור חדש בכל שמירה. `globalThis` שורד את הטעינה מחדש, ולכן הודעת `MongoDB connected` מופיעה פעם אחת (בבדיקה: הודעה אחת גם אחרי שתי שמירות של קובץ). שומרים את ה-promise ולא את החיבור עצמו, כך ששתי בקשות במקביל מחכות לאותו חיבור.
- **`mongoose.models.Recipe || mongoose.model(...)`**: מאותה סיבה. רישום מודל פעם שנייה זורק `OverwriteModelError`.
- **הוולידציה נשארת במודל**: `title` של 2 תווים, `prepMinutes: 0` או `difficulty` לא מוכר נדחים על ידי Mongoose. ה-action תופס `ValidationError` ומחזיר הודעה לכל שדה דרך `useActionState`. בעדכון חייבים `runValidators: true`, אחרת `findByIdAndUpdate` לא מריץ את הוולידציה.
- **`await connection()` לפני כל קריאה מהמסד**: הרשימה משתנה כל הזמן, ולכן היא נקראת בזמן הבקשה ויושבת בתוך `<Suspense>`. `connection()` עוצר את ה-prerender לפני הגישה למסד, ולכן `npm run build` עובר גם בלי MongoDB רץ.
- **המרה לאובייקט פשוט (`toView`)**: מסמך Mongoose, ו-`ObjectId` בפרט, לא עובר כ-prop לקומפוננטת לקוח. `lean()` עם המרה של `_id` למחרוזת מחזיר בדיוק את מה שהממשק צריך.
- **אחרי כל שינוי, `revalidatePath("/")`**: הרשימה מתעדכנת באותה תשובה של ה-action.
