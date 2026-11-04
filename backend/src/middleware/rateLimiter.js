/**
 * Lightweight, zero-dependency in-memory sliding window rate limiter
 * Protects auth, public search, and sensitive endpoints against brute-force and DoS.
 */

const hitMap = new Map();

// Periodic cleanup of expired rate limit windows every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of hitMap.entries()) {
    if (now > record.resetTime) {
      hitMap.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS).unref(); // .unref() so it does not block Node process termination in tests

/**
 * Creates an Express rate limiting middleware.
 * @param {Object} options
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 minutes)
 * @param {number} options.max - Max allowed requests per IP within the window
 * @param {string} [options.message] - Custom error message
 * @param {string} [options.prefix] - Prefix key to distinguish endpoints
 */
export function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000;
  const max = options.max || 100;
  const message = options.message || "Too many requests. Please try again later.";
  const prefix = options.prefix || "rl";

  return function rateLimitMiddleware(req, res, next) {
    // In test environment, allow bypassing rate limiter with header or if explicitly enabled
    if (process.env.NODE_ENV === "test" && !req.headers["x-test-rate-limit"]) {
      return next();
    }

    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    const key = `${prefix}:${ip}`;
    const now = Date.now();

    let record = hitMap.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs
      };
      hitMap.set(key, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, max - record.count);
    const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      res.setHeader("Retry-After", retryAfterSeconds);
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds
      });
    }

    next();
  };
}

export function resetRateLimitStore() {
  hitMap.clear();
}

