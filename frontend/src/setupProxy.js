/**
 * Create React App dev-server proxy.
 *
 * Routes /.netlify/functions/* to the real Netlify Function handlers so dev
 * behaviour exactly matches production. No data or logic is duplicated here.
 */

const conferencesHandler = require("../../functions/conferences").handler;
const providersHandler   = require("../../functions/providers").handler;
const searchHandler      = require("../../functions/search").handler;

const DEV_ORIGIN = "http://localhost:3000";

/** Builds a minimal Netlify-style event object for GET requests. */
function getEvent(queryStringParameters = {}) {
  return {
    httpMethod: "GET",
    headers: { origin: DEV_ORIGIN },
    queryStringParameters,
    body: null,
  };
}

/** Invokes a function handler and pipes its response back to Express. */
async function invoke(handler, event, res) {
  try {
    const result = await handler(event);
    res.status(result.statusCode);
    for (const [key, value] of Object.entries(result.headers || {})) {
      res.set(key, value);
    }
    res.send(result.body);
  } catch (err) {
    console.error("[dev proxy] Handler error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = function (app) {
  app.get("/.netlify/functions/conferences", (req, res) =>
    invoke(conferencesHandler, getEvent(), res)
  );

  app.get("/.netlify/functions/providers", (req, res) =>
    invoke(providersHandler, getEvent(), res)
  );

  app.get("/.netlify/functions/search", (req, res) =>
    invoke(searchHandler, getEvent({ q: req.query.q || "" }), res)
  );

  // Contact form stub — returns success without sending email in dev.
  app.post("/.netlify/functions/contact", (req, res) => {
    console.log("[dev] Contact form submission (email not sent locally):", req.body);
    res.json({ success: true });
  });
};
