import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connects to MongoDB with connection pooling.
 * Uses global cache in development to prevent multiple connections during hot reload.
 * Throws on connection failure so callers can return fallback data.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).catch((err) => {
      cached.promise = null; // allow retry later
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

/** Check if an error is a MongoDB connection failure (e.g. MongoDB not running). */
export function isMongoConnectionError(err: unknown): boolean {
  const name = err && typeof err === 'object' && 'name' in err ? (err as { name: string }).name : '';
  const message = err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : '';
  return name === 'MongooseServerSelectionError' || message.includes('ECONNREFUSED');
}
