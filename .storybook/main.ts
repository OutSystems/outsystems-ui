import type { StorybookConfig } from '@storybook/html-vite';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import remarkGfm from 'remark-gfm';
import type { Plugin } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const distFolder = path.join(repoRoot, 'dist');
const require = createRequire(import.meta.url);

// The `stories/widgets/` group mounts the platform's real React widgets, which come
// from @outsystems/runtime-{core,view,widgets}-js — optionalDependencies published only
// to the internal Azure Artifacts feed. On an external clone they are absent (npm skips
// unresolvable optional deps), so the group is dropped and the rest of the Storybook
// (~57 OUI pattern stories) works with no internal access.
const hasPlatformWidgets = [
	'@outsystems/runtime-core-js',
	'@outsystems/runtime-view-js',
	'@outsystems/runtime-widgets-js',
].every((pkg) => {
	try {
		require.resolve(`${pkg}/package.json`);
		return true;
	} catch {
		return false;
	}
});

if (!hasPlatformWidgets) {
	console.info(
		'[storybook] @outsystems/runtime-*-js not installed (internal Azure Artifacts feed) — skipping the Widgets story group.'
	);
}

// ─── Platform base CSS (generated, gitignored) ─────────────────────────────────
// In a real OutSystems app the platform loads a base layer BEFORE the theme (OUI).
// It establishes the structural form of the data-attribute widgets ([data-checkbox],
// [data-switch], [data-input], …) — including the pseudo-element `content` that
// generates the checkbox box / switch track + thumb. `preview-head.html` links it
// as /platform/platform-core.css ahead of the OUI stylesheet.
//
// Rather than vendoring that platform-owned CSS into this (public) repo, it is
// regenerated here on every Storybook startup from the installed
// @outsystems/runtime-widgets-js package, stripping only the FontAwesome @font-face
// (its relative ../fonts/* URLs would 404, and the icon fonts are served separately
// from /vendor/*). Without the internal packages a stub is written instead — the
// affected form controls then render without their platform-provided structure.
const platformDir = path.join(__dirname, 'platform');
const platformCssFile = path.join(platformDir, 'platform-core.css');
fs.mkdirSync(platformDir, { recursive: true });

if (hasPlatformWidgets) {
	// The package's `exports` map doesn't expose the CSS subpath, so resolve
	// package.json (which it does export) and locate the file on disk from there.
	const widgetsPkgJson = require.resolve('@outsystems/runtime-widgets-js/package.json');
	const widgetsPkg = require(widgetsPkgJson);
	const sourceCss = path.join(path.dirname(widgetsPkgJson), 'dist', 'OutSystemsReactWidgets.css');
	if (!fs.existsSync(sourceCss)) {
		throw new Error(
			`[storybook] expected platform base CSS at ${sourceCss} — did runtime-widgets-js change layout?`
		);
	}
	const css = fs
		.readFileSync(sourceCss, 'utf8')
		.replace(/\/\*hubedition:[\s\S]*?\*\/\s*/, '')
		.replace(/\/\*![\s\S]*?Font Awesome[\s\S]*?\*\/\s*/, '')
		.replace(/@font-face\s*\{[^{}]*FontAwesome[^{}]*\}\s*/, '');
	fs.writeFileSync(
		platformCssFile,
		`/*!\n * OutSystems core platform widget base styles.\n *\n * GENERATED FILE — do not edit (gitignored). Written on Storybook startup by\n * .storybook/main.ts from @outsystems/runtime-widgets-js@${widgetsPkg.version}\n * (dist/OutSystemsReactWidgets.css, FontAwesome @font-face stripped).\n */\n${css}`
	);
} else {
	fs.writeFileSync(
		platformCssFile,
		'/*!\n * GENERATED STUB — the OutSystems platform base CSS could not be generated because\n * @outsystems/runtime-widgets-js (internal package feed) is not installed. The\n * data-attribute form controls ([data-checkbox], [data-switch], …) will render\n * without their platform-provided structure.\n */\n'
	);
}

/**
 * Dev-bundle fallback for /osui/*.
 *
 * `preview-head.html` (and the Theme toolbar toggle) load the PRODUCTION file
 * names (`ODC.OutSystemsUI.{css,js}`), but `npm run dev -- --target ODC` wipes
 * `dist/` and emits only `dev.`-prefixed files. Without this fallback, running
 * Storybook against a dev watch build 404s the whole OUI bundle.
 *
 * When a requested `/osui/<name>` is missing from `dist/` but `dist/dev.<name>`
 * exists, serve the dev file instead. Static-dir serving (sirv) falls through
 * to the Vite middleware chain on a miss, which is where this plugin runs.
 * Dev-server only — `storybook build` copies staticDirs verbatim and expects a
 * prior production build, as before.
 */
function osuiDevBundleFallback(): Plugin {
	const contentTypes: Record<string, string> = {
		'.css': 'text/css',
		'.js': 'text/javascript',
		'.map': 'application/json',
	};
	return {
		name: 'osui-dev-bundle-fallback',
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				const url = (req.url ?? '').split('?')[0];
				if (!url.startsWith('/osui/')) {
					return next();
				}
				const requested = url.slice('/osui/'.length);
				// Only flat file names — no nested paths, no traversal, not already dev-prefixed.
				if (
					requested === '' ||
					/[/\\]/.test(requested) ||
					requested.includes('..') ||
					requested.startsWith('dev.')
				) {
					return next();
				}
				const prodPath = path.join(distFolder, requested);
				const devPath = path.join(distFolder, `dev.${requested}`);
				if (fs.existsSync(prodPath) || !fs.existsSync(devPath)) {
					return next();
				}
				res.setHeader('Content-Type', contentTypes[path.extname(requested)] ?? 'application/octet-stream');
				res.setHeader('Cache-Control', 'no-store');
				fs.createReadStream(devPath).pipe(res);
			});
		},
	};
}

/**
 * Storybook for OutSystems UI.
 *
 * Unlike the design-tokens Storybook (React, docs-only), this one drives the
 * COMPILED OUI library directly: the production bundle (`dist/`) and the
 * provider vendor libs (Flatpickr, Splide, …) are loaded as classic <script>
 * tags via `preview-head.html`, exposing `OutSystems.OSUI.*` / `window.flatpickr`
 * etc. as globals. Each story renders the HTML skeleton a pattern expects and
 * calls its public `Create(id, configs)` API — exactly what OutSystems Service
 * Studio does at runtime, transcribed to high-code.
 *
 * Prerequisite: build the library so `dist/` is populated — either `npm run build`
 * (production names, `ODC.OutSystemsUI.{js,css}`) or `npm run dev -- --target ODC`
 * (dev watch, `dev.`-prefixed names — resolved by the osuiDevBundleFallback plugin
 * above). Files are served from `/osui`.
 */
const config: StorybookConfig = {
	// `stories/widgets/` (and its `_helpers/widget.ts` harness) is only reachable when
	// the platform runtime packages resolved — the top-level globs exclude it otherwise.
	stories: hasPlatformWidgets
		? ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)']
		: ['../stories/*.mdx', '../stories/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		// remark-gfm enables GitHub-flavoured markdown in MDX docs pages — notably
		// tables (used by the CSS Architecture / CSS API Reference pages). Without
		// it, MDX renders pipe-tables as literal text.
		{
			name: '@storybook/addon-docs',
			options: { mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } } },
		},
		'@chromatic-com/storybook',
	],
	framework: {
		name: '@storybook/html-vite',
		options: {},
	},
	staticDirs: [
		// Manager-chrome assets (brand logo referenced by Theme.js) → /assets/*
		{ from: path.join(__dirname, 'assets'), to: '/assets' },
		// OutSystems core platform base CSS (generated above, loaded BEFORE the OUI theme) → /platform/*
		{ from: path.join(__dirname, 'platform'), to: '/platform' },
		// Compiled OUI bundle (built by gulp) → served at /osui/*
		{ from: path.join(repoRoot, 'dist'), to: '/osui' },
		// Pre-migration CSS snapshot (Phase 0 baseline) → served at /deprecated/*
		// Used by the "Theme" toolbar toggle to compare the deprecated look against the new token theme.
		{ from: path.join(repoRoot, 'deprecated'), to: '/deprecated' },
		// FontAwesome 4.7 — the default icon font (font-family: 'FontAwesome').
		// Serve the whole package so the CSS's relative ../fonts/* URLs resolve.
		{ from: path.join(repoRoot, 'node_modules/font-awesome'), to: '/vendor/font-awesome' },
		// Phosphor — the default icon font (font-family: 'Phosphor'), togglable in the toolbar.
		// regular/style.css references ./Phosphor.woff2, so serve that folder directly.
		{ from: path.join(repoRoot, 'node_modules/@phosphor-icons/web/src/regular'), to: '/vendor/phosphor' },
		// Phosphor fill weight (font-family: 'Phosphor-Fill', class `.ph-fill`) — used where a
		// solid glyph is needed (e.g. the Rating filled star). Served as its own folder so the
		// fill style.css can resolve its relative ./Phosphor-Fill.woff2.
		{ from: path.join(repoRoot, 'node_modules/@phosphor-icons/web/src/fill'), to: '/vendor/phosphor-fill' },
		// Provider vendor libraries (window globals + CSS) → served at /vendor/*
		{ from: path.join(repoRoot, 'node_modules/flatpickr/dist'), to: '/vendor/flatpickr' },
		{ from: path.join(repoRoot, 'node_modules/@splidejs/splide/dist'), to: '/vendor/splide' },
		{ from: path.join(repoRoot, 'node_modules/nouislider/dist'), to: '/vendor/nouislider' },
		{ from: path.join(repoRoot, 'node_modules/wnumb'), to: '/vendor/wnumb' },
		// FloatingUI — the OUI bundle positions tooltips/balloons via `window.FloatingUIDOM`
		// (which needs `window.FloatingUICore`). Served as UMD globals, loaded core → dom.
		{ from: path.join(repoRoot, 'node_modules/@floating-ui/core/dist'), to: '/vendor/floating-ui-core' },
		{ from: path.join(repoRoot, 'node_modules/@floating-ui/dom/dist'), to: '/vendor/floating-ui-dom' },
		{ from: path.join(repoRoot, 'node_modules/virtual-select-plugin/dist'), to: '/vendor/virtual-select' },
		// PhotoSwipe 4.1.0 — the version the OutSystems platform ships for the Lightbox
		// Image block. Not bundled by this library (the block is low-code only); OUI only
		// restyles the overlay chrome. Serve the whole `dist` so `default-skin.css` can
		// resolve its relative sprite URLs (default-skin.png/.svg, preloader.gif).
		{ from: path.join(repoRoot, 'node_modules/photoswipe/dist'), to: '/vendor/photoswipe' },
	],
	viteFinal(viteConfig) {
		viteConfig.plugins = [...(viteConfig.plugins ?? []), osuiDevBundleFallback()];
		return viteConfig;
	},
};

export default config;
