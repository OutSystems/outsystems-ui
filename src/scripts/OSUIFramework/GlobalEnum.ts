// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.GlobalEnum {
	/**
	 * OutSystemsUI common properties
	 */
	export enum CommonPatternsProperties {
		ExtendedClass = 'ExtendedClass',
	}

	/**
	 * OutSystemsUI Data Blocks attribute values
	 *
	 * @export
	 * @enum {number}
	 */
	export enum DataBlocksTag {
		DataBlock = '[data-block]',
		Input = '[data-input]',
		Label = '[data-label]',
		TextArea = '[data-textarea]',
	}

	/**
	 * OutSystemsUI position cssClasses
	 *
	 * @export
	 * @enum {number}
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

	export enum HTMLEvent {
		AnimationEnd = 'animationend',
		AnimationStart = 'animationstart',
		Blur = 'blur',
		Click = 'click',
		Focus = 'focus',
		TouchEnd = 'touchend',
		TouchMove = 'touchmove',
		TouchStart = 'touchstart',
		TransitionEnd = 'transitionend',
	}

	export enum HTMLElement {
		FieldSet = 'fieldset',
		Input = 'input',
	}
}
