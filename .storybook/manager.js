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

function appearanceIcon(path) {
	return React.createElement(
		'svg',
		{ width: 14, height: 14, viewBox: '0 0 14 14', fill: 'currentColor', fillRule: 'evenodd', 'aria-hidden': true },
		React.createElement('path', { d: path })
	);
}

const APPEARANCE_OPTIONS = [
	{
		value: 'light',
		label: 'Light',
		icon: appearanceIcon(
			'M7 3.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm0-1.75a.75.75 0 0 1 .75.75v1.1a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 7 1.5ZM3.1 3.1a.75.75 0 0 1 1.06 0l.78.78a.75.75 0 1 1-1.06 1.06l-.78-.78a.75.75 0 0 1 0-1.06Zm7.04 0a.75.75 0 0 1 0 1.06l-.78.78a.75.75 0 1 1-1.06-1.06l.78-.78a.75.75 0 0 1 1.06 0ZM1.5 7a.75.75 0 0 1 .75-.75h1.1a.75.75 0 0 1 0 1.5H2.25A.75.75 0 0 1 1.5 7Zm9.65-.75a.75.75 0 0 1 0 1.5h-1.1a.75.75 0 0 1 0-1.5h1.1ZM4.16 9.84a.75.75 0 0 1 1.06 0l.78.78a.75.75 0 0 1-1.06 1.06l-.78-.78a.75.75 0 0 1 0-1.06Zm5.68 0a.75.75 0 0 1 0 1.06l-.78.78a.75.75 0 1 1-1.06-1.06l.78-.78a.75.75 0 0 1 1.06 0ZM7 10.65a.75.75 0 0 1 .75.75v1.1a.75.75 0 0 1-1.5 0v-1.1A.75.75 0 0 1 7 10.65Z'
		),
	},
	{ value: 'dark', label: 'Dark', icon: appearanceIcon('M7 1.5a5.5 5.5 0 1 0 5.2 7.3A4.5 4.5 0 1 1 7 1.5Z') },
	{
		value: 'system',
		label: 'System',
		icon: appearanceIcon(
			'M3 2.5h8c.69 0 1.25.56 1.25 1.25V9.5H1.75V3.75C1.75 3.06 2.31 2.5 3 2.5Zm.25 1.5v4h7.5V4h-7.5ZM1 10.25h12v.5c0 .69-.56 1.25-1.25 1.25h-9.5C1.56 12 1 11.44 1 10.75v-.5Z'
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
