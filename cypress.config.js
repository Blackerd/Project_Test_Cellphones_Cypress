const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // --- CẤU HÌNH QUAY PHIM ---
    video: true,                 // Bắt buộc quay video
    videoCompression: false,     // Giữ chất lượng cao (file sẽ nặng hơn chút)
    screenshotOnRunFailure: true,// Tự chụp màn hình khi lỗi
    chromeWebSecurity: false,    // Cái này để fix lỗi Security lúc nãy
    defaultCommandTimeout: 10000,
  },
});