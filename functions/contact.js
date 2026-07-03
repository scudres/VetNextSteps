"use strict";

/**
 * Netlify Function — POST /.netlify/functions/contact
 *
 * Sends contact-form submissions to hello@vetnextstep.com via IONOS SMTP.
 *
 * Required environment variables (set in Netlify dashboard → Site settings → Environment variables):
 *   SMTP_HOST   — e.g. smtp.ionos.co.uk
 *   SMTP_PORT   — 587
 *   SMTP_USER   — hello@vetnextstep.com
 *   SMTP_PASS   — your IONOS mailbox password
 */

const nodemailer = require("nodemailer");
const { corsHeaders, preflight } = require("./lib/cors");

const METHODS = "POST, OPTIONS";

// ─── IP rate limiter ──────────────────────────────────────────────────────────
// Module-level Map persists across warm invocations of the same instance.
// Netlify may run multiple instances in parallel; each limits independently,
// which is fine since Turnstile is the primary spam defence and this is the backstop.
const _rateMap = new Map(); // ip -> { count, resetAt }
const RATE_WINDOW_MS = 60 * 1000; // 1 minute window
const RATE_MAX        = 5;         // max submissions per IP per window

function checkRateLimit(ip) {
  if (!ip) return false;
  const now   = Date.now();
  const entry = _rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    _rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false; // not limited
  }
  entry.count += 1;
  return entry.count > RATE_MAX;
}

// Maximum character counts — guards against large-payload abuse.
const FIELD_LIMITS = {
  firstName: 100,
  surname:   100,
  email:     254,  // RFC 5321 maximum email address length
  subject:   300,
  message:   5000,
};

/** Escapes all five HTML special characters to prevent email-body injection. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Nodemailer transporter — cached across warm Lambda invocations.
 * Created lazily so that missing env vars are caught at send time, not at cold start.
 */
let _transporter = null;
function getTransporter() {
  if (_transporter) return _transporter;
  _transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   parseInt(process.env.SMTP_PORT, 10),
    secure: false, // STARTTLS on port 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return _transporter;
}

async function verifyTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false; // Fail closed — missing secret must not allow bypass
  if (!token) return false;
  try {
    const params = new URLSearchParams({ secret, response: token });
    if (ip) params.set("remoteip", ip);
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const data = await r.json();
    return data.success === true;
  } catch {
    return false;
  }
}

exports.handler = async (event) => {
  const origin  = event.headers.origin || "";
  const headers = corsHeaders(origin, METHODS);

  if (event.httpMethod === "OPTIONS") return preflight(origin, METHODS);
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  // Rate limiting — x-nf-client-connection-ip is Netlify-injected and cannot be spoofed;
  // fall back to x-forwarded-for only in local dev where the Netlify CDN is not present.
  const ip = event.headers["x-nf-client-connection-ip"]
    || (event.headers["x-forwarded-for"] || "").split(",")[0].trim();
  if (checkRateLimit(ip)) {
    return {
      statusCode: 429,
      headers: { ...headers, "Retry-After": "60" },
      body: JSON.stringify({ error: "Too many requests. Please wait a minute before trying again." }),
    };
  }

  // Reject non-JSON content types before attempting to parse
  const contentType = (event.headers["content-type"] || "").split(";")[0].trim();
  if (contentType !== "application/json") {
    return { statusCode: 415, headers, body: JSON.stringify({ error: "Content-Type must be application/json" }) };
  }

  // Parse body
  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  // Honeypot — bots fill hidden fields; real users don't. Silent 200 so bots don't retry.
  if (body.website) {
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  // Turnstile verification — use the CDN-injected header (unspoofable) for remoteip hint
  const turnstileIp = event.headers["x-nf-client-connection-ip"]
    || (event.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const turnstileOk = await verifyTurnstile(body.cfToken, turnstileIp);
  if (!turnstileOk) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Bot check failed. Please reload and try again." }) };
  }

  const { firstName, surname, email, subject, message } = body;

  // Presence check
  if (!firstName || !surname || !email || !subject || !message) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "All fields are required." }) };
  }

  // Type check — all fields must be strings
  if ([firstName, surname, email, subject, message].some((v) => typeof v !== "string")) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid field types." }) };
  }

  // Length limits
  for (const [field, limit] of Object.entries(FIELD_LIMITS)) {
    if ((body[field] || "").length > limit) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: `${field} exceeds maximum allowed length.` }) };
    }
  }

  // Email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Please enter a valid email address." }) };
  }

  // SMTP config guard
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.error("SMTP environment variables are not fully configured.");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Email service is not configured. Please contact hello@vetnextstep.com directly." }),
    };
  }

  // Trim all inputs then HTML-escape for the email body.
  const t = {
    firstName: firstName.trim(),
    surname:   surname.trim(),
    email:     email.trim(),
    subject:   subject.trim(),
    message:   message.trim(),
  };
  const safe = {
    firstName: escapeHtml(t.firstName),
    surname:   escapeHtml(t.surname),
    email:     escapeHtml(t.email),
    // Strip newlines from subject to prevent email header injection.
    subject:   escapeHtml(t.subject.replace(/[\r\n]+/g, " ")),
    message:   escapeHtml(t.message),
  };

  try {
    await getTransporter().sendMail({
      from:    `"VetNextStep Contact Form" <${SMTP_USER}>`,
      to:      CONTACT_EMAIL || "hello@vetnextstep.com",
      replyTo: `"${t.firstName} ${t.surname}" <${t.email}>`,
      subject: `[Contact Form] ${t.subject.replace(/[\r\n]+/g, " ")}`,
      text: [
        `Name:    ${t.firstName} ${t.surname}`,
        `Email:   ${t.email}`,
        `Subject: ${t.subject}`,
        "",
        "Message:",
        t.message,
      ].join("\n"),
      html: `
        <p><strong>Name:</strong> ${safe.firstName} ${safe.surname}</p>
        <p><strong>Email:</strong> <a href="mailto:${safe.email}">${safe.email}</a></p>
        <p><strong>Subject:</strong> ${safe.subject}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0" />
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;color:#374151">${safe.message}</p>
      `,
    });

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error("SMTP send error:", err.message);
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: "Failed to send message. Please email hello@vetnextstep.com directly." }),
    };
  }
};
