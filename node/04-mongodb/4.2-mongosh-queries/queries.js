// run with: mongosh "<MONGODB_URI>" --quiet queries.js
// start from an empty collection so the script can be run again
db.books.drop();

print("1. insertMany");
printjson(
  db.books.insertMany([
    { title: "1984", author: "George Orwell", year: 1949, pages: 328, tags: ["dystopia"] },
    { title: "Animal Farm", author: "George Orwell", year: 1945, pages: 112, tags: ["satire"] },
    { title: "Dune", author: "Frank Herbert", year: 1965, pages: 412, tags: ["sci-fi"] },
    { title: "Clean Code", author: "Robert C. Martin", year: 2008, pages: 464, tags: ["programming"] },
    { title: "The Pragmatic Programmer", author: "Andy Hunt", year: 2019, pages: 352, tags: ["programming"] },
  ])
);

print("2. find with a filter: books by George Orwell");
printjson(db.books.find({ author: "George Orwell" }).toArray());

print("3. find with $gt: books published after 2000");
printjson(db.books.find({ year: { $gt: 2000 } }).toArray());

print("4. sort: newest first");
printjson(db.books.find().sort({ year: -1 }).toArray());

print("5. limit: the 2 longest books");
printjson(db.books.find().sort({ pages: -1 }).limit(2).toArray());

print("6. updateOne: mark 1984 as out of stock");
printjson(db.books.updateOne({ title: "1984" }, { $set: { inStock: false } }));

print("7. $push to an array: add a tag to Dune");
printjson(db.books.updateOne({ title: "Dune" }, { $push: { tags: "classic" } }));
printjson(db.books.findOne({ title: "Dune" }).tags);

print("8. deleteOne: remove Animal Farm");
printjson(db.books.deleteOne({ title: "Animal Farm" }));

print("9. countDocuments: 5 inserted - 1 deleted");
printjson(db.books.countDocuments());

print("10. projection: only title and author");
printjson(db.books.find({}, { _id: 0, title: 1, author: 1 }).toArray());
