const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://cellphones.com.vn',
    viewportWidth: 1280,
    viewportHeight: 720,
    pageLoadTimeout: 90000,
    defaultCommandTimeout: 15000,
    video: true,
    screenshotOnRunFailure: true,
    setupNodeEvents(on, config) {
    },
    // --- CẤU HÌNH QUAY PHIM ---
    video: true,                 // Bắt buộc quay video
    videoCompression: false,     // Giữ chất lượng cao (file sẽ nặng hơn chút)
    screenshotOnRunFailure: true,// Tự chụp màn hình khi lỗi
    chromeWebSecurity: false,    // Cái này để fix lỗi Security lúc nãy
    defaultCommandTimeout: 10000,
  },
});
