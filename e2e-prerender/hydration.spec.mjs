import { test, expect } from "@playwright/test";

// Guards the prerendered build against hydration failure.
//
// react-snap writes static HTML for every route; React then hydrates it in the
// browser. If the two disagree even slightly, React throws the prerendered
// markup away and re-renders from scratch — which on the listing pages showed as
// a visible flash of the loading state, and everywhere else silently wasted the
// prerender the build exists to produce. Because hydration is all-or-nothing per
// page, a single bad node anywhere undoes it for that whole route.
//
// These run against the real build output. The main smoke suite runs against the
// dev server, which renders everything client-side and so cannot see this class
// of bug at all.

const ROUTES = [
  "/", "/about", "/resources", "/countries", "/uk", "/usa", "/canada", "/australia",
  "/jobs", "/legal", "/training-programs", "/internships-residencies",
  "/postgraduate-certificates", "/licensing-route", "/uk/first-role",
  "/cpd", "/cpd/europe", "/cpd/uk", "/cpd/germany", "/cpd/north-america",
  "/cpd/oceania", "/cpd/asia", "/cpd/africa", "/cpd/global",
  "/cpd/providers", "/cpd/providers/uk", "/cpd/providers/north-america",
];

for (const route of ROUTES) {
  test(`hydrates cleanly: ${route}`, async ({ page }) => {
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(route, { waitUntil: "load" });
    await page.waitForTimeout(1200);
    // React reports a hydration mismatch as a recoverable error, #418 in
    // production builds. Any page error is worth failing on here.
    expect(errors, `${route} threw: ${errors.join(" | ")}`).toHaveLength(0);
  });
}

// The listing pages must show their content immediately, not a loading state:
// that is the whole point of prerendering them with their data inlined.
for (const route of ["/cpd", "/cpd/europe", "/internships-residencies", "/training-programs"]) {
  test(`no loading flash: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "commit" });
    let flashed = false;
    for (let i = 0; i < 40; i++) {
      const showing = await page
        .evaluate(() => /Loading (conferences|providers|programmes|certificates)/.test(document.body.innerText || ""))
        .catch(() => false);
      if (showing) flashed = true;
      await page.waitForTimeout(25);
    }
    expect(flashed, `${route} flashed its loading state`).toBe(false);
  });
}
