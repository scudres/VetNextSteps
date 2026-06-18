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
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

exports.handler = async (event) => {
  const origin = event.headers.origin || "";
  const headers = corsHeaders(origin);

  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  // Parse body
  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  const { firstName, surname, email, subject, message } = body;

  // Server-side validation
  if (!firstName || !surname || !email || !subject || !message) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "All fields are required." }),
    };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Please enter a valid email address." }),
    };
  }

  // Check env vars are set
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.error("SMTP environment variables are not fully configured.");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Email service is not configured. Please contact hello@vetnextstep.com directly." }),
    };
  }

  // Create transporter using IONOS SMTP
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: false,       // false = STARTTLS on port 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"VetNextStep Contact Form" <${SMTP_USER}>`,
      to: "hello@vetnextstep.com",
      replyTo: `"${firstName} ${surname}" <${email}>`,
      subject: `[Contact Form] ${subject}`,
      text: [
        `Name:    ${firstName} ${surname}`,
        `Email:   ${email}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <p><strong>Name:</strong> ${firstName} ${surname}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0" />
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;color:#374151">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
      `,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("SMTP send error:", err.message);
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: "Failed to send message. Please email hello@vetnextstep.com directly." }),
    };
  }
};
