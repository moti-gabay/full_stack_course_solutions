# תרגיל 4.2 · שאילתות ב-mongosh

קובץ ההגשה הוא [`RESULTS.md`](RESULTS.md): עשר הפקודות, ולצד כל אחת התוצאה שהתקבלה בהרצה אמיתית.

## הרצה

```bash
docker run -d --name mongo -p 27017:27017 mongo:8   # אם עוד לא רץ
mongosh "mongodb://127.0.0.1:27017/library"          # להקליד את הפקודות אחת-אחת
# או להריץ את כולן ברצף:
mongosh "mongodb://127.0.0.1:27017/library" --quiet queries.js

npm install
npm test     # מריץ את queries.js מול mongodb-memory-server ובודק את התוצאות (צריך mongosh מותקן)
```

אם mongosh לא מותקן, אפשר להשתמש בזה שבתוך הקונטיינר: `docker exec -it mongo mongosh library`.

## משתני סביבה

אין. את כתובת המסד מעבירים ל-mongosh בשורת הפקודה.

## החלטות מרכזיות

- `queries.js` מתחיל ב-`db.books.drop()`, כך שאפשר להריץ אותו שוב ושוב ולקבל את אותן תוצאות. בלי זה, `countDocuments` היה גדל בכל הרצה.
- `find` מחזיר cursor ולא מערך. ב-shell האינטראקטיבי mongosh מדפיס את 20 התוצאות הראשונות לבד, ובסקריפט צריך `.toArray()` ו-`printjson`.
- `updateOne` עם `$set` משנה רק את השדה שצוין. בלי אופרטור, MongoDB מסרב לעדכון (בניגוד ל-`replaceOne`, שמחליף את כל המסמך).
- `$push` מוסיף איבר למערך הקיים, בלי לקרוא את המסמך ולכתוב אותו מחדש.
- ב-projection, `{ _id: 0, title: 1, author: 1 }`, צריך להוציא את `_id` במפורש: הוא מוחזר תמיד אלא אם כותבים `_id: 0`.
- הבדיקה מריצה את הסקריפט האמיתי מול מסד בזיכרון ומשווה את התוצאות. כך `RESULTS.md` ו-`queries.js` לא יכולים להיפרד בלי שהבדיקות ייכשלו.
