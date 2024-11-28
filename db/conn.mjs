import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();
const uri = process.env.ATLAS_URI;

if (!uri) {
  throw new Error('MongoDB connection URI is not defined in environment variables.');
}

// Define the connect function
export default function connect() {
  
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

