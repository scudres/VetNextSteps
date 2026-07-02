import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SharedHeader from "./SharedHeader";
import SharedFooter from "./SharedFooter";

const Field = ({ label, id, error, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

const inputClass = (hasError) =>
  `w-full px-4 py-2.5 text-sm text-gray-900 rounded-lg border transition-colors focus:outline-none focus:ring-1 ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-400"
      : "border-gray-200 focus:border-blue-400 focus:ring-blue-400"
  }`;

const ContactPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    surname: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!process.env.REACT_APP_TURNSTILE_SITE_KEY) return;
    if (document.querySelector('script[src*="turnstile"]')) return;
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }, []);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.surname.trim()) e.surname = "Surname is required.";
    if (!form.email.trim()) {
      e.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Please enter a valid email address.";
    }
    if (!form.subject.trim()) e.subject = "Subject is required.";
    if (!form.message.trim()) e.message = "Message is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/.netlify/functions/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          website: "",
          cfToken: document.querySelector('[name="cf-turnstile-response"]')?.value || "",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setForm({ firstName: "", surname: "", email: "", subject: "", message: "" });
      } else {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Could not connect. Please email hello@vetnextstep.com directly.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Contact Us | VetNextStep</title>
        <meta name="description" content="Get in touch with VetNextStep — questions, feedback, or advertising enquiries." />
        <link rel="canonical" href="https://vetnextstep.com/contact" />
        <meta property="og:title" content="Contact VetNextStep" />
        <meta property="og:description" content="Get in touch with VetNextStep — questions, feedback, or advertising enquiries." />
        <meta property="og:url" content="https://vetnextstep.com/contact" />
        <meta property="og:image" content="https://vetnextstep.com/og-image.png" />
        <meta property="og:type" content="website" />
      </Helmet>
      <SharedHeader />

      <main className="py-12 md:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-10">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-3">Get in touch</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact VetNextStep</h1>
            <p className="text-gray-500 text-base leading-relaxed">
              Have a question, spotted something that needs updating, or want to advertise a job or service?
              You can email us directly at{" "}
              <a href="mailto:hello@vetnextstep.com" className="text-blue-600 hover:underline font-medium">
                hello@vetnextstep.com
              </a>
              , or fill in the form below and we'll get back to you.
            </p>
          </div>

          {/* Success state */}
          {status === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center mb-8">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-green-900 mb-1">Message sent</h2>
              <p className="text-sm text-green-800">Thanks for getting in touch — we'll get back to you as soon as we can.</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 text-sm text-green-700 underline hover:text-green-900"
              >
                Send another message
              </button>
            </div>
          )}

          {/* Form */}
          {status !== "success" && (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Honeypot — filled only by bots */}
              <input name="website" tabIndex="-1" autoComplete="off" aria-hidden="true"
                style={{ display: "none" }} value="" readOnly />

              {/* Error banner */}
              {status === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-800">
                  {errorMessage}
                </div>
              )}

              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First name" id="firstName" error={errors.firstName}>
                  <input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={set("firstName")}
                    className={inputClass(!!errors.firstName)}
                    placeholder="Jane"
                  />
                </Field>
                <Field label="Surname" id="surname" error={errors.surname}>
                  <input
                    id="surname"
                    type="text"
                    autoComplete="family-name"
                    value={form.surname}
                    onChange={set("surname")}
                    className={inputClass(!!errors.surname)}
                    placeholder="Smith"
                  />
                </Field>
              </div>

              <Field label="Email address" id="email" error={errors.email}>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={set("email")}
                  className={inputClass(!!errors.email)}
                  placeholder="jane@example.com"
                />
              </Field>

              <Field label="Subject" id="subject" error={errors.subject}>
                <input
                  id="subject"
                  type="text"
                  value={form.subject}
                  onChange={set("subject")}
                  className={inputClass(!!errors.subject)}
                  placeholder="e.g. Question about UK licensing"
                />
              </Field>

              <Field label="Message" id="message" error={errors.message}>
                <textarea
                  id="message"
                  rows={6}
                  value={form.message}
                  onChange={set("message")}
                  className={inputClass(!!errors.message)}
                  placeholder="Write your message here…"
                />
              </Field>

              {process.env.REACT_APP_TURNSTILE_SITE_KEY && (
                <div
                  className="cf-turnstile"
                  data-sitekey={process.env.REACT_APP_TURNSTILE_SITE_KEY}
                  data-theme="light"
                />
              )}

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors"
                >
                  {status === "submitting" ? (
                    <>
                      <svg className="animate-spin mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    "Send message"
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-400">
                By submitting this form you agree to our{" "}
                <Link to="/legal?tab=privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
                We will only use your details to respond to your enquiry.
              </p>
            </form>
          )}
        </div>
      </main>

      <SharedFooter />
    </div>
  );
};

export default ContactPage;
