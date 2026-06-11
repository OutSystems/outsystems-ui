import type { Preview, Decorator } from '@storybook/html-vite';
// Storybook docs-page chrome (Inter font, sidebar/sbdocs styling) — ported from
// the design-tokens Storybook. Only styles the docs/MDX surfaces, not the patterns.
import './docs.scss';

/**
 * Icon-library root classes (see src/scss/01-foundations/_icon-library-odc.scss):
 *  • `.iconLibrary-phosphor` on :root overrides the `--osui-icon-*` vars + font to Phosphor.
 *  • `.icon-library-FontAwesome` / `.icon-library-Phosphor` gate the flatpickr month-nav arrows.
 * FontAwesome is the default (the `:root` block sets it with no class needed), but we still
 * add `.icon-library-FontAwesome` so the flatpickr arrows resolve in that mode too.
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
 *  • `light` / `dark` force the mode via the `.theme-light` / `.theme-dark` body
 *    class (the manual-override path).
 *  • `auto` removes both classes, so the theme follows the OS via
 *    `@media (prefers-color-scheme: dark)` — flip your OS appearance to see it.
 * Requires a bundle built AFTER the dark theme was added (the dark CSS lives in
 * `/osui/ODC.OutSystemsUI.css`); rebuild with `npm run dev -- --target ODC`.
 */
const COLOR_SCHEME_DARK = 'theme-dark';
const COLOR_SCHEME_LIGHT = 'theme-light';

function applyColorScheme(scheme: string): void {
	const body = document.body;
	body.classList.remove(COLOR_SCHEME_DARK, COLOR_SCHEME_LIGHT);
	if (scheme === 'dark') {
		body.classList.add(COLOR_SCHEME_DARK);
	} else if (scheme === 'light') {
		body.classList.add(COLOR_SCHEME_LIGHT);
	}
	// 'auto' → no class; the prefers-color-scheme media query decides.
}

/**
 * OutSystems apps render inside a `<body>` the platform tags with device /
 * accessibility classes; OUI's responsive CSS keys off them (`.desktop`,
 * `.active-screen`). `.has-accessible-features` opts in to focus rings / a11y
 * affordances — it's toggled from the toolbar (off by default). We also apply
 * the icon-library choice from the toolbar.
 */
const withAppShell: Decorator = (storyFn, context) => {
	['desktop', 'active-screen'].forEach((c) => document.body.classList.add(c));
	document.body.classList.toggle('has-accessible-features', context.globals.accessibleFeatures === 'on');
	applyDirection(context.globals.direction === 'rtl');
	applyIconLibrary((context.globals.iconLibrary as string) ?? 'FontAwesome');
	applyTheme((context.globals.theme as string) ?? 'new');
	applyColorScheme((context.globals.colorScheme as string) ?? 'light');
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
			defaultValue: 'FontAwesome',
			toolbar: {
				title: 'Icons',
				icon: 'star',
				items: [
					{ value: 'FontAwesome', title: 'FontAwesome', icon: 'star' },
					{ value: 'Phosphor', title: 'Phosphor', icon: 'starhollow' },
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
			description: 'Light / dark appearance. Light & Dark force it via .theme-light / .theme-dark; Auto follows the OS (prefers-color-scheme).',
			defaultValue: 'light',
			toolbar: {
				title: 'Appearance',
				icon: 'contrast',
				items: [
					{ value: 'light', title: 'Light', icon: 'sun' },
					{ value: 'dark', title: 'Dark', icon: 'moon' },
					{ value: 'auto', title: 'Auto (OS)', icon: 'browser' },
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
					'Patterns',
					['Content', 'Interaction', 'Navigation', 'Adaptive', 'Numbers', 'Utilities'],
					'Widgets',
				],
			},
		},
	},
};

export default preview;
