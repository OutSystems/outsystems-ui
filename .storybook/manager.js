import React from 'react';
import { addons, types, useChannel } from 'storybook/manager-api';
import { darkTheme, lightTheme } from './Theme';
import { CH_OVERRIDES_CHANGED, CH_RESET, CH_STATE_REQUEST } from '../stories/_helpers/theme-roles';
import {
	CH_APP_APPEARANCE,
	isDarkAppearance,
	readStoredAppearance,
	storeAppearance,
} from '../stories/_helpers/storybook-appearance.js';

const MANAGER_DARK_CLASS = 'osui-sb-dark';
/** Storybook default nav column is 300px — keep in sync with manager-head.html --nav-width */
const SIDEBAR_NAV_SIZE = 240;

let currentScheme = readStoredAppearance();

function emitAppearance(scheme) {
	addons.getChannel()?.emit(CH_APP_APPEARANCE, scheme);
}

function applyManagerAppearance(scheme) {
	const dark = isDarkAppearance(scheme);
	currentScheme = scheme;
	addons.setConfig({ theme: dark ? darkTheme : lightTheme });
	document.documentElement.classList.toggle(MANAGER_DARK_CLASS, dark);
	storeAppearance(scheme);
	emitAppearance(scheme);
}

document.documentElement.classList.toggle(MANAGER_DARK_CLASS, isDarkAppearance(currentScheme));

addons.setConfig({
	theme: isDarkAppearance(currentScheme) ? darkTheme : lightTheme,
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

const MOON_ICON = React.createElement(
	'svg',
	{
		width: 14,
		height: 14,
		viewBox: '0 0 14 14',
		fill: 'currentColor',
		'aria-hidden': true,
	},
	React.createElement('path', {
		d: 'M7 1.5a5.5 5.5 0 1 0 5.2 7.3A4.5 4.5 0 1 1 7 1.5Z',
	})
);

const SUN_ICON = React.createElement(
	'svg',
	{
		width: 14,
		height: 14,
		viewBox: '0 0 14 14',
		fill: 'currentColor',
		'aria-hidden': true,
	},
	React.createElement('path', {
		d: 'M7 3.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Zm0-1.75a.75.75 0 0 1 .75.75v1.1a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 7 1.5ZM3.1 3.1a.75.75 0 0 1 1.06 0l.78.78a.75.75 0 1 1-1.06 1.06l-.78-.78a.75.75 0 0 1 0-1.06Zm7.04 0a.75.75 0 0 1 0 1.06l-.78.78a.75.75 0 1 1-1.06-1.06l.78-.78a.75.75 0 0 1 1.06 0ZM1.5 7a.75.75 0 0 1 .75-.75h1.1a.75.75 0 0 1 0 1.5H2.25A.75.75 0 0 1 1.5 7Zm9.65-.75a.75.75 0 0 1 0 1.5h-1.1a.75.75 0 0 1 0-1.5h1.1ZM4.16 9.84a.75.75 0 0 1 1.06 0l.78.78a.75.75 0 0 1-1.06 1.06l-.78-.78a.75.75 0 0 1 0-1.06Zm5.68 0a.75.75 0 0 1 0 1.06l-.78.78a.75.75 0 1 1-1.06-1.06l.78-.78a.75.75 0 0 1 1.06 0ZM7 10.65a.75.75 0 0 1 .75.75v1.1a.75.75 0 0 1-1.5 0v-1.1A.75.75 0 0 1 7 10.65Z',
	})
);

function AppAppearanceTool() {
	const [scheme, setScheme] = React.useState(currentScheme);

	useChannel({
		[CH_APP_APPEARANCE]: (next) => {
			const value = next === 'dark' ? 'dark' : 'light';
			currentScheme = value;
			setScheme(value);
		},
	});

	const dark = isDarkAppearance(scheme);

	return React.createElement(
		'button',
		{
			type: 'button',
			className: `osui-app-appearance-tool${dark ? ' is-dark' : ''}`,
			title: dark ? 'Switch to light mode' : 'Switch to dark mode',
			'aria-label': dark ? 'Switch to light mode' : 'Switch to dark mode',
			'aria-pressed': dark ? 'true' : 'false',
			onClick: () => {
				const next = dark ? 'light' : 'dark';
				applyManagerAppearance(next);
				setScheme(next);
			},
		},
		dark ? SUN_ICON : MOON_ICON
	);
}

addons.register('osui/app-appearance', () => {
	addons.add('osui/app-appearance-tool', {
		type: types.TOOL,
		title: 'App appearance',
		match: ({ viewMode }) => viewMode === 'story' || viewMode === 'docs',
		render: AppAppearanceTool,
	});

	emitAppearance(currentScheme);
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
				color: '#105cef',
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
