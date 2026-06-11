import { addons } from 'storybook/manager-api';
import customTheme from './Theme';

addons.setConfig({
	theme: customTheme,
	sidebar: { showRoots: false },
	panelPosition: 'right',
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
