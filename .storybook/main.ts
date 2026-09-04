import type { StorybookConfig } from '@storybook/html-vite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import remarkGfm from 'remark-gfm';
import type { Plugin } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const distFolder = path.join(repoRoot, 'dist');

// ─── Platform base CSS (vendored, Storybook-only) ──────────────────────────────
// In a real OutSystems app the platform loads a base layer BEFORE the theme (OUI).
// It establishes the structural form of the data-attribute widgets ([data-checkbox],
// [data-switch], [data-input], [data-upload], …) — including the pseudo-element
// `content` that generates the checkbox box and the switch track + thumb.
// `.storybook/platform/platform-core.css` is a tracked, Storybook-only copy of it,
// served below via `staticDirs` and linked by `preview-head.html` ahead of the OUI
// stylesheet. Its header records the source package version and the refresh trigger.
//
// It used to be generated here on every startup from @outsystems/runtime-widgets-js,
// which made the whole Storybook — and therefore the Chromatic workflow — depend on
// the internal Azure Artifacts feed. The Widgets stories are now static
// transcriptions of the widgets' real DOM, so this repo needs no internal package at
// all: `npm i && npm run build && npm run build-storybook` works from any clone, and
// every branch, fork and CI event renders the identical, complete story set.
// See docs-internal/adr/ADR-0009.

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
	// Storybook 10 change detection marks unattached MDX docs as "New" (+ icon in sidebar).
	// We track UI review via story tags instead; keep the sidebar clean like Mobile UI.
	features: {
		changeDetection: false,
	},
	// Widget stories are static transcriptions (ADR-0009) — always include the full tree.
	stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
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
		// OutSystems core platform base CSS (vendored, loaded BEFORE the OUI theme) → /platform/*
		{ from: path.join(__dirname, 'platform'), to: '/platform' },
		// Compiled OUI bundle (built by gulp) → served at /osui/*
		{ from: path.join(repoRoot, 'dist'), to: '/osui' },
		// Pre-migration CSS snapshot (Phase 0 baseline) → served at /legacy/*
		// Used by the "Theme" toolbar toggle to compare the legacy look against the new token theme.
		{ from: path.join(repoRoot, 'legacy'), to: '/legacy' },
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
