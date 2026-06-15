"use strict";

const { cpdProviders } = require("./data/providers");

const ALLOWED_ORIGINS = new Set([
  "https://vetnextstep.com",
  "https://www.vetnextstep.com",
  "http://localhost:3000",
  "http://localhost:3001",
]);

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : "https://vetnextstep.com";
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=3600",
  };
}

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || "";
  const headers = corsHeaders(origin);

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    return {
      statusCode: 200,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(cpdProviders),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
