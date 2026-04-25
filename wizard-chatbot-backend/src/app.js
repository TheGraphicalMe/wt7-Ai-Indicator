require("dotenv").config();

const express = require("express");
const cors    = require("cors");

const {
  requestId,
  requestLogger,
  helmetMiddleware,
  requireJsonContentType,
} = require("./middleware/security");
const chatRouter = require("./routes/chat");
const logger     = require("./utils/logger");

const app = express();

// ── Trust proxy ────────────────────────────────────────────────────────────
// Required so req.ip returns the real client IP when the server is behind
// Railway, Nginx, or Cloudflare (all of which add X-Forwarded-For headers).
// Set to 1 if there is exactly one reverse proxy in front of this server.
app.set("trust proxy", 1);

// ── CORS ───────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // No origin = direct tool call (curl / Postman / server-to-server).
      // Allow in development; deny in production for tighter security.
      if (!origin) {
        if (process.env.NODE_ENV === "development") {
          return callback(null, true);
        }
        return callback(new Error("Origin header required in production."));
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      logger.warn("CORS blocked", { origin });
      callback(new Error(`Origin not allowed: ${origin}`));
    },
    methods        : ["GET", "POST"],
    allowedHeaders : ["Content-Type", "X-Request-Id"],
    exposedHeaders : ["X-Request-Id", "RateLimit-Limit", "RateLimit-Remaining"],
  })
);

// ── Global middleware ──────────────────────────────────────────────────────
app.use(helmetMiddleware);                    // Secure HTTP headers
app.use(requestId);                           // Unique ID on every request
app.use(requestLogger);                       // Structured request logging
app.use(express.json({ limit: "16kb" }));     // Parse JSON — hard cap body size
app.use(requireJsonContentType);              // Reject non-JSON POSTs

// ── Routes ─────────────────────────────────────────────────────────────────
app.use("/chat", chatRouter);

app.get("/health", (_req, res) => {
  res.json({
    status      : "ok",
    service     : "WizardTrader Chatbot API",
    timestamp   : new Date().toISOString(),
    environment : process.env.NODE_ENV || "development",
  });
});

// ── 404 ────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// ── Global error handler ───────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  // Surface CORS denials as 403 without leaking internals
  if (err.message && (err.message.includes("not allowed") || err.message.includes("Origin"))) {
    return res.status(403).json({ error: "Access denied." });
  }

  logger.error("Unhandled error", {
    requestId : req.requestId,
    error     : err.message,
    stack     : process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });

  res.status(500).json({ error: "Internal server error." });
});

module.exports = app;
