const winston = require("winston");
const path = require("path");

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log line format
const logFormat = printf(({ level, message, timestamp, requestId, ip, ...meta }) => {
  const reqPart = requestId ? ` [${requestId}]` : "";
  const ipPart  = ip        ? ` [${ip}]`        : "";
  const metaPart = Object.keys(meta).length
    ? " " + JSON.stringify(meta)
    : "";
  return `${timestamp}${reqPart}${ipPart} [${level.toUpperCase()}] ${message}${metaPart}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",

  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),

  transports: [
    // ── Console ────────────────────────────────────────────────────────
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: "HH:mm:ss" }),
        logFormat
      ),
    }),

    // ── All logs ───────────────────────────────────────────────────────
    new winston.transports.File({
      filename : path.join("logs", "app.log"),
      maxsize  : 5 * 1024 * 1024, // 5 MB per file
      maxFiles : 5,                // keep last 5 rotated files
      tailable : true,
    }),

    // ── Errors only ────────────────────────────────────────────────────
    new winston.transports.File({
      filename : path.join("logs", "error.log"),
      level    : "error",
      maxsize  : 5 * 1024 * 1024,
      maxFiles : 3,
    }),
  ],
});

module.exports = logger;
