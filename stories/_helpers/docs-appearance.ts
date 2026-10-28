import {
	isDarkAppearance,
	isWindowsPlatform,
	readSystemAppearance,
	watchSystemAppearance,
} from './storybook-appearance.js';

export const APP_DARK_CLASS = 'sb-app-dark';
export const APP_WINDOWS_CLASS = 'os-windows';

export const DOCS_PAGE_SELECTOR =
	'.osui-welcome, .osui-getting-started, .osui-component-library, .osui-css-architecture, .osui-css-api-reference, .osui-theme-editor, .osui-foundations, .osui-pattern-doc';

let appearanceSyncReady = false;

export function applyDocsPlatformClass(): void {
	if (typeof document === 'undefined') return;
	document.documentElement.classList.toggle(APP_WINDOWS_CLASS, isWindowsPlatform());
}

/** App-wide docs chrome — toggles preview root + custom docs page roots. */
export function applyAppAppearance(scheme: string): void {
	const dark = isDarkAppearance(scheme);

	document.documentElement.classList.toggle(APP_DARK_CLASS, dark);
	document.querySelectorAll(DOCS_PAGE_SELECTOR).forEach((el) => {
		el.classList.toggle('docs-dark', dark);
	});
}

function nodeTouchesDocsPage(node: Node): boolean {
	if (!(node instanceof Element)) return false;
	if (node.matches(DOCS_PAGE_SELECTOR)) return true;
	return node.querySelector(DOCS_PAGE_SELECTOR) !== null;
}

function syncFromSystem(): void {
	applyAppAppearance(readSystemAppearance());
}

/**
 * MDX docs pages skip preview decorators — apply the OS colour scheme at preview boot,
 * follow it live, and re-apply whenever a docs page root is mounted (the `.docs-dark`
 * class lives on the page root, which Storybook renders after this module ran).
 */
export function initDocsAppearanceSync(): void {
	applyDocsPlatformClass();
	if (appearanceSyncReady || typeof document === 'undefined') return;
	appearanceSyncReady = true;

	watchSystemAppearance(applyAppAppearance);

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (nodeTouchesDocsPage(node)) {
					syncFromSystem();
					return;
				}
			}
		}
	});
	observer.observe(document.documentElement, { childList: true, subtree: true });

	syncFromSystem();
}
