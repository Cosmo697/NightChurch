import { MongoClient } from 'mongodb';

// Check if MongoDB connection string is defined
if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'NCDB';

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // This prevents reconnecting on every API call during hot reloading
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;

// Helper function to get the subscribers collection
export async function getSubscribersCollection() {
  const client = await clientPromise;
  const db = client.db(dbName);
  return db.collection('subscribers');
}