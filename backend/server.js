const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const gestureRoutes = require('./gesture'); // Ensure this matches your gesture.js
const connectDB = require('./db'); // Ensure this matches your db.js

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable if available

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
connectDB(); // Establish MongoDB connection

// API Routes
app.use('/api/gesture', gestureRoutes); // Use the updated gesture routes

// Test Route
app.get('/', (req, res) => {
  res.send('Hello, Gesture Control API!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
