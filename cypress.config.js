const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'k8xfqa',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
