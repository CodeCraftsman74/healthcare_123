import { MongoClient } from 'mongodb';

// Get MongoDB URI from env or fallback to localhost
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/medilearn';

// MongoDB connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

let client;
let clientPromise;

// Track connection attempts
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;

// Function to create a connection with retry logic
async function connectWithRetry() {
  try {
    connectionAttempts++;
    console.log(`MongoDB connection attempt ${connectionAttempts}...`);
    const newClient = new MongoClient(uri, options);
    await newClient.connect();
    console.log("MongoDB connected successfully!");
    return newClient; // Return the connected client, not another promise
  } catch (e) {
    console.error(`MongoDB connection error (attempt ${connectionAttempts}):`, e);
    if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
      console.log(`Retrying connection in 2 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return connectWithRetry();
    }
    console.error('Max connection attempts reached - failing MongoDB connection');
    throw e;
  }
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = connectWithRetry();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = connectWithRetry();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise; 