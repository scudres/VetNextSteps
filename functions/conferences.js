"use strict";

const { conferences } = require("./data/conferences");
const { corsHeaders, preflight } = require("./lib/cors");
const { expandMultiYearConferences } = require("./lib/expand");

// Expand once at module load — data is static, no need to recompute per request.
const EXPANDED = expandMultiYearConferences(conferences);
const BODY = JSON.stringify(EXPANDED);

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || "";

  if (event.httpMethod === "OPTIONS") return preflight(origin);
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers: corsHeaders(origin),
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json",
      "Cache-Control": "private, max-age=3600",
    },
    body: BODY,
  };
};
