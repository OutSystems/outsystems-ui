import type { Preview, Decorator } from '@storybook/html-vite';
import { addons } from 'storybook/preview-api';
import { GLOBALS_UPDATED } from 'storybook/internal/core-events';
// Storybook docs-page chrome (Inter font, sidebar/sbdocs styling) — ported from
// the design-tokens Storybook. Only styles the docs/MDX surfaces, not the patterns.
import './docs.scss';
import './docs-pages.scss';
import './welcome.scss';
import './getting-started.scss';
import './component-library.scss';
import './css-architecture.scss';
import './css-api-reference.scss';
import './theme-editor.scss';
import './docs-dark.scss';
import {
	CH_OVERRIDES_CHANGED,
	CH_RESET,
	CH_STATE_REQUEST,
	clearThemeOverrides,
	themeOverrideCount,
} from '../stories/_helpers/theme-roles';
import { initDocsAppearanceSync, applyAppAppearance } from '../stories/_helpers/docs-appearance';
import { readStoredAppearance } from '../stories/_helpers/storybook-appearance.js';

/**
 * Icon-library root classes (see src/scss/01-foundations/_icon-library-odc.scss):
 *  • `.iconLibrary-phosphor` on :root overrides the `--osui-icon-*` vars + font to Phosphor.
 *  • `.icon-library-FontAwesome` / `.icon-library-Phosphor` gate the flatpickr month-nav arrows.
 * Phosphor is the default in this Storybook (the `iconLibrary` toolbar global defaults to
 * `Phosphor`, adding `.iconLibrary-phosphor`). FontAwesome stays the SCSS `:root` fallback
 * (no class needed) and remains selectable from the toolbar; in that mode we add
 * `.icon-library-FontAwesome` so the flatpickr arrows resolve too.
 */
const ICON_LIB_FONTAWESOME = 'icon-library-FontAwesome';
const ICON_LIB_PHOSPHOR_VARS = 'iconLibrary-phosphor';
const ICON_LIB_PHOSPHOR_FLATPICKR = 'icon-library-Phosphor';

/**
 * Theme toggle — swaps the `#osui-theme` <link> href between the new token-based
 * theme (the freshly compiled bundle in /osui) and the pre-migration CSS snapshot
 * (/deprecated, the Phase 0 baseline). Lets reviewers eyeball the old vs new look
 * side by side without rebuilding. Both are full self-contained stylesheets, so
 * swapping the href is enough — no class toggling needed.
 */
const THEME_HREF = {
	new: '/osui/ODC.OutSystemsUI.css',
	deprecated: '/deprecated/ODC.OutSystemsUI.css',
} as const;

function applyTheme(theme: string): void {
	const link = document.getElementById('osui-theme') as HTMLLinkElement | null;
	if (link === null) {
		return;
	}
	const href = THEME_HREF[theme as keyof typeof THEME_HREF] ?? THEME_HREF.new;
	// Only reassign when it actually changes to avoid a needless reflow / FOUC.
	if (!link.href.endsWith(href)) {
		link.setAttribute('href', href);
	}
}

function applyIconLibrary(library: string): void {
	const root = document.documentElement;
	if (library === 'Phosphor') {
		root.classList.add(ICON_LIB_PHOSPHOR_VARS, ICON_LIB_PHOSPHOR_FLATPICKR);
		root.classList.remove(ICON_LIB_FONTAWESOME);
	} else {
		root.classList.add(ICON_LIB_FONTAWESOME);
		root.classList.remove(ICON_LIB_PHOSPHOR_VARS, ICON_LIB_PHOSPHOR_FLATPICKR);
	}
}

/**
 * Right-to-left toggle — mirrors how the platform renders an RTL app. OUI's CSS
 * keys off the `is-rtl` class on `<body>` (OSFramework `Constants.IsRTLClass`),
 * while newer logical-property rules (`margin-inline-*`, `inset-inline`) respond
 * to the `dir` attribute — so we set both: the class on the body and `dir` on the
 * root element.
 */
const IS_RTL_CLASS = 'is-rtl';

function applyDirection(rtl: boolean): void {
	document.body.classList.toggle(IS_RTL_CLASS, rtl);
	document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
}

/**
 * Appearance toggle — exercises the dark theme (src/scss/01-foundations/_theme-dark.scss).
 * The dark theme is manual-only: `dark` adds the `.theme-dark` body class, `light`
 * removes it (light is the default — no class). Requires a bundle built AFTER the
 * dark theme was added (the dark CSS lives in `/osui/ODC.OutSystemsUI.css`);
 * rebuild with `npm run dev --target=odc`.
 */
const PATTERN_DARK_CLASS = 'theme-dark';

function applyColorScheme(scheme: string): void {
	document.body.classList.toggle(PATTERN_DARK_CLASS, scheme === 'dark');
}

const PREVIEW_GLOBAL_DEFAULTS = {
	iconLibrary: 'Phosphor',
	theme: 'new',
	direction: 'ltr',
	colorScheme: 'light',
	accessibleFeatures: 'off',
} as const;

/** Toolbar globals shared by story decorators and MDX docs pages. */
function applyPreviewGlobals(globals: Record<string, unknown>): void {
	['desktop', 'active-screen'].forEach((c) => document.body.classList.add(c));
	document.body.classList.toggle('has-accessible-features', globals.accessibleFeatures === 'on');
	applyDirection(globals.direction === 'rtl');
	applyIconLibrary((globals.iconLibrary as string) ?? PREVIEW_GLOBAL_DEFAULTS.iconLibrary);
	applyTheme((globals.theme as string) ?? PREVIEW_GLOBAL_DEFAULTS.theme);
	applyColorScheme((globals.colorScheme as string) ?? PREVIEW_GLOBAL_DEFAULTS.colorScheme);
}

/**
 * MDX docs pages skip preview story decorators — sync toolbar globals (icon font,
 * theme href, RTL, pattern dark mode, a11y body class) via the preview channel.
 */
let previewToolbarSyncReady = false;

function wirePreviewToolbarSync(): boolean {
	let channel;
	try {
		channel = addons.getChannel();
	} catch {
		return false;
	}
	if (!channel) return false;

	channel.on(GLOBALS_UPDATED, ({ globals }: { globals?: Record<string, unknown> }) => {
		if (globals) {
			applyPreviewGlobals(globals);
		}
	});

	applyPreviewGlobals(PREVIEW_GLOBAL_DEFAULTS);
	return true;
}

function initPreviewToolbarSync(): void {
	if (previewToolbarSyncReady) return;
	if (wirePreviewToolbarSync()) {
		previewToolbarSyncReady = true;
		return;
	}
	if (typeof document !== 'undefined') {
		document.addEventListener('DOMContentLoaded', () => initPreviewToolbarSync(), { once: true });
	}
}

/**
 * Theme-Editor channel bridge. The editor (a preview story) overrides `--color-*` /
 * `--border-radius-*` roles inline on `:root`; the manager's "Reset theme" toolbar button
 * (see `.storybook/manager.js`) needs to know when any override is active and be able to
 * clear them. Wire it once, lazily, when the channel is available.
 */
let themeChannelReady = false;
function setupThemeChannel(): void {
	if (themeChannelReady) return;
	const channel = addons.getChannel();
	if (!channel) return;
	themeChannelReady = true;
	channel.on(CH_RESET, () => {
		clearThemeOverrides();
		channel.emit(CH_OVERRIDES_CHANGED, 0);
	});
	channel.on(CH_STATE_REQUEST, () => channel.emit(CH_OVERRIDES_CHANGED, themeOverrideCount()));
}

initDocsAppearanceSync();
initPreviewToolbarSync();

const withAppShell: Decorator = (storyFn, context) => {
	applyPreviewGlobals(context.globals);
	applyAppAppearance(readStoredAppearance());
	// Channel may not be ready at preview module load — wire docs sync from the decorator too.
	initDocsAppearanceSync();
	initPreviewToolbarSync();
	// Keep the toolbar reset button in sync on every story view.
	setupThemeChannel();
	try {
		addons.getChannel().emit(CH_OVERRIDES_CHANGED, themeOverrideCount());
	} catch {
		/* channel not ready */
	}
	return storyFn();
};

const preview: Preview = {
	decorators: [withAppShell],
	// UI-review tracking: every story starts as `ui-pending`. As a component's UI
	// is signed off, its meta opts out with `!ui-pending` and adds `ui-reviewed`
	// (see e.g. Accordion / Alert stories). Filter by either in the sidebar's tag menu.
	tags: ['ui-pending'],
	globalTypes: {
		theme: {
			description: 'Switch between the new token-based theme and the deprecated pre-migration CSS',
			defaultValue: 'new',
			toolbar: {
				title: 'Theme',
				icon: 'paintbrush',
				items: [
					{ value: 'new', title: 'New theme (tokens)' },
					{ value: 'deprecated', title: 'Deprecated theme' },
				],
				dynamicTitle: true,
			},
		},
		iconLibrary: {
			description: 'OutSystems UI icon font',
			defaultValue: 'Phosphor',
			toolbar: {
				title: 'Icons',
				icon: 'star',
				items: [
					{ value: 'Phosphor', title: 'Phosphor', icon: 'starhollow' },
					{ value: 'FontAwesome', title: 'FontAwesome', icon: 'star' },
				],
				dynamicTitle: true,
			},
		},
		accessibleFeatures: {
			description: 'Toggle the `has-accessible-features` body class (focus rings / a11y affordances)',
			defaultValue: 'off',
			toolbar: {
				title: 'A11y features',
				icon: 'accessibility',
				items: [
					{ value: 'off', title: 'has-accessible-features: off' },
					{ value: 'on', title: 'has-accessible-features: on' },
				],
				dynamicTitle: true,
			},
		},
		direction: {
			description: 'Toggle the `is-rtl` body class + `dir` attribute (right-to-left layout)',
			defaultValue: 'ltr',
			toolbar: {
				title: 'Direction',
				icon: 'mirror',
				items: [
					{ value: 'ltr', title: 'LTR (is-rtl: off)' },
					{ value: 'rtl', title: 'RTL (is-rtl: on)' },
				],
				dynamicTitle: true,
			},
		},
		colorScheme: {
			description:
				'Pattern appearance. Dark adds the `.theme-dark` body class for OUI patterns. Light removes it. Manual only — no OS detection.',
			defaultValue: 'light',
			toolbar: {
				title: 'Appearance',
				icon: 'contrast',
				items: [
					{ value: 'light', title: 'Light', icon: 'sun' },
					{ value: 'dark', title: 'Dark', icon: 'moon' },
				],
				dynamicTitle: true,
			},
		},
	},
	parameters: {
		layout: 'padded',
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		options: {
			storySort: {
				order: [
					'Welcome',
					'Getting Started',
					'Component Library',
					'CSS Architecture',
					'CSS API Reference',
					'Theme Editor',
					'Patterns',
					['Content', 'Interaction', 'Navigation', 'Adaptive', 'Numbers', 'Utilities'],
					'Widgets',
				],
			},
		},
	},
};

export default preview;
