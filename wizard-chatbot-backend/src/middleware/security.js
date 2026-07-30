const helmet = require("helmet");
const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");

// ── Request ID ─────────────────────────────────────────────────────────────
// Attach a unique UUID to every request so every log line for the same
// request can be correlated, even across async callbacks.
function requestId(req, res, next) {
  req.requestId = uuidv4();
  res.setHeader("X-Request-Id", req.requestId);
  next();
}

// ── Request logger ─────────────────────────────────────────────────────────
// Log method, path, status code and duration for every request.
// Uses the "finish" event so we get the final status code after the handler runs.
function requestLogger(req, res, next) {
  const startedAt = Date.now();
  const ip = req.ip ||
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "unknown";

  res.on("finish", () => {
    const ms    = Date.now() - startedAt;
    const level = res.statusCode >= 500 ? "error"
                : res.statusCode >= 400 ? "warn"
                : "info";

    logger[level](`${req.method} ${req.path} → ${res.statusCode} (${ms}ms)`, {
      requestId : req.requestId,
      ip,
      userAgent : req.headers["user-agent"] || "unknown",
    });
  });

  next();
}

// ── Helmet (secure HTTP headers) ───────────────────────────────────────────
// Helmet sets a suite of headers that protect against common web vulnerabilities.
// CSP and COEP are disabled here because this is a pure JSON API — they are
// only meaningful for HTML responses.
const helmetMiddleware = helmet({
  contentSecurityPolicy  : false,
  crossOriginEmbedderPolicy: false,
});

// ── Content-Type enforcement ────────────────────────────────────────────────
// Reject any POST request that is not application/json.
// This blocks form-encoded submissions, multipart uploads, and other unexpected
// content types that have no valid use against this API.
function requireJsonContentType(req, res, next) {
  if (req.method === "POST") {
    const ct = (req.headers["content-type"] || "").toLowerCase();
    if (!ct.includes("application/json")) {
      logger.warn("Rejected non-JSON POST", {
        requestId   : req.requestId,
        ip          : req.ip,
        contentType : req.headers["content-type"] || "(none)",
      });
      return res.status(415).json({
        error: "Content-Type must be application/json.",
      });
    }
  }
  next();
}

module.exports = {
  requestId,
  requestLogger,
  helmetMiddleware,
  requireJsonContentType,
};
