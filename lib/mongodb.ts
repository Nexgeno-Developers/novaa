import mongoose, { Mongoose } from "mongoose";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

// Extend global type for mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache:
    | { conn: Mongoose | null; promise: Promise<Mongoose> | null }
    | undefined;
}

const globalCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = globalCache;

async function connectDB(): Promise<Mongoose> {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}

export default connectDB;