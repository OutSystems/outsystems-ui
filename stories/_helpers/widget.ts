/**
 * Harness for the OutSystems platform **Widgets** — React components from
 * `@outsystems/runtime-widgets-js` (a different stack from the OUI patterns).
 *
 * These are NOT plain React components: they're wrapped in the `withWidget` HOC
 * and expect runtime objects (`DataTypes.IVariable`, a `WidgetIdService`, a
 * record provider, …). Their own `.spec.tsx` tests render them in isolation by
 * passing those as props with `jest-mock-extended`'s `mock()`. We reproduce that
 * here with a Proxy-based `runtimeMock()` (no jest needed) + a real
 * `Model.Variable`, then mount with React 19's `createRoot`.
 *
 * We use `createElement` (not JSX) so the html-vite Storybook needs no JSX config.
 * The widgets pin React **17** (which `npm` resolves for the whole tree), so we
 * mount with `ReactDOM.render` (React 17) rather than 18's `createRoot`.
 */
import { createElement, type ComponentType } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { DataTypes, Model } from '@outsystems/runtime-core-js';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * A stand-in for `jest-mock-extended`'s `mock<T>()`: any property access returns
 * a chainable function/proxy, so deep runtime-interface calls
 * (`provider.getRecord().generationNode.addChild()`) don't blow up. `overrides`
 * supplies concrete returns where a widget actually reads a value.
 */
export function runtimeMock(overrides: Record<string, any> = {}): any {
	const cache = new Map<PropertyKey, any>();
	const handler: ProxyHandler<any> = {
		get(_t, prop) {
			if (prop === Symbol.toPrimitive) return () => '';
			if (prop === 'then') return undefined; // not a thenable
			if (Object.prototype.hasOwnProperty.call(overrides, prop)) return overrides[prop as string];
			if (!cache.has(prop)) {
				const fn: any = () => runtimeMock();
				cache.set(prop, new Proxy(fn, handler));
			}
			return cache.get(prop);
		},
	};
	return new Proxy(function () {} as any, handler);
}

/** Build a runtime Variable (what widgets bind their value to). */
export function createVariable<T>(dataType: any, value: T, setter: (v: T) => void = () => {}): DataTypes.IVariable<T> {
	return new Model.Variable<T>(dataType, value, setter, runtimeMock());
}

/** Common framework-internal props every widget needs (`_idProps`, record provider). */
export function widgetBaseProps(name: string, id = ''): Record<string, any> {
	return {
		_idProps: { service: runtimeMock({ getId: () => id }), name },
		_widgetRecordProvider: runtimeMock(),
		enabled: true,
		visible: true,
	};
}

const _hosts: HTMLElement[] = [];
function flushRoots(): void {
	while (_hosts.length) {
		try {
			unmountComponentAtNode(_hosts.pop()!);
		} catch {
			/* already unmounted */
		}
	}
}

/** Mount an arbitrary React element (use for rows of widgets / wrappers like MemoryRouter). */
export function mountTree(element: any): HTMLElement {
	flushRoots();
	const host = document.createElement('div');
	host.className = 'osui-story-root';
	_hosts.push(host);
	try {
		render(element, host);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('[osui widget mount]', err);
		host.innerHTML = `<pre style="color:#b00020;white-space:pre-wrap;font:12px/1.4 monospace">Widget mount failed:\n${(err as Error)?.stack ?? err}</pre>`;
	}
	return host;
}

/** Storybook `render`: mount a single widget React component into an `.osui-story-root` div. */
export function mountWidget(component: ComponentType<any>, props: Record<string, any>): HTMLElement {
	flushRoots();
	const host = document.createElement('div');
	host.className = 'osui-story-root';
	_hosts.push(host);
	try {
		render(createElement(component, props), host);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('[osui widget mount]', err);
		host.innerHTML = `<pre style="color:#b00020;white-space:pre-wrap;font:12px/1.4 monospace">Widget mount failed:\n${(err as Error)?.stack ?? err}</pre>`;
	}
	return host;
}

/** Re-exports so stories don't need extra imports. */
export { DataTypes, createElement };
