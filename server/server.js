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
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow specific dynamic origins
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }

    // Block any other origins
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
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
