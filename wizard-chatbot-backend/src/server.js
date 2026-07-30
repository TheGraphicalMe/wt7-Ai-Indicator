require("dotenv").config();

const app    = require("./app");
const logger = require("./utils/logger");

// ── Environment validation ─────────────────────────────────────────────────
// Fail fast and loudly rather than starting with a broken config.
const REQUIRED_ENV = ["ANTHROPIC_API_KEY"];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);

if (missing.length > 0) {
  logger.error(`Missing required environment variables: ${missing.join(", ")}`);
  logger.error("Add them to your .env file and restart the server.");
  process.exit(1);
}

const PORT = parseInt(process.env.PORT) || 8000;

// ── Start server ───────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  logger.info("─────────────────────────────────────────");
  logger.info("  WizardTrader Chatbot API — started");
  logger.info("─────────────────────────────────────────");
  logger.info(`  Port        : ${PORT}`);
  logger.info(`  Environment : ${process.env.NODE_ENV || "development"}`);
  logger.info(`  Health      : http://localhost:${PORT}/health`);
  logger.info(`  Chat        : POST http://localhost:${PORT}/chat`);
  logger.info("─────────────────────────────────────────");
});

// ── Graceful shutdown ──────────────────────────────────────────────────────
// Allow in-flight requests to finish before closing the process.
// Railway and most PaaS providers send SIGTERM before killing the container.
function shutdown(signal) {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(() => {
    logger.info("Server closed. Exiting.");
    process.exit(0);
  });

  // Force exit after 10 s if something is keeping the event loop alive
  setTimeout(() => {
    logger.error("Graceful shutdown timed out — forcing exit");
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT",  () => shutdown("SIGINT"));

// ── Safety nets ────────────────────────────────────────────────────────────
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", { reason: String(reason) });
  // Do not crash in production — log and continue
});

process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception", { error: err.message, stack: err.stack });
  // Uncaught exceptions leave the process in an undefined state — exit
  process.exit(1);
});

// Force restart 2
