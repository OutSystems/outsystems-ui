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
import { cloneElement, createElement, useLayoutEffect, useReducer, type ComponentType } from 'react';
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

/**
 * Build a runtime Variable (what widgets bind their value to).
 *
 * Widgets like Checkbox / Switch / RadioGroup are *controlled*: they render
 * `checked={variable.value}` and, on interaction, assign `variable.value = next`.
 * But `Model.Variable`'s `set value` only delegates to `this.setter(converted)`
 * and `this.model.flush()` — it never writes `_value` itself. On the real
 * platform the runtime re-creates the variable with the new value and re-renders;
 * here there is no runtime, so without help the value never persists and the
 * widget snaps back to its initial state.
 *
 * We bridge that: the setter persists the converted value onto `_value` (so the
 * getter the widget reads reflects it) and re-renders the active story root so
 * controlled inputs pick the new value up.
 */
export function createVariable<T>(dataType: any, value: T, setter: (v: T) => void = () => {}): DataTypes.IVariable<T> {
	const variable = new Model.Variable<T>(dataType, value, () => {}, runtimeMock());
	(variable as any).setter = (converted: T) => {
		(variable as any)._value = converted;
		setter(converted);
		_rerenderActiveRoot?.();
	};
	return variable;
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

/**
 * Re-render hook for the currently mounted story, installed by the `StoryRoot`
 * wrapper below. `createVariable`'s setter calls it after persisting a new value.
 *
 * It must drive React's OWN update path (a `forceUpdate`), not a reentrant
 * `ReactDOM.render`: the widgets are controlled inputs, and React restores a
 * controlled input's DOM value to its last-rendered value after each change
 * event. A reentrant render gets clobbered by that restore; a state update
 * scheduled from the event handler is batched and applied *before* the restore,
 * so the new value sticks. This mirrors how the platform's `model.flush()`
 * re-renders subscribed widgets.
 */
let _rerenderActiveRoot: (() => void) | null = null;

function flushRoots(): void {
	_rerenderActiveRoot = null;
	while (_hosts.length) {
		try {
			unmountComponentAtNode(_hosts.pop()!);
		} catch {
			/* already unmounted */
		}
	}
}

/**
 * Stateful wrapper that owns the story's render. It registers its bump function
 * as the active re-render hook and feeds a monotonically increasing `nonce` into
 * `factory`, which the mount helpers thread into the widget's `_dependencies`.
 *
 * Why `_dependencies`: every widget is wrapped by `withWidget` in a `React.memo`
 * whose comparator normally re-renders only when the platform's *generation node*
 * goes stale (driven by `model.flush()`). There is no generation node at a bare
 * Storybook root, and we mutate the same `variable` object in place — so prev/next
 * props are identical and the memo would bail. The comparator does, however,
 * re-render when `_dependencies` changes (`arrayShallowEquals`). Passing a fresh
 * `[nonce]` array on each bump is the supported lever to force that re-render;
 * `_dependencies` is ignored by `affectsRender` (leading `_`) and unused by the
 * widget bodies, so it has no side effects.
 */
function StoryRoot({ factory }: { factory: (nonce: number) => any }): any {
	const [nonce, bump] = useReducer((n: number) => n + 1, 0);
	useLayoutEffect(() => {
		_rerenderActiveRoot = bump as () => void;
		return () => {
			_rerenderActiveRoot = null;
		};
	}, [bump]);
	return factory(nonce);
}

/** Mount a story into a fresh `.osui-story-root`, wiring up re-rendering on variable change. */
function mountInto(factory: (nonce: number) => any): HTMLElement {
	flushRoots();
	const host = document.createElement('div');
	host.className = 'osui-story-root';
	_hosts.push(host);
	try {
		render(createElement(StoryRoot, { factory }), host);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('[osui widget mount]', err);
		host.innerHTML = `<pre style="color:#b00020;white-space:pre-wrap;font:12px/1.4 monospace">Widget mount failed:\n${(err as Error)?.stack ?? err}</pre>`;
	}
	return host;
}

/** Mount an arbitrary React element (use for rows of widgets / wrappers like MemoryRouter). */
export function mountTree(element: any): HTMLElement {
	return mountInto((nonce) => cloneElement(element, { _dependencies: [nonce] }));
}

/** Storybook `render`: mount a single widget React component into an `.osui-story-root` div. */
export function mountWidget(component: ComponentType<any>, props: Record<string, any>): HTMLElement {
	return mountInto((nonce) => createElement(component, { ...props, _dependencies: [nonce] }));
}

/** Re-exports so stories don't need extra imports. */
export { DataTypes, createElement };
