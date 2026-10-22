# תרגיל 2.4 · Context בלי לשבור את השרת

עגלת קניות ומצב כהה, כל אחד ב-Context Provider של לקוח, שעוטפים ב-`app/layout.tsx` את כל הדפים. הדפים עצמם (`app/page.tsx`, `app/cart/page.tsx`) וה-header נשארים Server Components. רק העלים הקטנים שצריכים את ה-state מסומנים `"use client"`. העגלה והמצב הכהה נשמרים ב-localStorage, בלי שגיאות hydration.

## הרצה

```bash
npm install
npm run dev
```

להשוואת גודל ה-bundle:

```bash
npm run build && npm start
```

## משתני סביבה

אין.

## מבנה

| קובץ | סוג | למה |
| --- | --- | --- |
| `app/layout.tsx` | Server | עוטף את `children` ב-`ThemeProvider` וב-`CartProvider` |
| `app/page.tsx`, `app/cart/page.tsx` | Server | רשימת המוצרים והסל. הנתונים מ-`lib/products.ts` לא נשלחים כקוד לדפדפן |
| `app/components/header.tsx` | Server | קישורים וטקסט סטטי |
| `app/providers/cart-provider.tsx`, `theme-provider.tsx` | Client | Context + `useSyncExternalStore` מול localStorage |
| `add-to-cart-button.tsx`, `cart-badge.tsx`, `theme-toggle.tsx`, `cart-items.tsx` | Client | העלים היחידים שקוראים ל-`useCart`/`useTheme` |

## החלטות מרכזיות

- **Provider של לקוח יכול לעטוף Server Components.** `children` מגיע ל-Provider כתוצאה שכבר רונדרה בשרת, ולא כקוד. לכן `"use client"` ב-Provider לא הופך את הדפים לרכיבי לקוח. מה שקובע הוא מי **מייבא** את מי, לא מי עוטף את מי.
- **localStorage בלי hydration mismatch:** בשרת אין localStorage. לכן הקריאה עוברת דרך `useSyncExternalStore` עם `getServerSnapshot` שמחזיר ערך ברירת מחדל (עגלה ריקה, מצב בהיר). ב-hydration ‏React משתמש בערך של השרת, כך שה-HTML תואם, ומיד אחרי זה עובר לערך השמור. אין `useEffect` + `setState`, ואין אזהרה בקונסול (נבדק ב-dev, עם עגלה מלאה ומצב כהה שמורים, אחרי רענון).
- **המצב הכהה** מופעל עם המחלקה `dark` על `<html>` (ב-`useEffect`, אחרי ה-hydration) ועם `@custom-variant dark` ב-`globals.css`. המחיר: הבזק קצר של מצב בהיר בטעינה. כדי למנוע אותו צריך סקריפט inline שרץ לפני ה-hydration, וזה מחוץ להיקף התרגיל.
- `cartStore` שומר את הערך האחרון לפי המחרוזת הגולמית, כדי ש-`getSnapshot` יחזיר את אותו אובייקט כשהנתונים לא השתנו. אחרת React נכנס ללולאת רינדור.

## השוואת גודל ה-bundle (נמדד בפועל)

**לפני:** `"use client"` בראש `app/page.tsx`, `app/cart/page.tsx` ו-`header.tsx`, וכל הלוגיקה בתוכם.
**אחרי:** הקוד שבתיקייה הזו, עם `"use client"` רק בעלים.

איך נמדד: `npm run build && npm start`, ואז סקריפט קטן שמוריד את ה-HTML של כל דף, אוסף את כל ה-`<script src>`, ומסכם את הגודל של כל chunk (גולמי ו-gzip). השוואתי chunk-chunk בין שתי הגרסאות.

| מה | לפני | אחרי | שינוי |
| --- | --- | --- | --- |
| chunk ייחודי לדף `/` | 1,340 B ‏(784 B gzip) | 391 B ‏(328 B gzip) | ‎-71%‎ |
| chunk ייחודי לדף `/cart` | 1,379 B ‏(816 B gzip) | 792 B ‏(518 B gzip) | ‎-43%‎ |
| chunk משותף של layout ו-providers | 23,977 B ‏(7,269 B gzip) | 23,733 B ‏(7,150 B gzip) | ‎-1%‎ |
| **סה"כ JS שהדף `/` טוען** | 567.8 KB ‏(175.7 KB gzip) | 566.7 KB ‏(175.1 KB gzip) | ‎-1.1 KB‎ |

מה רואים:

- הקוד **של הדפים עצמם** ירד ב-43%–71%. אחרי השינוי, הנתונים של המוצרים, הכותרות והתיאורים מגיעים כ-HTML ולא כ-JavaScript. בדף `/` נשאר רק הכפתור.
- בסך הכל ירד רק קילובייט אחד, כי רוב ה-567 KB הם React ו-Next עצמם, שנטענים בכל מקרה. באפליקציה קטנה החיסכון קטן. החיסכון גדל ככל שיש יותר תוכן וספריות בצד השרת (למשל markdown, תאריכים, אייקונים): בגרסת ה"לפני" כל אלה נשלחים לדפדפן, ובגרסת ה"אחרי" לא.
