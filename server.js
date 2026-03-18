import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import historyRoutes from "./routes/history.js";
import faceRoutes from "./routes/face.js";
import uploadRoutes from './routes/upload.js';
import testCloudinaryRoutes from "./routes/test-cloudinary.js";

dotenv.config();
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// Health check endpoint for Render
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy", 
    service: "node-api",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "Skincare Analyzer API is running!",
    environment: process.env.NODE_ENV || "development"
  });
});

// Routes
app.use("/auth", authRoutes);
app.use("/api", chatRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/face", faceRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/test', testCloudinaryRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => {
  console.error("❌ MongoDB error:", err);
  process.exit(1); // Exit if database fails to connect
});

// Use PORT from environment (Render sets this) or fallback to 10000
const PORT = process.env.PORT || 10000;

// Important: Bind to 0.0.0.0 to accept external connections
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Health check: http://0.0.0.0:${PORT}/health`);
});