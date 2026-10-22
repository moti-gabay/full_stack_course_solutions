# תרגיל 7.3 · SEO מלא

אתר מתכונים מתוך מערך מקומי (`lib/recipes.ts`), עם `generateMetadata` לכל דף מתכון, תמונת OG דינמית לכל מתכון, ו-`sitemap.xml` ו-`robots.txt` שנוצרים מקוד.

## הרצה

```bash
npm install
cp .env.example .env
npm run build && npm start   # http://localhost:3000
```

## משתני סביבה

| משתנה | דוגמה | למה |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://my-recipes.vercel.app` | הכתובת המלאה של האתר. משמשת ב-`metadataBase`, ב-sitemap וב-robots. בלי המשתנה: `http://localhost:3000`. |

משתנה עם `NEXT_PUBLIC_` נכנס לקוד בזמן `build`. אם משנים אותו, צריך לבנות מחדש.

## החלטות מרכזיות

- **`generateMetadata` מאותם נתונים:** הדף ו-`generateMetadata` קוראים שניהם ל-`getRecipe(slug)`. כל מתכון מקבל `title`, `description`, `canonical` ו-`openGraph` משלו, וה-title template מה-layout מוסיף ` | Home Kitchen`.
- **`metadataBase` ב-layout:** WhatsApp ופייסבוק דורשים כתובת מלאה ל-`og:image`. עם `metadataBase`, נתיבים יחסיים הופכים לכתובות מלאות לפי `NEXT_PUBLIC_SITE_URL`.
- **`opengraph-image.tsx` בתוך `recipes/[slug]`:** מקבל `params` (Promise, צריך `await`) ומצייר עם `ImageResponse` את שם המתכון וזמן ההכנה. Next מוסיף לבד את `og:image`, `og:image:width/height/type`.
- **`generateStaticParams` גם בקובץ התמונה:** בלעדיו ה-build סימן את `/recipes/[slug]/opengraph-image` כ-`ƒ` (נוצר בכל בקשה). איתו כל תמונה נבנית מראש (`●`). כשהתמונות נבנו מראש, ה-build גם תפס באג: div עם `{minutes} minutes` מייצר שני צמתי טקסט, ו-Satori (המנוע של `ImageResponse`) דורש `display: flex` במקרה כזה. פתרנו עם template string.
- **תוכן באנגלית:** ל-Satori אין תמיכה ב-RTL. טקסט עברי בתמונת ה-OG היה יוצא הפוך, ובפונט ברירת המחדל גם בלי גליפים עבריים. בגלל זה תוכן האתר באנגלית ו-`lang="en"`.
- **`sitemap.ts` ו-`robots.ts`** מחזירים אובייקטים מוקלדים (`MetadataRoute.Sitemap` / `MetadataRoute.Robots`), ו-Next מייצר מהם XML וטקסט. ה-sitemap בנוי מאותו מערך, כך שמתכון חדש נכנס אליו אוטומטית.

## מה נבדק

- **meta לכל מתכון** (curl על `/recipes/shakshuka`): `<title>Shakshuka | Home Kitchen</title>`, `description`, `canonical`, `og:title`, `og:description`, `og:image` (כתובת מלאה), `og:image:width=1200`, `og:image:height=630`.
- **תמונת OG:** `/recipes/shakshuka/opengraph-image` מחזיר `200 image/png` עם שם המתכון וזמן ההכנה.
- **`/sitemap.xml`** כולל את דף הבית ואת שלושת המתכונים, ו-`/robots.txt` מחזיר `Allow: /` עם כתובת ה-sitemap.
- **Lighthouse SEO** (Lighthouse 12 מקומית, Chromium headless): **100** ב-`/` ו-**100** ב-`/recipes/shakshuka`.
- מתכון שלא קיים מציג 404 עם `<meta name="robots" content="noindex">`. סטטוס ה-HTTP הוא 200, כי עם Partial Prerender ה-shell כבר נשלח לפני ש-`notFound()` נקרא. ה-`noindex` הוא מה שמונע ממנועי חיפוש לאנדקס את הדף.

## בדיקה ידנית: תצוגה מקדימה ב-WhatsApp

את זה אי אפשר לבדוק מ-localhost, כי WhatsApp צריך להוריד את הדף ואת התמונה מכתובת ציבורית.

1. פורסים (למשל ל-Vercel, ראו תרגיל 7.4) ומגדירים `NEXT_PUBLIC_SITE_URL` לכתובת החיה **לפני** ה-build.
2. בודקים את הכתובת ב-[opengraph.xyz](https://www.opengraph.xyz) או ב-Facebook Sharing Debugger.
3. שולחים לעצמכם ב-WhatsApp קישור ל-`/recipes/shakshuka`, ומוודאים שמופיעים התמונה הכתומה, הכותרת והתיאור.

WhatsApp שומר תצוגות מקדימות ב-cache. אם שיניתם משהו, אפשר להוסיף לקישור `?v=2` לבדיקה.
