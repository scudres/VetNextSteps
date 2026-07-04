"use strict";

/**
 * Returns a per-IP rate-check function.
 *
 * State lives in the Lambda container — adequate for abuse prevention.
 * Multiple cold-start containers each enforce their own limits independently.
 *
 * Memory is bounded by sweepThreshold: when the map reaches that many distinct
 * IPs, all expired entries are removed in one pass before the next new entry
 * is added. Long-lived containers therefore converge toward only live entries.
 *
 * @param {number} maxRequests           Requests allowed per window
 * @param {number} windowMs              Window length in milliseconds
 * @param {object} [opts]
 * @param {number} [opts.sweepThreshold] Map size that triggers a sweep (default 5000)
 * @returns {(ip: string) => boolean}    true = allowed, false = rate-limited
 */
function makeRateLimiter(maxRequests, windowMs, { sweepThreshold = 5000 } = {}) {
  const map = new Map();

  function sweep() {
    const now = Date.now();
    for (const [key, entry] of map) {
      if (now - entry.start >= windowMs) map.delete(key);
    }
  }

  return function check(ip) {
    const now = Date.now();
    const entry = map.get(ip);

    if (!entry) {
      // New IP — sweep stale records before growing the map further
      if (map.size >= sweepThreshold) sweep();
      map.set(ip, { start: now, count: 1 });
      return true;
    }

    if (now - entry.start >= windowMs) {
      // Known IP, window expired — reset in place; map size is unchanged
      entry.start = now;
      entry.count = 1;
      return true;
    }

    // Within window
    if (entry.count >= maxRequests) return false;
    entry.count++;
    return true;
  };
}

module.exports = { makeRateLimiter };
