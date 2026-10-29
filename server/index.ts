import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import path from "path";
import { chatRouter } from "./routes/chat";

// Load environment variables (.env.local or .env)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Basic security & CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin rewrites)
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        FRONTEND_URL,
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://travelwithtariq.pk",
      ];
      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for development ease
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Payload size limit
app.use(express.json({ limit: "100kb" }));

// Rate limiting: 40 requests per 1-minute window
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please wait a minute before sending another message.",
    code: "RATE_LIMIT_EXCEEDED",
  },
});
app.use("/api/chat", limiter);

// Request timeout middleware (45s)
app.use((req, res, next) => {
  res.setTimeout(45000, () => {
    if (!res.headersSent) {
      res.status(504).json({
        success: false,
        error: "Request timed out waiting for AI response.",
        code: "GATEWAY_TIMEOUT",
      });
    }
  });
  next();
});

// Operational request logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  const apiKeyPresent = Boolean(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
  res.status(200).json({
    status: "healthy",
    service: "Venture Pakistan AI Backend",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    aiConfigured: apiKeyPresent,
    model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
  });
});

// Mount chat route
app.use("/api/chat", chatRouter);

// 404 fallback
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.originalUrl}' not found.`,
    code: "NOT_FOUND",
  });
});

// Start listening
const server = app.listen(PORT, () => {
  const apiKeyPresent = Boolean(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
  console.log(`=======================================================`);
  console.log(`✓ Venture Pakistan AI Chat Server listening on port ${PORT}`);
  console.log(`✓ Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`✓ Chat endpoint:   http://localhost:${PORT}/api/chat`);
  console.log(`✓ AI Key status:   ${apiKeyPresent ? "Configured" : "MISSING (Set GEMINI_API_KEY)"}`);
  console.log(`=======================================================`);
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => process.exit(0));
});

export default app;
