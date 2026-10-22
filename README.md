# פתרונות: קורס Full-Stack ב-Node.js וב-Next.js

**repo פרטי, למרצה בלבד.** אין לקשר אליו מה-repo של הקורס, ואין להעתיק ממנו קוד לשם.

כל תיקייה כאן היא פרויקט שלם שרץ בפני עצמו. המבנה מקביל ל-branches של הקורס: `node/01-basics` כאן מתאים ל-branch `node/01-basics` שם. תרגיל ש"בונה על" תרגיל קודם מתחיל מעותק של הפתרון הקודם, כך שאפשר לפתוח כל תיקייה בלי להסתכל על אחרות.

## איך מריצים

- **Node**: בכל תיקייה, `npm install` ואחריו `npm test` (‏`node:test` ו-supertest). תרגילים עם מסד רצים בבדיקות מול `mongodb-memory-server`, כך שלא צריך Docker. להרצת השרת: `cp .env.example .env` ו-`npm run dev`.
- **MongoDB מקומי** להרצה ידנית: `docker run -d --name mongo -p 27017:27017 mongo:8`.
- **Next**: `npm install`, `npm run dev`, ובשביל cache ו-PPR: `npm run build && npm start`. כל פרויקט נוצר מ-`create-next-app` עם ברירות המחדל (TypeScript, Tailwind, App Router ו-`cacheComponents: true`) על Next 16.4.
- **סודות**: יש רק קובצי `.env.example`, עם ערכים לדוגמה. אין קובץ `.env` אמיתי ב-repo.
- בכל תיקייה יש README עם הוראות הרצה, משתני הסביבה והחלטות מרכזיות שכדאי שסטודנט יבין.

## חלק א׳: Node.js, Express ו-MongoDB

| # | תרגיל | רמה | תיקייה | בונה על | אימות |
| --- | --- | --- | --- | --- | --- |
| 1.1 | שלום Node | קל | [`node/01-basics/1.1-hello-node`](node/01-basics/1.1-hello-node/) |  | `npm test` |
| 1.2 | מודול משלכם | קל | [`node/01-basics/1.2-my-module`](node/01-basics/1.2-my-module/) |  | `npm test` |
| 1.3 | מונה מילים | בינוני | [`node/01-basics/1.3-word-counter`](node/01-basics/1.3-word-counter/) |  | `npm test` |
| 1.4 | CLI לניהול משימות | מורכב | [`node/01-basics/1.4-todo-cli`](node/01-basics/1.4-todo-cli/) |  | `npm test` |
| 2.1 | שלושה נתיבים | קל | [`node/02-express-rest/2.1-three-routes`](node/02-express-rest/2.1-three-routes/) |  | `npm test` |
| 2.2 | params ו-query | קל | [`node/02-express-rest/2.2-params-and-query`](node/02-express-rest/2.2-params-and-query/) |  | `npm test` |
| 2.3 | API מתכונים בזיכרון | בינוני | [`node/02-express-rest/2.3-recipes-api`](node/02-express-rest/2.3-recipes-api/) |  | `npm test` |
| 2.4 | API לספרייה עם השאלות | מורכב | [`node/02-express-rest/2.4-library-loans-api`](node/02-express-rest/2.4-library-loans-api/) |  | `npm test` |
| 3.1 | Logger | קל | [`node/03-middleware/3.1-logger`](node/03-middleware/3.1-logger/) |  | `npm test` |
| 3.2 | 404 ו-500 | קל | [`node/03-middleware/3.2-404-and-500`](node/03-middleware/3.2-404-and-500/) |  | `npm test` |
| 3.3 | ולידציה ומפתח API | בינוני | [`node/03-middleware/3.3-validation-and-api-key`](node/03-middleware/3.3-validation-and-api-key/) |  | `npm test` |
| 3.4 | Rate limiter בלי ספרייה | מורכב | [`node/03-middleware/3.4-rate-limiter`](node/03-middleware/3.4-rate-limiter/) |  | `npm test` |
| 4.1 | חיבור ראשון | קל | [`node/04-mongodb/4.1-first-connection`](node/04-mongodb/4.1-first-connection/) |  | `npm test` |
| 4.2 | שאילתות ב-mongosh | קל | [`node/04-mongodb/4.2-mongosh-queries`](node/04-mongodb/4.2-mongosh-queries/) |  | `npm test` |
| 4.3 | API מתכונים עם Mongoose | בינוני | [`node/04-mongodb/4.3-recipes-mongoose`](node/04-mongodb/4.3-recipes-mongoose/) | 2.3 | `npm test` |
| 4.4 | נתונים אמיתיים | מורכב | [`node/04-mongodb/4.4-real-data`](node/04-mongodb/4.4-real-data/) | 4.3 | `npm test` |
| 5.1 | סינון ומיון | קל | [`node/05-queries-relations/5.1-filter-and-sort`](node/05-queries-relations/5.1-filter-and-sort/) | 4.4 | `npm test` |
| 5.2 | עימוד וחיפוש | בינוני | [`node/05-queries-relations/5.2-pagination-and-search`](node/05-queries-relations/5.2-pagination-and-search/) | 5.1 | `npm test` |
| 5.3 | קשרים עם populate | בינוני | [`node/05-queries-relations/5.3-populate-relations`](node/05-queries-relations/5.3-populate-relations/) |  | `npm test` |
| 5.4 | סטטיסטיקות עם aggregation | מורכב | [`node/05-queries-relations/5.4-aggregation-stats`](node/05-queries-relations/5.4-aggregation-stats/) | 5.2 | `npm test` |
| 6.1 | הרשמה עם סיסמה מוצפנת | קל | [`node/06-auth/6.1-register-hashed-password`](node/06-auth/6.1-register-hashed-password/) |  | `npm test` |
| 6.2 | התחברות עם JWT | בינוני | [`node/06-auth/6.2-login-jwt`](node/06-auth/6.2-login-jwt/) | 6.1 | `npm test` |
| 6.3 | בעלות על משאב | בינוני | [`node/06-auth/6.3-resource-ownership`](node/06-auth/6.3-resource-ownership/) | 6.2 (+ מודל מ-4.3) | `npm test` |
| 6.4 | תפקידים ו-refresh token | מורכב | [`node/06-auth/6.4-roles-refresh-token`](node/06-auth/6.4-roles-refresh-token/) | 6.3 | `npm test` |

## חלק ב׳: Next.js

| # | תרגיל | רמה | תיקייה | בונה על | אימות |
| --- | --- | --- | --- | --- | --- |
| 1.1 | שלושה דפים וניווט | קל | [`next/01-routing/1.1-pages-and-nav`](next/01-routing/1.1-pages-and-nav/) |  | `npm run lint` + `npm run build` |
| 1.2 | דף דינמי | קל | [`next/01-routing/1.2-dynamic-page`](next/01-routing/1.2-dynamic-page/) |  | `npm run lint` + `npm run build` |
| 1.3 | layouts מקוננים | בינוני | [`next/01-routing/1.3-nested-layouts`](next/01-routing/1.3-nested-layouts/) |  | `npm run lint` + `npm run build` |
| 1.4 | גלריה עם modal | מורכב | [`next/01-routing/1.4-modal-gallery`](next/01-routing/1.4-modal-gallery/) |  | `npm run lint` + `npm run build` |
| 2.1 | איפה הלוג? | קל | [`next/02-server-client/2.1-where-is-the-log`](next/02-server-client/2.1-where-is-the-log/) |  | `npm run lint` + `npm run build` |
| 2.2 | לפרק דף מוצר | קל | [`next/02-server-client/2.2-split-product-page`](next/02-server-client/2.2-split-product-page/) |  | `npm run lint` + `npm run build` |
| 2.3 | חיפוש דרך ה-URL | בינוני | [`next/02-server-client/2.3-url-search`](next/02-server-client/2.3-url-search/) |  | `npm run lint` + `npm run build` |
| 2.4 | Context בלי לשבור את השרת | מורכב | [`next/02-server-client/2.4-context-without-breaking-server`](next/02-server-client/2.4-context-without-breaking-server/) |  | `npm run lint` + `npm run build` |
| 3.1 | רשימה מ-API | קל | [`next/03-data-fetching/3.1-list-from-api`](next/03-data-fetching/3.1-list-from-api/) |  | `npm run lint` + `npm run build` |
| 3.2 | שני מקורות איטיים | בינוני | [`next/03-data-fetching/3.2-two-slow-sources`](next/03-data-fetching/3.2-two-slow-sources/) |  | `npm run lint` + `npm run build` |
| 3.3 | דף פרטים מלא | בינוני | [`next/03-data-fetching/3.3-post-details-page`](next/03-data-fetching/3.3-post-details-page/) |  | `npm run lint` + `npm run build` |
| 3.4 | דשבורד עמיד | מורכב | [`next/03-data-fetching/3.4-resilient-dashboard`](next/03-data-fetching/3.4-resilient-dashboard/) |  | `npm run lint` + `npm run build` |
| 4.1 | לראות את ה-cache | קל | [`next/04-cache/4.1-see-the-cache`](next/04-cache/4.1-see-the-cache/) |  | `npm run lint` + `npm run build` |
| 4.2 | חדשות שמתעדכנות | בינוני | [`next/04-cache/4.2-updating-news`](next/04-cache/4.2-updating-news/) |  | `npm run lint` + `npm run build` |
| 4.3 | Partial Prerendering | בינוני | [`next/04-cache/4.3-partial-prerendering`](next/04-cache/4.3-partial-prerendering/) |  | `npm run lint` + `npm run build` |
| 4.4 | דוח build | מורכב | [`next/04-cache/4.4-build-report`](next/04-cache/4.4-build-report/) |  | `npm run lint` + `npm run build` |
| 5.1 | טופס ראשון | קל | [`next/05-server-actions/5.1-first-form`](next/05-server-actions/5.1-first-form/) |  | `npm run lint` + `npm run build` |
| 5.2 | ולידציה ושגיאות | בינוני | [`next/05-server-actions/5.2-validation-and-errors`](next/05-server-actions/5.2-validation-and-errors/) |  | `npm run lint` + `npm run build` |
| 5.3 | מחיקה ולייק אופטימי | בינוני | [`next/05-server-actions/5.3-delete-and-optimistic-like`](next/05-server-actions/5.3-delete-and-optimistic-like/) |  | `npm run lint` + `npm run build` |
| 5.4 | טופס רב-שלבי | מורכב | [`next/05-server-actions/5.4-multi-step-form`](next/05-server-actions/5.4-multi-step-form/) |  | `npm run lint` + `npm run build` |
| 6.1 | Route Handler | קל | [`next/06-db-api-auth/6.1-route-handler`](next/06-db-api-auth/6.1-route-handler/) |  | `npm run lint` + `npm run build` |
| 6.2 | MongoDB בתוך Next | בינוני | [`next/06-db-api-auth/6.2-mongodb-in-next`](next/06-db-api-auth/6.2-mongodb-in-next/) | מודל מ-Node 4.3 | `npm run lint` + `npm run build` |
| 6.3 | proxy | בינוני | [`next/06-db-api-auth/6.3-proxy`](next/06-db-api-auth/6.3-proxy/) |  | `npm run lint` + `npm run build` |
| 6.4 | אימות מלא | מורכב | [`next/06-db-api-auth/6.4-full-auth`](next/06-db-api-auth/6.4-full-auth/) |  | `npm run lint` + `npm run build` |
| 7.1 | בסיס SEO | קל | [`next/07-seo-deploy/7.1-seo-basics`](next/07-seo-deploy/7.1-seo-basics/) |  | `npm run lint` + `npm run build` |
| 7.2 | תמונות | קל | [`next/07-seo-deploy/7.2-images`](next/07-seo-deploy/7.2-images/) |  | `npm run lint` + `npm run build` |
| 7.3 | SEO מלא | בינוני | [`next/07-seo-deploy/7.3-full-seo`](next/07-seo-deploy/7.3-full-seo/) |  | `npm run lint` + `npm run build` |
| 7.4 | פריסה בשתי דרכים | מורכב | [`next/07-seo-deploy/7.4-deploy-two-ways`](next/07-seo-deploy/7.4-deploy-two-ways/) |  | `npm run lint` + `npm run build` |

## צעדים ידניים

שני תרגילים תלויים בשירותים חיצוניים. הקוד וההגדרות כתובים עם משתני סביבה placeholder, ובכל README יש סעיף שמסביר את הצעדים הידניים:

- [`next/06-db-api-auth/6.4-full-auth`](next/06-db-api-auth/6.4-full-auth/): יצירת GitHub OAuth App ומילוי `AUTH_GITHUB_ID` ו-`AUTH_GITHUB_SECRET`.
- [`next/07-seo-deploy/7.4-deploy-two-ways`](next/07-seo-deploy/7.4-deploy-two-ways/): פריסה ל-Vercel עם MongoDB Atlas. ה-Dockerfile נבדק מקומית.

לא כלולים כאן הפרויקטים הארוכים (`node/projects`, `next/projects`) ופרויקט הגמר (`capstone`).
