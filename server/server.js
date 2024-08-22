const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const IndexRoute = require("./routes/index");
const connectDatabase = require("./Config/Database");
// Load environment variables
dotenv.config(); 

// Connect to the database
connectDatabase();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
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
