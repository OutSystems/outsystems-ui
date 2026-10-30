import { addons } from 'storybook/preview-api';
import {
	CH_APP_APPEARANCE,
	isDarkAppearance,
	isWindowsPlatform,
	resolveAppearance,
	watchAppearance,
} from './storybook-appearance.js';

export const APP_DARK_CLASS = 'sb-app-dark';
export const APP_WINDOWS_CLASS = 'os-windows';

export const DOCS_PAGE_SELECTOR =
	'.osui-welcome, .osui-getting-started, .osui-component-library, .osui-css-architecture, .osui-css-api-reference, .osui-theme-editor, .osui-foundations, .osui-pattern-doc';

let appearanceSyncReady = false;
let channelReady = false;

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

function syncAppearance(): void {
	applyAppAppearance(resolveAppearance());
}

/** The manager broadcasts the switch; the channel may not exist yet at module load. */
function wireAppearanceChannel(): void {
	if (channelReady) return;
	let channel: ReturnType<typeof addons.getChannel> | undefined;
	try {
		channel = addons.getChannel();
	} catch {
		return;
	}
	if (!channel) return;
	channelReady = true;
	channel.on(CH_APP_APPEARANCE, (next: { scheme?: string } | undefined) => {
		applyAppAppearance(next?.scheme ?? resolveAppearance());
	});
}

/**
 * MDX docs pages skip preview decorators — apply the stored preference (or the OS colour
 * scheme) at preview boot, follow the manager's switch and the OS live, and re-apply
 * whenever a docs page root is mounted (the `.docs-dark` class lives on the page root,
 * which Storybook renders after this module ran). Called again from the app-shell
 * decorator, so the channel gets wired once it exists.
 */
export function initDocsAppearanceSync(): void {
	applyDocsPlatformClass();
	wireAppearanceChannel();
	if (appearanceSyncReady || typeof document === 'undefined') return;
	appearanceSyncReady = true;

	watchAppearance(applyAppAppearance);

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (nodeTouchesDocsPage(node)) {
					syncAppearance();
					return;
				}
			}
		}
	});
	observer.observe(document.documentElement, { childList: true, subtree: true });

	syncAppearance();
}
