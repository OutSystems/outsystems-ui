// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper {
	/**
	 * Normalizes the configs argument every public Create function receives.
	 *
	 * The OutSystems platform passes the pattern configuration as a JSON string. TypeScript callers,
	 * Storybook stories and generated code may pass a plain object instead, so both are accepted and
	 * a JSON string keeps exactly the JSON.parse behavior it always had.
	 *
	 * Only plain objects are accepted (prototype Object.prototype or null): the Config classes read
	 * the configs with for...in, so a class instance or an Object.create(...) value would leak its
	 * inherited enumerable properties into the configuration. The prototype is checked by shape, not
	 * by identity, so an object created in another realm (an iframe) still counts as plain: it must
	 * be null, or a root prototype (itself without a prototype) that exposes no enumerable keys.
	 *
	 * @param configs JSON string or plain object with the pattern configuration
	 * @returns The configuration object handed to the pattern's Config class
	 */
	export function ParseConfigs(configs: string | Record<string, unknown>): JSON {
		if (typeof configs === 'string') {
			return JSON.parse(configs);
		}

		if (configs === null || typeof configs !== 'object' || Array.isArray(configs)) {
			throw new Error(
				`Invalid configs: expected a JSON string or an object, got ${configs === null ? 'null' : typeof configs}.`
			);
		}

		const proto = Object.getPrototypeOf(configs);
		if (proto !== null && (Object.getPrototypeOf(proto) !== null || Object.keys(proto).length > 0)) {
			throw new Error('Invalid configs: expected a JSON string or a plain object, got an object with a prototype.');
		}

		return configs as unknown as JSON;
	}
}
