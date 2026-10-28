import React from 'react';
import { addons, types, useChannel } from 'storybook/manager-api';
import { darkTheme, lightTheme } from './Theme';
import { CH_OVERRIDES_CHANGED, CH_RESET, CH_STATE_REQUEST } from '../stories/_helpers/theme-roles';
import {
	isDarkAppearance,
	readSystemAppearance,
	watchSystemAppearance,
} from '../stories/_helpers/storybook-appearance.js';

const MANAGER_DARK_CLASS = 'osui-sb-dark';
/** Storybook default nav column is 300px — keep in sync with manager-head.html --nav-width */
const SIDEBAR_NAV_SIZE = 240;

/**
 * Manager chrome appearance follows the OS `prefers-color-scheme` (no toggle). The
 * preview iframe watches the same media query for the docs pages (docs-appearance.ts);
 * the pattern dark theme is a separate thing, the "Appearance" toolbar global.
 * `addons.setConfig` re-emits SET_CONFIG, which the manager API folds into its theme
 * state, so calling it again on a change re-themes the running UI.
 */
function applyManagerAppearance(scheme) {
	const dark = isDarkAppearance(scheme);
	addons.setConfig({ theme: dark ? darkTheme : lightTheme });
	document.documentElement.classList.toggle(MANAGER_DARK_CLASS, dark);
}

document.documentElement.classList.toggle(MANAGER_DARK_CLASS, isDarkAppearance(readSystemAppearance()));
watchSystemAppearance(applyManagerAppearance);

addons.setConfig({
	theme: isDarkAppearance(readSystemAppearance()) ? darkTheme : lightTheme,
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

/**
 * Sidebar nesting for Docs-page examples. Stories tagged `docs-example` (the ones a
 * pattern's Docs page embeds via <Canvas>) are indented one level deeper than the Docs
 * row, so the tree reads "Docs → its examples", with the other stories (Playground,
 * variants) at the component root. The base indents live in manager-head.html; the tag
 * is only in the index, so the per-id rules are generated here from index.json.
 */
addons.register('osui/docs-example-nesting', () => {
	fetch('./index.json')
		.then((response) => (response.ok ? response.json() : null))
		.then((index) => {
			const ids = Object.values(index?.entries ?? {})
				.filter((entry) => entry.type === 'story' && entry.tags?.includes('docs-example'))
				.map((entry) => entry.id);
			if (ids.length === 0) return;
			const selector = (suffix) =>
				ids.map((id) => `.sidebar-item[data-nodetype="story"][data-item-id="${id}"]${suffix}`).join(',\n');
			const style = document.createElement('style');
			style.id = 'osui-docs-example-nesting';
			style.textContent = `${selector('::before')} { left: 52px; }\n${selector(' a')} { padding-left: 72px !important; }`;
			document.head.append(style);
		})
		.catch(() => {});
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
