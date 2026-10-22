import { before, beforeEach, after } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// one in-memory MongoDB per test file, emptied before every test
export function useMemoryDb() {
  const db = {};
  before(async () => {
    db.server = await MongoMemoryServer.create({ instance: { launchTimeout: 60_000 } });
    db.uri = db.server.getUri();
    await mongoose.connect(db.uri);
    await mongoose.syncIndexes();
  });
  beforeEach(async () => {
    for (const collection of Object.values(mongoose.connection.collections)) {
      await collection.deleteMany({});
    }
  });
  after(async () => {
    await mongoose.disconnect();
    await db.server.stop();
  });
  return db;
}
