import type { Preview, Decorator } from '@storybook/html-vite';

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
 * OutSystems apps render inside a `<body>` the platform tags with device /
 * accessibility classes; OUI's responsive CSS keys off them (`.desktop`,
 * `.active-screen`). `.has-accessible-features` opts in to focus rings / a11y
 * affordances — it's toggled from the toolbar (off by default). We also apply
 * the icon-library choice from the toolbar.
 */
const withAppShell: Decorator = (storyFn, context) => {
	['desktop', 'active-screen'].forEach((c) => document.body.classList.add(c));
	document.body.classList.toggle('has-accessible-features', context.globals.accessibleFeatures === 'on');
	document.documentElement.setAttribute('dir', 'ltr');
	applyIconLibrary((context.globals.iconLibrary as string) ?? 'FontAwesome');
	return storyFn();
};

const preview: Preview = {
	decorators: [withAppShell],
	globalTypes: {
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
