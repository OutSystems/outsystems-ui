// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.InlineSvg {
	/**
	 * Defines the interface for OutSystemsUI InlineSvg Pattern
	 */
	export interface IInlineSvg extends Interface.IPattern {
		registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
	}
}
