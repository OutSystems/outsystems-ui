// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Helper.SharedState {
	/**
	 * The slot the bundle prologue publishes for one major under `window.__osLibs.osui.majors[<major>]`.
	 */
	export interface IMajorSlot {
		/** Module-level state shared by every copy of this major, keyed by a stable string. */
		state: Record<string, unknown>;
		/** The revision whose code currently serves the page. */
		version: string;
	}

	/**
	 * The part of `window` the bundle prologue writes.
	 */
	interface IOsLibsHost {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		__osLibs?: { osui?: { majors?: Record<string, IMajorSlot> } };
	}

	/**
	 * Returns the shared slot of the running major, or undefined when the bundle was loaded without the prologue.
	 *
	 * @returns the slot of the running major, or undefined
	 */
	function _getSlot(): IMajorSlot | undefined {
		const major = Constants.OSUIVersion.split('.')[0];
		const host = window as unknown as IOsLibsHost;

		return host.__osLibs?.osui?.majors?.[major];
	}

	/**
	 * Returns the value stored under `key` for the running major, creating it once with `factory`.
	 * A second copy of the same major reads the value the first copy created instead of resetting it.
	 * Each key is a stable contract within a major: renaming one is a breaking change.
	 *
	 * @param key The stable name of the shared value
	 * @param factory Creates the value when no copy of this major has stored it yet
	 * @returns the shared value, or a fresh one when the bundle was loaded without the prologue
	 */
	export function Get<T>(key: string, factory: () => T): T {
		const slot = _getSlot();

		// Bundle loaded without the prologue (Storybook, tests, today's build): behave exactly as before.
		if (slot === undefined) {
			return factory();
		}

		if (!(key in slot.state)) {
			slot.state[key] = factory();
		}

		return slot.state[key] as T;
	}
}
