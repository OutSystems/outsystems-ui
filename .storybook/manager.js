import React from 'react';
import { addons, types, useChannel } from 'storybook/manager-api';
import { darkTheme, lightTheme } from './Theme';
import { CH_OVERRIDES_CHANGED, CH_RESET, CH_STATE_REQUEST } from '../stories/_helpers/theme-roles';
import {
	CH_APP_APPEARANCE,
	isDarkAppearance,
	readAppearancePreference,
	resolveAppearance,
	storeAppearancePreference,
	watchSystemAppearance,
} from '../stories/_helpers/storybook-appearance.js';

const MANAGER_DARK_CLASS = 'osui-sb-dark';
/** Storybook default nav column is 300px — keep in sync with manager-head.html --nav-width */
const SIDEBAR_NAV_SIZE = 240;

/**
 * Manager chrome appearance: light, dark or system (the default), picked with the
 * toolbar switch below and kept in localStorage (storybook-appearance.js). The preview
 * iframe gets every change over the channel and applies it to the docs pages
 * (docs-appearance.ts); the pattern dark theme is a separate thing, the "Appearance"
 * toolbar global. `addons.setConfig` re-emits SET_CONFIG, which the manager API folds
 * into its theme state, so calling it again on a change re-themes the running UI.
 */
let currentPreference = readAppearancePreference();

function applyManagerAppearance(scheme) {
	const dark = isDarkAppearance(scheme);
	addons.setConfig({ theme: dark ? darkTheme : lightTheme });
	document.documentElement.classList.toggle(MANAGER_DARK_CLASS, dark);
}

function broadcastAppearance() {
	addons
		.getChannel()
		?.emit(CH_APP_APPEARANCE, { preference: currentPreference, scheme: resolveAppearance(currentPreference) });
}

function setAppearancePreference(preference) {
	currentPreference = preference;
	storeAppearancePreference(preference);
	applyManagerAppearance(resolveAppearance(preference));
	broadcastAppearance();
}

document.documentElement.classList.toggle(MANAGER_DARK_CLASS, isDarkAppearance(resolveAppearance(currentPreference)));
// On `system`, follow the OS live.
watchSystemAppearance(() => {
	if (currentPreference === 'system') setAppearancePreference('system');
});

addons.setConfig({
	theme: isDarkAppearance(resolveAppearance(currentPreference)) ? darkTheme : lightTheme,
	sidebar: { showRoots: false },
	panelPosition: 'right',
	layout: {
		navSize: SIDEBAR_NAV_SIZE,
		recentVisibleSizes: {
			navSize: SIDEBAR_NAV_SIZE,
		},
	},
});

addons.register('osui/sidebar-layout', (api) => {
	const applyNavWidth = () => {
		if (api.getNavAvailability?.() === 'unavailable') return;
		api.setSizes({ navSize: SIDEBAR_NAV_SIZE });
	};

	applyNavWidth();
	requestAnimationFrame(applyNavWidth);
});

function appearanceIcon(...paths) {
	return React.createElement(
		'svg',
		{
			width: 15,
			height: 15,
			viewBox: '0 0 24 24',
			fill: 'none',
			strokeWidth: 2,
			strokeLinecap: 'round',
			strokeLinejoin: 'round',
			'aria-hidden': true,
		},
		paths.map((d, i) => React.createElement('path', { key: i, d }))
	);
}

const APPEARANCE_OPTIONS = [
	{
		value: 'light',
		label: 'Light',
		icon: appearanceIcon(
			'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
			'M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41'
		),
	},
	{ value: 'dark', label: 'Dark', icon: appearanceIcon('M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z') },
	{
		value: 'system',
		label: 'System',
		icon: appearanceIcon(
			'M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9',
			'M20 16H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16'
		),
	},
];

/** Segmented light / dark / system switch for the Storybook chrome, in the canvas toolbar. */
function AppAppearanceTool() {
	const [preference, setPreference] = React.useState(currentPreference);
	useChannel({ [CH_APP_APPEARANCE]: (next) => setPreference(next?.preference ?? 'system') });

	return React.createElement(
		'div',
		{ className: 'osui-appearance-switch', role: 'radiogroup', 'aria-label': 'Storybook appearance' },
		APPEARANCE_OPTIONS.map((option) => {
			const active = preference === option.value;
			return React.createElement(
				'button',
				{
					key: option.value,
					type: 'button',
					role: 'radio',
					'aria-checked': active ? 'true' : 'false',
					'aria-label': option.label,
					title: `Storybook appearance: ${option.label}`,
					className: `osui-appearance-switch__option${active ? ' is-active' : ''}`,
					onClick: () => {
						setAppearancePreference(option.value);
						setPreference(option.value);
					},
				},
				option.icon
			);
		})
	);
}

addons.register('osui/app-appearance', () => {
	addons.add('osui/app-appearance-tool', {
		type: types.TOOL,
		title: 'Storybook appearance',
		match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
		render: AppAppearanceTool,
	});
	broadcastAppearance();
});

function ThemeResetTool() {
	const [count, setCount] = React.useState(0);
	const emit = useChannel({ [CH_OVERRIDES_CHANGED]: (next) => setCount(Number(next) || 0) });

	React.useEffect(() => {
		emit(CH_STATE_REQUEST);
	}, [emit]);

	if (!count) return null;

	return React.createElement(
		'button',
		{
			type: 'button',
			title: `${count} theme override${count === 1 ? '' : 's'} active — click to reset`,
			onClick: () => emit(CH_RESET),
			style: {
				display: 'inline-flex',
				alignItems: 'center',
				gap: '5px',
				height: '28px',
				padding: '0 10px',
				marginLeft: '4px',
				border: 'none',
				borderRadius: '4px',
				background: 'transparent',
				color: '#00a2bb',
				cursor: 'pointer',
				font: '700 12px/1 "Inter", system-ui, sans-serif',
			},
		},
		`↺ Reset theme (${count})`
	);
}

addons.register('osui/theme-reset', () => {
	addons.add('osui/theme-reset-tool', {
		type: types.TOOL,
		title: 'Reset theme',
		match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
		render: ThemeResetTool,
	});
});

addons.register('hide-onboarding-guide', (api) => {
	if (window.__HIDE_ONBOARDING_GUIDE_CLEANUP__) {
		window.__HIDE_ONBOARDING_GUIDE_CLEANUP__();
		delete window.__HIDE_ONBOARDING_GUIDE_CLEANUP__;
	}

	const checkAndRedirect = () => {
		const url = new URL(window.location.href);
		if (url.searchParams.get('path')?.startsWith('/settings/guide')) {
			api.navigate('/');
		}
	};

	checkAndRedirect();

	const popstateHandler = () => {
		checkAndRedirect();
	};
	window.addEventListener('popstate', popstateHandler);

	const originalPushState = history.pushState;
	const originalReplaceState = history.replaceState;

	history.pushState = function pushStateWithRedirect(...args) {
		const result = originalPushState.apply(this, args);
		checkAndRedirect();
		return result;
	};

	history.replaceState = function replaceStateWithRedirect(...args) {
		const result = originalReplaceState.apply(this, args);
		checkAndRedirect();
		return result;
	};

	window.__HIDE_ONBOARDING_GUIDE_CLEANUP__ = () => {
		window.removeEventListener('popstate', popstateHandler);
		history.pushState = originalPushState;
		history.replaceState = originalReplaceState;
	};
});
