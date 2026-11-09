/** App-wide Storybook appearance — shared by manager.js and preview sync. */
export const CH_APP_APPEARANCE = 'osui/storybook-appearance';
export const STORAGE_KEY = 'osui-storybook-appearance';

export function readStoredAppearance() {
	try {
		return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
	} catch {
		return 'light';
	}
}

export function storeAppearance(scheme) {
	try {
		localStorage.setItem(STORAGE_KEY, scheme);
	} catch {
		/* ignore */
	}
}

export function isDarkAppearance(scheme) {
	return scheme === 'dark';
}

/** True on Windows desktop browsers (used for docs scrollbar overrides). */
export function isWindowsPlatform() {
	if (typeof navigator === 'undefined') return false;
	return /Windows/i.test(navigator.userAgent);
}
