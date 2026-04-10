// api/app.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import inquiryRoute from "./routes/inquiry.route.js";
import bookingRoute from "./routes/booking.route.js";
import aiRoute from "./routes/ai.route.js";

const app = express();

app.set("trust proxy", 1);

// Basic security & parsing middleware

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("combined"));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
});

// Rate limiting for auth-heavy endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// CORS
const parseOrigins = (value) =>
  String(value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const allowedOrigins = [
  "http://localhost:5173",
  "https://real-estate-frontend-neon-chi.vercel.app",
  "https://real-estate-frontend-git-main-contactfcityonline-7758s-projects.vercel.app",
  "https://fcityonline-real-estate.vercel.app",
  ...parseOrigins(process.env.CLIENT_URL),
  ...parseOrigins(process.env.FRONTEND_URL),
].filter(Boolean);

const uniqueAllowedOrigins = [...new Set(allowedOrigins)];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || uniqueAllowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("CORS not allowed"));
//       }
//     },
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin || 
        origin.includes("vercel.app") ||  // ✅ allows all Vercel previews
        uniqueAllowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// Health check endpoints (NOT rate-limited for monitoring services)
app.get("/", (req, res) => {
  res.status(200).json({ 
    status: "ok",
    service: "real-estate-backend",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Apply global rate limiting to all routes (excluding health endpoints already defined)
app.use(globalLimiter);

// Routes
app.use("/api/auth", authLimiter, authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api/inquiries", inquiryRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/ai", aiRoute);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
});

// Start server
const PORT = process.env.PORT || 8800;

app.listen(PORT, () =>
  console.log(`API running on port ${PORT} 🚀`)
);
