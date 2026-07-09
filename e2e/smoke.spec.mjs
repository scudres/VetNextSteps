import { test, expect } from "@playwright/test";

// ─── Homepage ─────────────────────────────────────────────────────────────────

test("homepage renders hero and navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Know your next step" })).toBeVisible();
  await expect(page.getByRole("link", { name: "CPD & Conferences" }).first()).toBeVisible();
});

// ─── Visa figures come from visaFacts.json (accuracy regression guard) ────────

test("UK page shows current Skilled Worker figures from visaFacts", async ({ page }) => {
  await page.goto("/uk");
  await expect(page.getByText("£49,500", { exact: false })).toBeVisible();
  await expect(page.getByText("£38,000", { exact: false })).toBeVisible();
  // The stale pre-July-2025 figure must not reappear
  await expect(page.getByText("£48,100", { exact: false })).toHaveCount(0);
});

test("Australia page shows current CSIT figure", async ({ page }) => {
  await page.goto("/australia");
  await expect(page.getByText("AUD 79,499", { exact: false })).toBeVisible();
});

// ─── UK first-role interactive guide ─────────────────────────────────────────

test("first-role guide reveals steps when an option is chosen", async ({ page }) => {
  await page.goto("/uk/first-role");
  await expect(page.getByRole("heading", { name: "Your First UK Role, Step by Step" })).toBeVisible();
  await page.getByRole("button", { name: "An EAEVE-accredited EU school" }).click();
  await expect(page.getByText("Register before January 2029")).toBeVisible();
  await page.getByRole("button", { name: "Yes — I'll need a visa" }).click();
  await expect(page.getByText("Skilled Worker visa")).toBeVisible();
});

// ─── Conference data via live function handlers ───────────────────────────────

test("CPD region page renders conference cards and Event JSON-LD", async ({ page }) => {
  await page.goto("/cpd/uk");
  await expect(page.getByRole("heading", { name: "London Vet Show", exact: true })).toBeVisible();
  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
  const hasEvent = jsonLd.some((s) => s.includes('"@type":"Event"') || s.includes('"@type": "Event"'));
  expect(hasEvent).toBe(true);
});

// ─── Footer regression (was missing on all sub-pages) ─────────────────────────

for (const path of [
  "/training-programs/uk",
  "/internships-residencies/uk/university",
  "/postgraduate-certificates/australia",
]) {
  test(`footer renders on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("footer")).toBeVisible();
  });
}

// ─── Search (function handler + navPath resolution) ───────────────────────────

test("search results page returns results with working internal links", async ({ page }) => {
  await page.goto("/search?q=neurology");
  await expect(page.getByText(/result(s)? found/)).toBeVisible();
  const cards = page.locator("main h2");
  expect(await cards.count()).toBeGreaterThan(0);
});

test("internship search results deep-link to a page that renders the card", async ({ page }) => {
  await page.goto("/search?q=Royal Veterinary College rotating");
  const internal = page.getByRole("link", { name: "View on VetNextStep" }).first();
  if (await internal.count() > 0) {
    await internal.click();
    // Must land on a sub-category page (with cards), not the tile-only sub-hub
    await expect(page.locator("main")).toContainText("Royal Veterinary College");
  }
});

test("header search dropdown shows live results", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Search programmes, providers, conferences…").fill("BEVA");
  await expect(page.locator("text=/\\d+ results?/")).toBeVisible({ timeout: 5000 });
});

// ─── Contact form (dev stub — no email sent) ──────────────────────────────────

test("contact form submits successfully", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel(/First name/).fill("Test");
  await page.getByLabel(/Surname/).fill("User");
  await page.getByLabel(/Email address/).fill("test@example.com");
  await page.getByLabel(/Subject/).fill("Smoke test");
  await page.getByLabel(/Message/).fill("This is an automated smoke test submission.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Message sent")).toBeVisible({ timeout: 10_000 });
});
