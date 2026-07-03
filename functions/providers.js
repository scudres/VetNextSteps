"use strict";

const { cpdProviders } = require("./data/providers");
const { corsHeaders, preflight } = require("./lib/cors");
const { makeRateLimiter } = require("./lib/rateLimit");

const checkRate = makeRateLimiter(60, 60_000);

let BODY;
try {
  BODY = JSON.stringify(cpdProviders);
} catch (e) {
  console.error("providers: failed to prepare data:", e.message);
}

exports.handler = async (event) => {
  const origin  = event.headers.origin || event.headers.Origin || "";
  const headers = { ...corsHeaders(origin), "Content-Type": "application/json" };

  if (event.httpMethod === "OPTIONS") return preflight(origin);
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const ip = event.headers["x-nf-client-connection-ip"]
    || (event.headers["x-forwarded-for"] || "").split(",")[0].trim()
    || "unknown";

  if (!checkRate(ip)) {
    return {
      statusCode: 429,
      headers: { ...headers, "Retry-After": "60" },
      body: JSON.stringify({ error: "Too many requests" }),
    };
  }

  if (!BODY) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Service temporarily unavailable" }) };
  }

  return {
    statusCode: 200,
    headers: { ...headers, "Cache-Control": "private, max-age=3600" },
    body: BODY,
  };
};
