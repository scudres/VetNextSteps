"use strict";

const { cpdProviders } = require("./data/providers");
const { corsHeaders, preflight } = require("./lib/cors");

// Serialise once at module load.
const BODY = JSON.stringify(cpdProviders);

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
      "Cache-Control": "public, max-age=3600",
    },
    body: BODY,
  };
};
