// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.BottomSheet.Enum {
	/**
	 * BottomSheet Enum for CSS Classes
	 */
	export enum CssClass {
		HasHandler = 'osui-bottom-sheet--has-handler',
		HasSCroll = 'osui-bottom-sheet--has-scroll',
		IsOpen = 'osui-bottom-sheet--is-open',
		IsActive = 'osui-bottom-sheet--is-active',
		PatternContent = 'osui-bottom-sheet__content',
		PatternHeader = 'osui-bottom-sheet__header',
		PatternOverlay = 'osui-bottom-sheet-overlay',
		PatternTopBar = 'osui-bottom-sheet__header__top-bar',
	}

	export enum CssCustomProperties {
		Shape = '--bottom-sheet-shape',
	}

	/**
	 * BottomSheet Events
	 */
	export enum Events {
		Open = 'Open',
	}

	/**
	 * BottomSheet Enum properties
	 */
	export enum Properties {
		Shape = 'Shape',
		ShowHandler = 'ShowHandler',
	}
}
