// TypeDoc plugin: the pieces of the Storybook look that `customCss` cannot carry on its own.
// Colours, layout and the header live in ./typedoc-theme.css (wired through `customCss` in typedoc.json).
//  - Loads Inter + JetBrains Mono, the same Google Fonts request as .storybook/preview-head.html.
//  - Copies the Storybook logo (single source: .storybook/assets) next to the CSS, under docs/assets/.
//    Only the dark-chrome logo: the header keeps its dark gradient in both themes.
import { cpSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSX, RendererEvent } from 'typedoc';

const STORYBOOK_ASSETS = resolve(dirname(fileURLToPath(import.meta.url)), '../../.storybook/assets');
const LOGOS = ['logo_outsystems-ui-dark.svg'];
const FONTS_URL =
	'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:wght@400;500&display=swap';

/** @param {import('typedoc').Application} app */
export function load(app) {
	app.renderer.hooks.on('head.end', () =>
		JSX.createElement(
			JSX.Fragment,
			null,
			JSX.createElement('link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }),
			JSX.createElement('link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }),
			JSX.createElement('link', { rel: 'stylesheet', href: FONTS_URL })
		)
	);

	app.renderer.on(RendererEvent.END, (event) => {
		for (const logo of LOGOS) {
			cpSync(join(STORYBOOK_ASSETS, logo), join(event.outputDirectory, 'assets', logo));
		}
	});
}
