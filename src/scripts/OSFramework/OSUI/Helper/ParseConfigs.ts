// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper {
	/**
	 * Normalizes the configs argument every public Create function receives.
	 *
	 * The OutSystems platform passes the pattern configuration as a JSON string. TypeScript callers,
	 * Storybook stories and generated code may pass a plain object instead, so both are accepted and
	 * a JSON string keeps exactly the JSON.parse behavior it always had.
	 *
	 * @param configs JSON string or plain object with the pattern configuration
	 * @returns The configuration object handed to the pattern's Config class
	 */
	export function ParseConfigs(configs: string | Record<string, unknown>): JSON {
		if (typeof configs === 'string') {
			return JSON.parse(configs);
		}

		if (configs !== null && typeof configs === 'object' && Array.isArray(configs) === false) {
			return configs as unknown as JSON;
		}

		throw new Error(
			`Invalid configs: expected a JSON string or an object, got ${configs === null ? 'null' : typeof configs}.`
		);
	}
}
