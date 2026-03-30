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

app.use(globalLimiter);

// Rate limiting for auth-heavy endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authLimiter, authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api/inquiries", inquiryRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/ai", aiRoute);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

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
