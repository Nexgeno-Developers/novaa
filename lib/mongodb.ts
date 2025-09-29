import mongoose, { Mongoose } from "mongoose";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

// Extend global type for mongoose cache
declare global {
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
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    globalCache.promise = mongoose.connect(uri, opts).catch((err) => {
      console.error("MongoDB connection error:", err);
      globalCache.promise = null; // Reset promise on error
      throw err;
    });
  }

  try {
    globalCache.conn = await globalCache.promise;
    return globalCache.conn;
  } catch (error) {
    globalCache.promise = null; // Reset promise on error
    throw error;
  }
}

export default connectDB;
