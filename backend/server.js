const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const examRoutes = require("./routes/exams");
const attemptRoutes = require("./routes/attempts");
const miscRoutes = require("./routes/misc");
const { scheduleDailyRunner } = require("./scheduler/promotion");

dotenv.config();

const app = express();

// Connect DB
connectDB();


// ✅ CORS CONFIGURATION (FIXED)

// Add your frontend URL(s) here
const allowedOrigins = [
  "https://proctered-testing.vercel.app",
];

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests without origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// ✅ Handle preflight requests (IMPORTANT FIX)
app.options("*", cors());


// Middleware
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api", miscRoutes);


// Scheduler
scheduleDailyRunner();


// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});


// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: err.message || "Something went wrong!" });
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
