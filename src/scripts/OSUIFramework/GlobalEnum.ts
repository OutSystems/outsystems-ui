// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.GlobalEnum {
	/**
	 * OutSystemsUI common properties
	 */
	export enum CommonPatternsProperties {
		ExtendedClass = 'ExtendedClass',
	}

	/**
	 * OutSystemsUI Shape Types
	 */
	export enum ShapeTypes {
		Rounded = 'rounded',
		Sharp = 'none',
		SoftRounded = 'soft',
	}

	/**
	 * OutSystemsUI Data Blocks attribute values
	 */
	export enum DataBlocksTag {
		DataBlock = '[data-block]',
		Input = '[data-input]',
		Label = '[data-label]',
		TextArea = '[data-textarea]',
	}

	/**
	 * OutSystemsUI position cssClasses
	 */
	export enum OSUICssClassPosition {
		Bottom = 'bottom',
		BottomLeft = 'bottom-left',
		BottomRight = 'bottom-right',
		Center = 'center',
		Left = 'left',
		Right = 'right',
		Top = 'top',
		TopLeft = 'top-left',
		TopRight = 'top-right',
	}

	/**
	 * OutSystemsUI HTML Events
	 */
	export enum HTMLEvent {
		AnimationEnd = 'animationend',
		AnimationStart = 'animationstart',
		Blur = 'blur',
		Click = 'click',
		Focus = 'focus',
		keyDown = 'keydown',
		TouchEnd = 'touchend',
		TouchMove = 'touchmove',
		TouchStart = 'touchstart',
		TransitionEnd = 'transitionend',
	}

	/**
	 * OutSystemsUI HTML Elements
	 */
	export enum HTMLElement {
		FieldSet = 'fieldset',
		Input = 'input',
	}

	/**
	 *
	 *
	 * @export
	 * @enum {number}
	 */
	export enum Orientation {
		Horizontal = 'horizontal',
		Vertical = 'vertical',
	}

	/**
	 *
	 *
	 * @export
	 * @enum {number}
	 */
	export enum Direction {
		Left = 'left',
		Right = 'right',
	}

	/**
	 *
	 *
	 * @export
	 * @enum {number}
	 */
	export enum Keycodes {
		Tab = 'Tab',
		Escape = 'Escape',
		Enter = 'Enter',
		Space = ' ',
		Shift = 'Shift',
	}
}
