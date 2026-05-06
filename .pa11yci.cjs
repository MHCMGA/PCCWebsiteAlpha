// pa11y-ci config. JS so we can pick up PUPPETEER_EXECUTABLE_PATH in CI
// where puppeteer-core can't auto-resolve a Chrome binary on its own.
const chromePath = process.env.PUPPETEER_EXECUTABLE_PATH;

const chromeLaunchConfig = {
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
  ...(chromePath ? { executablePath: chromePath } : {}),
};

module.exports = {
  defaults: {
    standard: "WCAG2AA",
    timeout: 30000,
    wait: 1500,
    chromeLaunchConfig,
    viewport: { width: 1280, height: 1024 },
    ignore: ["warning", "notice"],
  },
  urls: [
    "http://localhost:4173/",
    "http://localhost:4173/about",
    "http://localhost:4173/contact",
  ],
};
