'use server'
import mongoose from 'mongoose';

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

// Define the interface for the cached mongoose connection
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Declare the global type
declare global {
    var mongoose: MongooseCache | undefined;
}

// Initialize the cache
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Add mongoose to global in development to prevent multiple connections
if (process.env.NODE_ENV === 'development') {
    global.mongoose = cached;
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectToDatabase;