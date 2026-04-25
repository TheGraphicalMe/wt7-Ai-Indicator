const logger = require("../utils/logger");

const MAX_MESSAGE_LENGTH  = parseInt(process.env.MAX_MESSAGE_LENGTH)  || 1000;
const MAX_HISTORY_MESSAGES = parseInt(process.env.MAX_HISTORY_MESSAGES) || 10;

// ── Prompt-injection patterns ──────────────────────────────────────────────
// These patterns catch the most common attempts to override the system prompt
// or make the model behave outside its defined scope.
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+|previous\s+|above\s+|prior\s+)?instructions/i,
  /you\s+are\s+now/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /act\s+as\s+(a\s+|an\s+)?(different|new|unrestricted)/i,
  /forget\s+(your|all)\s+(instructions|rules|guidelines)/i,
  /override\s+(your|all)\s+(instructions|rules)/i,
  /jailbreak/i,
  /developer\s+mode/i,
  /\bDAN\s+mode\b/i,
  /do\s+anything\s+now/i,
  /\bsystem\s+prompt\b/i,
  /reveal\s+your\s+instructions/i,
  /print\s+your\s+(system|initial)\s+prompt/i,
  /what\s+(are\s+)?your\s+instructions/i,
  /repeat\s+(everything|all)\s+(above|before)/i,
];

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Strip null bytes and non-printable control characters from a string.
 * Keeps normal whitespace (\t \n \r) intact.
 */
function sanitise(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/\0/g, "")                       // null bytes
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // other control chars
    .trim();
}

function hasInjection(text) {
  return INJECTION_PATTERNS.some((re) => re.test(text));
}

// ── Main validation middleware ─────────────────────────────────────────────
function validateMessage(req, res, next) {
  const { message, history } = req.body;
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";

  // ── message ──────────────────────────────────────────────────────────────
  if (message === undefined || message === null) {
    return res.status(400).json({ error: "message is required." });
  }

  if (typeof message !== "string") {
    return res.status(400).json({ error: "message must be a string." });
  }

  const cleanMessage = sanitise(message);

  if (cleanMessage.length === 0) {
    return res.status(400).json({ error: "message cannot be empty." });
  }

  if (cleanMessage.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      error     : `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.`,
      maxLength : MAX_MESSAGE_LENGTH,
    });
  }

  if (hasInjection(cleanMessage)) {
    logger.warn("Prompt injection attempt blocked", {
      ip,
      requestId : req.requestId,
      snippet   : cleanMessage.substring(0, 120),
    });
    return res.status(400).json({
      error: "Your message contains content that cannot be processed.",
    });
  }

  // ── history ───────────────────────────────────────────────────────────────
  if (history !== undefined) {
    if (!Array.isArray(history)) {
      return res.status(400).json({ error: "history must be an array." });
    }

    // Cap to prevent someone artificially inflating the context window
    if (history.length > MAX_HISTORY_MESSAGES * 2) {
      return res.status(400).json({
        error: `Too many history messages. Maximum ${MAX_HISTORY_MESSAGES} exchanges.`,
      });
    }

    for (let i = 0; i < history.length; i++) {
      const msg = history[i];

      if (typeof msg !== "object" || msg === null || Array.isArray(msg)) {
        return res.status(400).json({ error: `history[${i}] must be an object.` });
      }

      if (!["user", "assistant"].includes(msg.role)) {
        return res.status(400).json({
          error: `history[${i}].role must be "user" or "assistant".`,
        });
      }

      if (typeof msg.content !== "string") {
        return res.status(400).json({
          error: `history[${i}].content must be a string.`,
        });
      }

      // Sanitise and hard-cap each history entry
      history[i] = {
        role    : msg.role,
        content : sanitise(msg.content).substring(0, MAX_MESSAGE_LENGTH),
      };
    }
  }

  // Attach clean values so downstream handlers don't touch req.body directly
  req.cleanMessage = cleanMessage;
  req.cleanHistory = Array.isArray(history) ? history : [];

  next();
}

module.exports = { validateMessage };
