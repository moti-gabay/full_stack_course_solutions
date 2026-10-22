import "server-only";
import mongoose from "mongoose";

// ב-dev, כל שמירה של קובץ טוענת מחדש את המודולים, אבל globalThis נשאר.
// שומרים עליו את ה-promise של החיבור, כדי שלא ייפתח חיבור חדש בכל שמירה.
const globalForMongoose = globalThis as unknown as {
  mongooseConn?: Promise<typeof mongoose>;
};

export function connectDB() {
  if (!globalForMongoose.mongooseConn) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not set");

    globalForMongoose.mongooseConn = mongoose.connect(uri).then((m) => {
      console.log("MongoDB connected");
      return m;
    });
    // חיבור שנכשל לא נשאר שמור, כדי שהבקשה הבאה תנסה שוב
    globalForMongoose.mongooseConn.catch(() => {
      globalForMongoose.mongooseConn = undefined;
    });
  }
  return globalForMongoose.mongooseConn;
}
