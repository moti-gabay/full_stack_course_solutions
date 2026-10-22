# תרגיל 4.2 · שאילתות ב-mongosh: פקודות ותוצאות

זה קובץ ההגשה. כל פקודה מופיעה כפי שמקלידים אותה ב-mongosh, ואחריה התוצאה שהתקבלה בהרצה אמיתית מול MongoDB 7. ערכי ה-`ObjectId` יהיו אחרים אצלכם.

את כל הפקודות אפשר להריץ ברצף מתוך [`queries.js`](queries.js). בסקריפט כל פקודה עטופה ב-`printjson(...)` עם `.toArray()`, כי מחוץ ל-shell האינטראקטיבי תוצאות לא מודפסות אוטומטית.

```bash
mongosh "mongodb://127.0.0.1:27017/library" --quiet queries.js
```

## 1. insertMany: הוספת 5 ספרים

```js
db.books.insertMany([
  { title: "1984", author: "George Orwell", year: 1949, pages: 328, tags: ["dystopia"] },
  { title: "Animal Farm", author: "George Orwell", year: 1945, pages: 112, tags: ["satire"] },
  { title: "Dune", author: "Frank Herbert", year: 1965, pages: 412, tags: ["sci-fi"] },
  { title: "Clean Code", author: "Robert C. Martin", year: 2008, pages: 464, tags: ["programming"] },
  { title: "The Pragmatic Programmer", author: "Andy Hunt", year: 2019, pages: 352, tags: ["programming"] },
])
```

```js
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6ad9f4892f89596f1c9df8a3'),
    '1': ObjectId('6ad9f4892f89596f1c9df8a4'),
    '2': ObjectId('6ad9f4892f89596f1c9df8a5'),
    '3': ObjectId('6ad9f4892f89596f1c9df8a6'),
    '4': ObjectId('6ad9f4892f89596f1c9df8a7')
  }
}
```

## 2. find עם סינון: הספרים של George Orwell

```js
db.books.find({ author: "George Orwell" })
```

```js
[
  {
    _id: ObjectId('6ad9f4892f89596f1c9df8a3'),
    title: '1984',
    author: 'George Orwell',
    year: 1949,
    pages: 328,
    tags: [
      'dystopia'
    ]
  },
  {
    _id: ObjectId('6ad9f4892f89596f1c9df8a4'),
    title: 'Animal Farm',
    author: 'George Orwell',
    year: 1945,
    pages: 112,
    tags: [
      'satire'
    ]
  }
]
```

## 3. find עם $gt: ספרים שיצאו אחרי 2000

```js
db.books.find({ year: { $gt: 2000 } })
```

```js
[
  {
    _id: ObjectId('6ad9f4892f89596f1c9df8a6'),
    title: 'Clean Code',
    author: 'Robert C. Martin',
    year: 2008,
    pages: 464,
    tags: [
      'programming'
    ]
  },
  {
    _id: ObjectId('6ad9f4892f89596f1c9df8a7'),
    title: 'The Pragmatic Programmer',
    author: 'Andy Hunt',
    year: 2019,
    pages: 352,
    tags: [
      'programming'
    ]
  }
]
```

## 4. sort: מהחדש לישן

```js
db.books.find().sort({ year: -1 })
```

```js
[
  {
    _id: ObjectId('6ad9f4892f89596f1c9df8a7'),
    title: 'The Pragmatic Programmer',
    author: 'Andy Hunt',
    year: 2019,
    pages: 352,
    tags: [
      'programming'
    ]
  },
  {
    _id: ObjectId('6ad9f4892f89596f1c9df8a6'),
    title: 'Clean Code',
    author: 'Robert C. Martin',
    year: 2008,
    pages: 464,
    tags: [
      'programming'
    ]
  },
  {
    _id: ObjectId('6ad9f4892f89596f1c9df8a5'),
    title: 'Dune',
    author: 'Frank Herbert',
    year: 1965,
    pages: 412,
    tags: [
      'sci-fi'
    ]
  },
  {
    _id: ObjectId('6ad9f4892f89596f1c9df8a3'),
    title: '1984',
    author: 'George Orwell',
    year: 1949,
    pages: 328,
    tags: [
      'dystopia'
    ]
  },
  {
    _id: ObjectId('6ad9f4892f89596f1c9df8a4'),
    title: 'Animal Farm',
    author: 'George Orwell',
    year: 1945,
    pages: 112,
    tags: [
      'satire'
    ]
  }
]
```

## 5. limit: 2 הספרים הארוכים ביותר

```js
db.books.find().sort({ pages: -1 }).limit(2)
```

```js
[
  {
    _id: ObjectId('6ad9f4892f89596f1c9df8a6'),
    title: 'Clean Code',
    author: 'Robert C. Martin',
    year: 2008,
    pages: 464,
    tags: [
      'programming'
    ]
  },
  {
    _id: ObjectId('6ad9f4892f89596f1c9df8a5'),
    title: 'Dune',
    author: 'Frank Herbert',
    year: 1965,
    pages: 412,
    tags: [
      'sci-fi'
    ]
  }
]
```

## 6. updateOne: סימון 1984 כלא במלאי

```js
db.books.updateOne({ title: "1984" }, { $set: { inStock: false } })
```

```js
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```

## 7. $push למערך: הוספת תגית ל-Dune

```js
db.books.updateOne({ title: "Dune" }, { $push: { tags: "classic" } })
db.books.findOne({ title: "Dune" }).tags
```

```js
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
[
  'sci-fi',
  'classic'
]
```

## 8. deleteOne: מחיקת Animal Farm

```js
db.books.deleteOne({ title: "Animal Farm" })
```

```js
{
  acknowledged: true,
  deletedCount: 1
}
```

## 9. countDocuments: הוכנסו 5 ונמחק 1, ולכן 4

```js
db.books.countDocuments()
```

```js
4
```

## 10. find עם projection: רק title ו-author

```js
db.books.find({}, { _id: 0, title: 1, author: 1 })
```

```js
[
  {
    title: '1984',
    author: 'George Orwell'
  },
  {
    title: 'Dune',
    author: 'Frank Herbert'
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin'
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andy Hunt'
  }
]
```
