"use strict";

/**
 * Returns a per-IP rate-check function.
 * State lives in the Lambda container — adequate for abuse prevention.
 * Multiple cold-start containers each enforce their own limits independently.
 */
function makeRateLimiter(maxRequests, windowMs) {
  const map = new Map();
  return function check(ip) {
    const now = Date.now();
    const entry = map.get(ip);
    if (!entry || now - entry.start >= windowMs) {
      map.set(ip, { start: now, count: 1 });
      return true;
    }
    if (entry.count >= maxRequests) return false;
    entry.count++;
    return true;
  };
}

module.exports = { makeRateLimiter };
