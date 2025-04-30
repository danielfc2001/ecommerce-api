const { join } = require("path");

module.exports = {
  // Download Chrome (default `skipDownload: false`).
  chrome: {
    skipDownload: false,
  },
  // Download Firefox (default `skipDownload: true`).
  firefox: {
    skipDownload: true,
  },
  cacheDirectory:
    /* join(__dirname, "node_modules", ".cache", "puppeteer") */ "/opt/render/project/src/node_modules/.cache/puppeteer",
};
