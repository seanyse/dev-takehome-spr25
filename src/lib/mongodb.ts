import mongoose from 'mongoose'

const username = encodeURIComponent(process.env.USER_MONGO!);
console.log(username)
const password = encodeURIComponent(process.env.PASS!);
const cluster = process.env.CLUSTER!;
const appName = process.env.APP_NAME
const MONGODB_URL = `mongodb+srv://${username}:${password}@${cluster}/?retryWrites=true&w=majority&appName=${appName}`;

console.log(MONGODB_URL)
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null};
}
export async function mongodb() {
    if (cached.conn) return cached.conn;
  
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URL, {
        bufferCommands: false,
      }).then((mongoose) => mongoose);
    }
  
    cached.conn = await cached.promise;
    return cached.conn;
}

