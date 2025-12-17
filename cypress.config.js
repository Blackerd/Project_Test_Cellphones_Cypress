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
  },
})
