import type { Preview, Decorator } from '@storybook/html-vite';
import { addons } from 'storybook/preview-api';
// Storybook docs-page chrome (Inter font, sidebar/sbdocs styling) — ported from
// the design-tokens Storybook. Only styles the docs/MDX surfaces, not the patterns.
import './docs.scss';
import {
	CH_OVERRIDES_CHANGED,
	CH_RESET,
	CH_STATE_REQUEST,
	clearThemeOverrides,
	themeOverrideCount,
} from '../stories/_helpers/theme-roles';

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
 * Appearance toggle — exercises the dark theme
 * (src/scss/tokens/_theme-dark.scss, generated from the design tokens' dark mode;
 * it re-maps the --token-* set and self-applies under `.theme-dark`).
 *
 * The class goes on `<html>`, NOT `<body>`, and that is load-bearing rather than
 * stylistic. The framework theme-layer roles (`--color-*`) are declared at
 * `:root`, i.e. on `<html>`, as `var(--token-…, <light fallback>)`. A custom
 * property's `var()` is substituted using the computed values on the element the
 * declaration applies to — so overriding `--token-*` on `<body>` comes too late:
 * `--color-background-surface` has already resolved to its light fallback on
 * `<html>` and inherits down as that literal. Put the class on `<html>` and the
 * tokens are defined on the very element the roles resolve on, so 43 of the 44
 * `--color-*` knobs (~488 reads across the bundle) flip to dark for free.
 * `--color-focus-outer` is a deliberate hardcoded yellow and stays put.
 *
 * `.theme-dark` is an element-agnostic class selector, so no CSS change was
 * needed for this — only the choice of element. Light is the default and has no
 * class at all (there are no light `--token-*` declarations anywhere; light is
 * the fallback baked into every `$token-*`).
 *
 * Requires a bundle built AFTER the dark theme was added (the dark CSS lives in
 * `/osui/ODC.OutSystemsUI.css`); rebuild with `npm run dev --target=odc`.
 */
const COLOR_SCHEME_DARK = 'theme-dark';

function applyColorScheme(scheme: string): void {
	document.documentElement.classList.toggle(COLOR_SCHEME_DARK, scheme === 'dark');
}

/**
 * OutSystems apps render inside a `<body>` the platform tags with device /
 * accessibility classes; OUI's responsive CSS keys off them (`.desktop`,
 * `.active-screen`). `.has-accessible-features` opts in to focus rings / a11y
 * affordances — it's toggled from the toolbar (off by default). We also apply
 * the icon-library choice from the toolbar.
 */
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

const withAppShell: Decorator = (storyFn, context) => {
	['desktop', 'active-screen'].forEach((c) => document.body.classList.add(c));
	document.body.classList.toggle('has-accessible-features', context.globals.accessibleFeatures === 'on');
	applyDirection(context.globals.direction === 'rtl');
	applyIconLibrary((context.globals.iconLibrary as string) ?? 'Phosphor');
	applyTheme((context.globals.theme as string) ?? 'new');
	applyColorScheme((context.globals.colorScheme as string) ?? 'light');
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
				'Appearance. Dark adds the `.theme-dark` class to `<html>`; Light removes it (the default). Manual only — no OS detection.',
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
					'Introduction',
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
