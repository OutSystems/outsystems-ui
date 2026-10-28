/**
 * App-wide Storybook appearance (the docs/manager chrome, NOT the pattern dark theme
 * driven by the "Appearance" toolbar global). It follows the OS `prefers-color-scheme`
 * and is shared by manager.js and the preview sync; there is no manual toggle.
 */
const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

function darkSchemeMedia() {
	if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return null;
	return window.matchMedia(DARK_SCHEME_QUERY);
}

/** `'dark'` when the OS prefers a dark colour scheme, `'light'` otherwise (and when unknown). */
export function readSystemAppearance() {
	return darkSchemeMedia()?.matches ? 'dark' : 'light';
}

/** Calls `onChange('dark' | 'light')` whenever the OS preference flips; returns the unsubscribe. */
export function watchSystemAppearance(onChange) {
	const media = darkSchemeMedia();
	if (!media) return () => {};
	const handler = (event) => onChange(event.matches ? 'dark' : 'light');
	media.addEventListener('change', handler);
	return () => media.removeEventListener('change', handler);
}

export function isDarkAppearance(scheme) {
	return scheme === 'dark';
}

/** True on Windows desktop browsers (used for docs scrollbar overrides). */
export function isWindowsPlatform() {
	if (typeof navigator === 'undefined') return false;
	return /Windows/i.test(navigator.userAgent);
}
