import mongoose from "mongoose";

// שומרים את ה-promise של החיבור במשתנה גלובלי, כדי שכל בקשה (וכל HMR בפיתוח)
// תשתמש באותו חיבור ולא תפתח חיבור חדש.
const globalForMongoose = globalThis as unknown as {
  mongoosePromise?: Promise<typeof mongoose>;
};

export function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  globalForMongoose.mongoosePromise ??= mongoose.connect(uri);
  return globalForMongoose.mongoosePromise;
}
