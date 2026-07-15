"use strict";

// Writes the same data the Netlify functions serve to frontend/public/data/*.json,
// so it's a same-origin static file — reachable both by react-snap's headless
// crawl at build time and by the browser at runtime, with no serverless
// round-trip. This is what lets listing pages (conferences, providers,
// internships, certificates, training) prerender with real content and
// schema.org markup instead of a loading/error state.
//
// Runs as the "prebuild" step, before craco build and the react-snap postbuild.

const fs = require("fs");
const path = require("path");

const FUNCTIONS_DIR = path.join(__dirname, "..", "..", "functions");
const OUT_DIR = path.join(__dirname, "..", "public", "data");

const { conferences } = require(path.join(FUNCTIONS_DIR, "data", "conferences"));
const { cpdProviders } = require(path.join(FUNCTIONS_DIR, "data", "providers"));
const { internshipPrograms } = require(path.join(FUNCTIONS_DIR, "data", "internships"));
const { ukPrograms, usaCertCategories, australiaPrograms, newZealandPrograms } =
  require(path.join(FUNCTIONS_DIR, "data", "certificates"));
const { trainingPrograms } = require(path.join(FUNCTIONS_DIR, "data", "training"));
const { expandMultiYearConferences } = require(path.join(FUNCTIONS_DIR, "lib", "expand"));

fs.mkdirSync(OUT_DIR, { recursive: true });

const write = (name, data) =>
  fs.writeFileSync(path.join(OUT_DIR, name), JSON.stringify(data));

write("conferences.json", expandMultiYearConferences(conferences));
write("providers.json", cpdProviders);
write("internships.json", internshipPrograms);
write("certificates.json", { uk: ukPrograms, usa: usaCertCategories, australia: australiaPrograms, newZealand: newZealandPrograms });
write("training.json", trainingPrograms);

console.log("build-data: wrote conferences, providers, internships, certificates, training JSON to public/data/");
