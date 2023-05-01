/* eslint-disable quotes */
import { defineConfig } from 'cypress';

export default defineConfig({
	projectId: 'a8ja1w',
	viewportWidth: 1360,
	viewportHeight: 768,
	reporter: 'cypress-multi-reporters',
	video: false,
	retries: 1,
	reporterOptions: {
		configFile: 'jsconfig.json',
	},
	e2e: {
		setupNodeEvents() {
			// implement node event listeners here
		},
		specPattern: ['**/*.feature', 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'],
		baseUrl: 'https://qa-challenge.ensolvers.com',
		WatchForFileChanges: false,
	},
});
