// Minimal static server for frontend/build, used by the prerender test suite.
//
// The main smoke tests run against the CRA dev server, which renders everything
// client-side — so they cannot see hydration problems at all. Those only appear
// when React hydrates react-snap's prerendered HTML, which means serving the
// real build output.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath, not url.pathname: the repo lives under an iCloud path
// containing "~", which pathname leaves percent-encoded.
const ROOT = fileURLToPath(new URL("../frontend/build/", import.meta.url));
const PORT = Number(process.argv[2] || 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".webmanifest": "application/manifest+json",
};

const resolve = async (urlPath) => {
  // Strip the query and normalise, refusing anything that climbs out of ROOT.
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0]));
  if (clean.includes("..")) return null;
  const candidates = extname(clean)
    ? [join(ROOT, clean)]
    : [join(ROOT, clean, "index.html"), join(ROOT, clean + ".html")];
  for (const file of candidates) {
    try {
      if ((await stat(file)).isFile()) return file;
    } catch { /* try the next candidate */ }
  }
  return null;
};

createServer(async (req, res) => {
  const file = await resolve(req.url);
  if (!file) {
    // react-snap writes a real 404 page; fall back to it so the test suite sees
    // what a visitor would.
    // Read before writing the head, so a missing fallback cannot leave us
    // sending headers twice.
    let body = null;
    try { body = await readFile(join(ROOT, "404.html")); } catch { /* no 404 page */ }
    res.writeHead(404, { "content-type": TYPES[".html"] });
    res.end(body ?? "Not found");
    return;
  }
  res.writeHead(200, {
    "content-type": TYPES[extname(file)] || "application/octet-stream",
    // Mirrors the production CSP from netlify.toml. Without it a page can pass
    // locally and still break live: react-snap's own state hook emits an inline
    // script, which production blocks outright and a bare static server does not.
    "content-security-policy":
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https://images.pexels.com https://images.unsplash.com; " +
      "connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'",
  });
  res.end(await readFile(file));
}).listen(PORT, () => console.log(`static-server: serving frontend/build on :${PORT}`));
