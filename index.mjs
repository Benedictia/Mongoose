import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connect from './db/conn.mjs'; // Or just use mongoose if you don't need custom connect logic

dotenv.config();

const app = express(); // Create an Express app

// Ensure the MongoDB URI is available
const uri = process.env.ATLAS_URI;
if (!uri) {
  throw new Error('MongoDB connection URI is not defined in environment variables.');
}

// Connect to MongoDB using Mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected successfully.');
    connect(); // Call your custom connect function, if necessary
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

// Define a port (default is 3000)
const port = process.env.PORT || 5050;

// Set up a basic route
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
