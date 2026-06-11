import type { StorybookConfig } from '@storybook/html-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

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
 * Prerequisite: run `npm run build:osui` (or `npm run dev -- --target ODC`)
 * once so `dist/ODC.OutSystemsUI.{js,css}` exist. They are served from `/osui`.
 */
const config: StorybookConfig = {
	stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: ['@storybook/addon-docs', '@chromatic-com/storybook'],
	framework: {
		name: '@storybook/html-vite',
		options: {},
	},
	staticDirs: [
		// Manager-chrome assets (brand logo referenced by Theme.js) → /assets/*
		{ from: path.join(__dirname, 'assets'), to: '/assets' },
		// OutSystems core platform base CSS (loaded BEFORE the OUI theme) → /platform/*
		{ from: path.join(__dirname, 'platform'), to: '/platform' },
		// Compiled OUI bundle (built by gulp) → served at /osui/*
		{ from: path.join(repoRoot, 'dist'), to: '/osui' },
		// Pre-migration CSS snapshot (Phase 0 baseline) → served at /deprecated/*
		// Used by the "Theme" toolbar toggle to compare the deprecated look against the new token theme.
		{ from: path.join(repoRoot, 'deprecated'), to: '/deprecated' },
		// FontAwesome 4.7 — the default icon font (font-family: 'FontAwesome').
		// Serve the whole package so the CSS's relative ../fonts/* URLs resolve.
		{ from: path.join(repoRoot, 'node_modules/font-awesome'), to: '/vendor/font-awesome' },
		// Phosphor — the alternate icon font (font-family: 'Phosphor'), togglable in the toolbar.
		// regular/style.css references ./Phosphor.woff2, so serve that folder directly.
		{ from: path.join(repoRoot, 'node_modules/@phosphor-icons/web/src/regular'), to: '/vendor/phosphor' },
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
	],
};

export default config;
