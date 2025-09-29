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
      maxPoolSize: 20, // Increased pool size for better reliability
      serverSelectionTimeoutMS: 15000, // Increased timeout for better reliability
      socketTimeoutMS: 60000, // Increased socket timeout
      family: 4, // Use IPv4, skip trying IPv6
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      heartbeatFrequencyMS: 10000, // Send a ping every 10 seconds
      connectTimeoutMS: 15000, // Connection timeout
      retryWrites: true, // Enable retryable writes
      retryReads: true, // Enable retryable reads
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
