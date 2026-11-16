import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from '@playwright/test';

const PORT = 4173;

/**
 * Uses the Chromium that Playwright installed for this @playwright/test version when it is present, otherwise
 * the newest Chromium under the Playwright browsers folder (PLAYWRIGHT_CHROMIUM_PATH overrides both).
 *
 * @returns {string | undefined} the executable path, or undefined to let Playwright resolve it
 */
function chromiumPath() {
	if (process.env.PLAYWRIGHT_CHROMIUM_PATH) {
		return process.env.PLAYWRIGHT_CHROMIUM_PATH;
	}
	const browsersRoot =
		process.env.PLAYWRIGHT_BROWSERS_PATH ?? path.join(process.env.LOCALAPPDATA ?? '', 'ms-playwright');
	const wanted = JSON.parse(
		fs.readFileSync(new URL('./node_modules/playwright-core/browsers.json', import.meta.url))
	).browsers.find((b) => b.name === 'chromium').revision;
	if (!fs.existsSync(browsersRoot) || fs.existsSync(path.join(browsersRoot, `chromium-${wanted}`))) {
		return undefined;
	}
	const installed = fs
		.readdirSync(browsersRoot)
		.filter((d) => /^chromium-\d+$/.test(d))
		.sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
	for (const dir of installed) {
		const exe = path.join(browsersRoot, dir, 'chrome-win64', 'chrome.exe');
		if (fs.existsSync(exe)) {
			return exe;
		}
	}
	return undefined;
}

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	reporter: [['list']],
	use: {
		baseURL: `http://localhost:${PORT}/poc/two-copies/`,
		browserName: 'chromium',
		launchOptions: { executablePath: chromiumPath() },
	},
	webServer: {
		command: `node serve.mjs ${PORT}`,
		url: `http://localhost:${PORT}/poc/two-copies/index.html`,
		reuseExistingServer: true,
	},
});
