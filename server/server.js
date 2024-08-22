const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const connectDatabase = require("./Config/Database");
const IndexRoute = require("./routes/index");

// Load environment variables
dotenv.config(); 

// Connect to the database
connectDatabase();

const app = express();

// Middleware for parsing JSON
app.use(express.json());

// CORS headers configuration (place this before your routes)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Define routes
app.use("/", IndexRoute);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;

// Test route
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.error(`Logged Error: ${err.message}`);
    server.close(() => process.exit(1));
});
