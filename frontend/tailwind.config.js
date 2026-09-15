/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Institutional navy for the utility bar, footer, and axis rules.
        // The blues elsewhere come from the brand icon and are Tailwind's own:
        // blue-800 (#1e40af) and blue-50 (#eff6ff) are exact matches.
        navy: "#0c2b4b",
        // Reserved for time-sensitive content (deadlines), never decoration.
        notice: "#8a6410",
      },
    },
  },
  plugins: [],
};
