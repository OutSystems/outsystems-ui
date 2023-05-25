// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Feature.Balloon.Enum {
	/**
	 * Balloon Enum CSS Classes
	 */
	export enum CssClasses {
		IsOpen = 'osui-balloon--is-open',
		Pattern = 'osui-balloon',
	}

	/**
	 * Balloon Enum CSS Variables
	 */
	export enum CssCustomProperties {
		Shape = '--osui-balloon-shape',
	}

	/**
	 * Balloon Enum events
	 */
	export enum Events {
		Initialized = 'Initialized',
		OnToggle = 'OnToggle',
	}

	/**
	 * Balloon Enum Properties
	 */
	export enum Properties {
		AnchorId = 'AnchorId',
		BalloonPosition = 'BalloonPosition',
		BalloonShape = 'BalloonShape',
	}
}
