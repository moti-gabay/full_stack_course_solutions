// in-memory "database" shared by all routers
export const db = {
  books: [],
  members: [],
  loans: [],
};

const counters = { books: 0, members: 0, loans: 0 };

export function insert(collection, data) {
  const doc = { id: ++counters[collection], ...data };
  db[collection].push(doc);
  return doc;
}

export function findById(collection, id) {
  return db[collection].find((doc) => doc.id === Number(id));
}

export function activeLoanOf(bookId) {
  return db.loans.find((loan) => loan.bookId === bookId && loan.returnedAt === null);
}
