import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Ensure the MongoDB URI is available from environment variables
const uri = process.env.ATLAS_URI;

if (!uri) {
  throw new Error('MongoDB connection URI is not defined in environment variables.');
}

// Define the connect function
export default function connect() {
  // Connect to MongoDB using Mongoose
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('MongoDB connected successfully.');
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);  
    });
}

