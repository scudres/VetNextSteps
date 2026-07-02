"use strict";
const { allowedOrigins, corsHeaders } = require("./lib/cors");
const { ukPrograms, usaCertCategories, australiaPrograms, newZealandPrograms } = require("./data/certificates");

exports.handler = async (event) => {
  const origin = event.headers && (event.headers.origin || event.headers.Origin);
  const headers = {
    ...corsHeaders(origin, allowedOrigins),
    "Content-Type": "application/json",
    "Cache-Control": "private, max-age=3600",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      uk: ukPrograms,
      usa: usaCertCategories,
      australia: australiaPrograms,
      newZealand: newZealandPrograms,
    }),
  };
};
