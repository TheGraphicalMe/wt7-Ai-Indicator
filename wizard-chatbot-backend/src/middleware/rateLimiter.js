const rateLimit = require("express-rate-limit");
const slowDown  = require("express-slow-down");
const logger    = require("../utils/logger");

const WINDOW_MS         = parseInt(process.env.RATE_LIMIT_WINDOW_MS)   || 15 * 60 * 1000;
const MAX_REQUESTS      = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 30;
const DELAY_AFTER       = parseInt(process.env.SLOW_DOWN_DELAY_AFTER)   || 10;
const DELAY_MS_PER_HIT  = parseInt(process.env.SLOW_DOWN_DELAY_MS)      || 500;

// ── Layer 1: Slow-down ─────────────────────────────────────────────────────
// After DELAY_AFTER requests in the window each subsequent request gets
// DELAY_MS_PER_HIT extra milliseconds of wait time.
// This makes automated flood attacks progressively slower before they hit
// the hard block, without immediately punishing real users.
const speedLimiter = slowDown({
  windowMs   : WINDOW_MS,
  delayAfter : DELAY_AFTER,
  delayMs    : (used, req) => (used - req.slowDown.limit) * DELAY_MS_PER_HIT,
  validate   : { delayMs: false }, // suppress the config warning
});

// ── Layer 2: Hard rate limit ───────────────────────────────────────────────
// After MAX_REQUESTS in the window the IP is fully blocked until the window
// resets. Standard RateLimit-* headers are returned so legitimate clients
// can back off gracefully.
const hardLimiter = rateLimit({
  windowMs        : WINDOW_MS,
  max             : MAX_REQUESTS,
  standardHeaders : true,
  legacyHeaders   : false,

  // Derive a consistent key even behind Railway / Nginx / Cloudflare
  keyGenerator: (req) =>
    req.ip ||
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "unknown",

  handler: (req, res) => {
    const ip = req.ip || req.headers["x-forwarded-for"];
    logger.warn("Rate limit exceeded", {
      ip,
      requestId : req.requestId,
      path      : req.path,
      userAgent : req.headers["user-agent"],
    });
    res.status(429).json({
      error      : "Too many requests. Please wait a few minutes and try again.",
      retryAfter : Math.ceil(WINDOW_MS / 1000),
    });
  },

  // Health-check endpoint must never be rate-limited (monitoring tools need it)
  skip: (req) => req.path === "/health",
});

module.exports = { speedLimiter, hardLimiter };
