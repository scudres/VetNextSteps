"use strict";

/**
 * Netlify Function — POST /.netlify/functions/csp-report
 *
 * Receives Content Security Policy violation reports from browsers and logs
 * them to Netlify's function log stream (visible in the Netlify dashboard
 * under Functions → csp-report → Log).
 *
 * Handles both report formats:
 *   • report-uri  (all browsers) — Content-Type: application/csp-report
 *   • Reporting API / report-to  (Chrome 96+) — Content-Type: application/reports+json
 */

const { makeRateLimiter } = require("./lib/rateLimit");

// 30 reports per minute per IP — prevents log-flooding abuse
const checkRate = makeRateLimiter(30, 60_000);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "" };
  }

  const ip =
    event.headers["x-nf-client-connection-ip"] ||
    (event.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    "unknown";

  if (!checkRate(ip)) {
    return { statusCode: 429, body: "" };
  }

  try {
    const raw = JSON.parse(event.body || "{}");

    // Reporting API sends an array; report-uri sends a single object
    const reports = Array.isArray(raw) ? raw : [raw];

    for (const report of reports) {
      // report-uri format: { "csp-report": { ... } }
      // Reporting API format: { "type": "csp-violation", "body": { ... } }
      const v = report["csp-report"] ?? report.body ?? report;

      console.log(
        JSON.stringify({
          type: "csp-violation",
          blockedUri: v["blocked-uri"] ?? v.blockedURL ?? null,
          violatedDirective: v["violated-directive"] ?? v.effectiveDirective ?? null,
          documentUri: v["document-uri"] ?? v.documentURL ?? null,
          sourceFile: v["source-file"] ?? v.sourceFile ?? null,
          lineNumber: v["line-number"] ?? v.lineNumber ?? null,
          referrer: v.referrer ?? null,
          disposition: v.disposition ?? null,
        })
      );
    }
  } catch {
    // Log the raw body on parse failure so malformed reports don't vanish silently
    console.warn("csp-report: malformed body:", (event.body ?? "").slice(0, 300));
  }

  return { statusCode: 204, body: "" };
};
