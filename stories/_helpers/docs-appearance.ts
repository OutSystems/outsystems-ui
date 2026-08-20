import { addons } from 'storybook/preview-api';
import {
	CH_APP_APPEARANCE,
	isDarkAppearance,
	isWindowsPlatform,
	readStoredAppearance,
} from './storybook-appearance.js';

export const APP_DARK_CLASS = 'sb-app-dark';
export const APP_WINDOWS_CLASS = 'os-windows';

export const DOCS_PAGE_SELECTOR =
	'.osui-welcome, .osui-getting-started, .osui-component-library, .osui-css-architecture, .osui-css-api-reference, .osui-theme-editor';

let currentScheme = readStoredAppearance();
let appearanceSyncReady = false;

export function applyDocsPlatformClass(): void {
	if (typeof document === 'undefined') return;
	document.documentElement.classList.toggle(APP_WINDOWS_CLASS, isWindowsPlatform());
}

/** App-wide docs chrome — toggles preview root + custom docs page roots. */
export function applyAppAppearance(scheme: string): void {
	const normalized = isDarkAppearance(scheme) ? 'dark' : 'light';
	currentScheme = normalized;
	const dark = normalized === 'dark';

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

function syncFromStorage(): void {
	applyAppAppearance(readStoredAppearance());
}

function wireAppAppearanceChannel(): boolean {
	let channel;
	try {
		channel = addons.getChannel();
	} catch {
		return false;
	}
	if (!channel) return false;

	channel.on(CH_APP_APPEARANCE, syncFromStorage);

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (nodeTouchesDocsPage(node)) {
					syncFromStorage();
					return;
				}
			}
		}
	});
	observer.observe(document.documentElement, { childList: true, subtree: true });

	syncFromStorage();
	return true;
}

/** MDX docs pages skip preview decorators — wire manager appearance sync at preview boot. */
export function initDocsAppearanceSync(): void {
	applyDocsPlatformClass();
	if (appearanceSyncReady) return;
	if (wireAppAppearanceChannel()) {
		appearanceSyncReady = true;
		return;
	}
	if (typeof document !== 'undefined') {
		document.addEventListener('DOMContentLoaded', () => initDocsAppearanceSync(), { once: true });
	}
}
