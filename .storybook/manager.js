import React from 'react';
import { addons, types, useChannel } from 'storybook/manager-api';
import customTheme from './Theme';
import { CH_OVERRIDES_CHANGED, CH_RESET, CH_STATE_REQUEST } from '../stories/_helpers/theme-roles';

addons.setConfig({
	theme: customTheme,
	sidebar: { showRoots: false },
	panelPosition: 'right',
});

/**
 * "Reset theme" toolbar button — appears next to the a11y / RTL / icon toggles, but ONLY
 * while the Theme Editor has active `:root` overrides. It mirrors the editor's reset across
 * every story: the preview broadcasts the override count on CH_OVERRIDES_CHANGED, and a
 * click emits CH_RESET (handled in preview.ts → clears the overrides).
 */
function ThemeResetTool() {
	const [count, setCount] = React.useState(0);
	const emit = useChannel({ [CH_OVERRIDES_CHANGED]: (next) => setCount(Number(next) || 0) });

	// Ask the preview for the current count when the toolbar mounts.
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
