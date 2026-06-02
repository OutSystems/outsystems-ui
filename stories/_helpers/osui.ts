/**
 * Shared harness for driving the compiled OutSystems UI library from Storybook.
 *
 * The OUI bundle (loaded as a classic script in `.storybook/preview-head.html`)
 * publishes `OutSystems.OSUI.*` and `OSFramework.OSUI.*` as window globals.
 * A pattern is brought to life exactly the way Service Studio does it at runtime:
 *
 *   1. render the HTML skeleton the pattern expects (located by `name=<id>`),
 *   2. `…Patterns.<Pattern>API.Create(id, JSON.stringify(configs))`,
 *   3. `…Patterns.<Pattern>API.Initialize(id)`  → runs the pattern's build().
 *
 * Elements are located by their `name` attribute (`getElementsByName`), and some
 * patterns also read a `widgetId` via `id`. We therefore set BOTH `id` and `name`
 * to the same unique id on each pattern root (see `osuiRoot`).
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
	interface Window {
		OutSystems: any;
		OSFramework: any;
		flatpickr: any;
		Splide: any;
		noUiSlider: any;
		VirtualSelect: any;
	}
}

/** The public pattern API surface: `OutSystems.OSUI.Patterns`. */
export const Patterns = (): any => window.OutSystems?.OSUI?.Patterns;

let _seq = 0;
/** Stable-per-render unique id. Fresh ids avoid "already registered" throws. */
export function uid(prefix = 'osui'): string {
	return `${prefix}-${(_seq++).toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Attributes every pattern root needs.
 *
 * OUT's `AbstractPattern` resolves the element by `name` (`getElementsByName`)
 * and then derives `widgetId` from `selfElement.closest('[data-block]').id`
 * (AbstractPattern.ts:42-43) — Service Studio wraps every block in a
 * `[data-block]` element. We collapse that wrapper onto the pattern root itself
 * (`closest` includes the element), so a single element satisfies all three
 * lookups: `name`, `id`, and the `[data-block]` ancestor.
 */
export function osuiRoot(id: string): string {
	return `id="${id}" name="${id}" data-block="osui"`;
}

// Teardown fns from the previous render; flushed before the next one so OUI's
// internal registry (a Map keyed by id) and global listeners don't accumulate
// across story switches / HMR.
const _teardowns: Array<() => void> = [];
function flushTeardowns(): void {
	while (_teardowns.length) {
		try {
			_teardowns.pop()!();
		} catch {
			/* instance already disposed */
		}
	}
}

export type Register = (dispose: () => void) => void;
export type InitFn = (root: HTMLElement, register: Register) => void;

/**
 * Serialize a pattern config. Injects `ExtendedClass: ''` — `AbstractPattern`
 * reads it for every pattern (`configs.ExtendedClass.split(...)`), so omitting
 * it throws. Service Studio always passes it (default empty).
 */
export function cfg(configs: Record<string, unknown> = {}): string {
	return JSON.stringify({ ExtendedClass: '', ...configs });
}

/**
 * Storybook `render` helper. Builds the container, schedules `init` for after
 * the node is mounted (the HTML renderer appends the returned node to the
 * canvas; we wait two frames so it's connected before the pattern queries it),
 * and returns the element. Disposes the previous story's instances first.
 */
export function renderPattern(template: string, init: InitFn): HTMLElement {
	flushTeardowns();

	const root = document.createElement('div');
	root.className = 'osui-story-root';
	root.innerHTML = template;

	requestAnimationFrame(() =>
		requestAnimationFrame(() => {
			if (root.isConnected) {
				try {
					init(root, (dispose) => _teardowns.push(dispose));
				} catch (err) {
					// Surface init failures inside the canvas for fast debugging.
					// eslint-disable-next-line no-console
					console.error('[osui story init]', err);
					const pre = document.createElement('pre');
					pre.style.cssText = 'color:#b00020;white-space:pre-wrap;font:12px/1.4 monospace';
					pre.textContent = `OUI init failed:\n${(err as Error)?.stack ?? err}`;
					root.prepend(pre);
				}
			}
		})
	);

	return root;
}

/**
 * Render a static, HTML/CSS-only OUI block (no JS pattern behind it — just markup
 * styled by the loaded OUI stylesheet + icon font). Returns an `.osui-story-root`
 * element so it's consistent with `renderPattern`'s container.
 */
export function renderStatic(template: string): HTMLElement {
	const root = document.createElement('div');
	root.className = 'osui-story-root';
	root.innerHTML = template;
	return root;
}

/** Create + Initialize a single pattern and register its Dispose for cleanup. */
export function createAndInit(
	apiName: string,
	id: string,
	configs: Record<string, unknown>,
	register: Register
): any {
	const api = Patterns()[apiName];
	if (!api) throw new Error(`OUI API not found: OutSystems.OSUI.Patterns.${apiName} (is the bundle loaded?)`);
	const instance = api.Create(id, cfg(configs));
	api.Initialize(id);
	register(() => api.Dispose?.(id));
	return instance;
}
