/**
 * App-wide Storybook appearance: the manager chrome and the docs pages (NOT the pattern
 * dark theme, which is the preview's "Appearance" toolbar global / `.os-dark-theme`).
 *
 * The preference is `light`, `dark` or `system` (the default). It lives in localStorage,
 * which the manager and the preview iframe share (same origin), so it survives reloads
 * and direct iframe URLs. `system` resolves through `prefers-color-scheme` and follows it
 * live. The manager owns the switch and broadcasts each change on the channel
 * (`CH_APP_APPEARANCE`, payload `{ preference, scheme }`); the preview applies it.
 */
export const CH_APP_APPEARANCE = 'osui/storybook-appearance';
export const STORAGE_KEY = 'osui-storybook-appearance';
export const APPEARANCE_PREFERENCES = ['light', 'dark', 'system'];
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

/** The stored preference, `'system'` when nothing (or something unknown) is stored. */
export function readAppearancePreference() {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return APPEARANCE_PREFERENCES.includes(stored) ? stored : 'system';
	} catch {
		return 'system';
	}
}

export function storeAppearancePreference(preference) {
	try {
		localStorage.setItem(STORAGE_KEY, preference);
	} catch {
		/* private mode / blocked storage: the preference just does not persist */
	}
}

/** The scheme to show for a preference: the preference itself, or the OS one for `system`. */
export function resolveAppearance(preference = readAppearancePreference()) {
	return preference === 'system' ? readSystemAppearance() : preference;
}

/** Calls `onChange(scheme)` when the OS flips while the preference is `system`; returns the unsubscribe. */
export function watchAppearance(onChange) {
	return watchSystemAppearance((scheme) => {
		if (readAppearancePreference() === 'system') onChange(scheme);
	});
}

export function isDarkAppearance(scheme) {
	return scheme === 'dark';
}

/** True on Windows desktop browsers (used for docs scrollbar overrides). */
export function isWindowsPlatform() {
	if (typeof navigator === 'undefined') return false;
	return /Windows/i.test(navigator.userAgent);
}
