"use strict";

const ALLOWED_ORIGINS = new Set([
  "https://vetnextstep.com",
  "https://www.vetnextstep.com",
  "http://localhost:3000",
  "http://localhost:3001",
]);

/**
 * Returns CORS headers for a given request origin.
 * Always includes Vary: Origin so CDN caches are keyed per-origin,
 * preventing a cached response for one origin being served to another.
 */
function corsHeaders(origin, methods = "GET, OPTIONS") {
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://vetnextstep.com";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

/** Returns a 204 preflight response. */
function preflight(origin, methods) {
  return { statusCode: 204, headers: corsHeaders(origin, methods), body: "" };
}

module.exports = { corsHeaders, preflight };
