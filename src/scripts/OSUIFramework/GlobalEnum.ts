// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.GlobalEnum {
	/**
	 * OutSystemsUI common properties
	 */
	export enum CommonPatternsProperties {
		ExtendedClass = 'ExtendedClass',
	}
	/**
	 * OutSystemsUI patterns names
	 * Note: Can be used for logging purposes
	 */
	export enum PatternsNames {
		Accordion = 'Accordion',
		AccordionItem = 'Accordion Item',
		AnimatedLabel = 'Animated Label',
		ButtonLoading = 'ButtonLoading',
		Carousel = 'Carousel',
		FlipContent = 'Flip Content',
		FloatingActions = 'Floating Actions',
		FloatingActionsItem = 'Floating Actions Item',
		Gallery = 'Gallery',
		Notification = 'Notification',
		ProgressBar = 'Progress Bar',
		ProgressCircle = 'Progress Circle',
		Rating = 'Rating',
		RangeSlider = 'Range Slider',
		RangeSliderInterval = 'Range Slider Interval',
		Search = 'Search',
		SectionIndex = 'Section Index',
		Sidebar = 'Sidebar',
		Submenu = 'Submenu',
		Tooltip = 'Tooltip',
	}

	/**
	 * OutSystemsUI position cssClasses
	 */
	export enum CssClassPosition {
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
	 * OutSystemsUI Data Blocks attribute values
	 */
	export enum DataBlocksTag {
		DataBlock = '[data-block]',
		Input = '[data-input]',
		Label = '[data-label]',
		TextArea = '[data-textarea]',
	}

	/**
	 * OutSystemsUI Direction options
	 */
	export enum Direction {
		Left = 'left',
		LTR = 'ltr',
		Right = 'right',
		RTL = 'rtl',
	}

	/**
	 * OutSystemsUI HTML Elements
	 */
	export enum HTMLElement {
		FieldSet = 'fieldset',
		Input = 'input',
		Link = 'a',
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
		MouseEnter = 'mouseenter',
		MouseLeave = 'mouseleave',
		TouchEnd = 'touchend',
		TouchMove = 'touchmove',
		TouchStart = 'touchstart',
		TransitionEnd = 'transitionend',
	}

	/**
	 * OutSystemsUI event Keycodes
	 */
	export enum Keycodes {
		Escape = 'Escape',
		Enter = 'Enter',
		Tab = 'Tab',
		Shift = 'Shift',
		Space = ' ',
	}

	/**
	 * OutSystems mobile operating systems
	 */
	export enum MobileOS {
		Android = 'android',
		IOS = 'ios',
	}

	/**
	 * OutSystemsUI Orientation options
	 */
	export enum Orientation {
		Horizontal = 'horizontal',
		Vertical = 'vertical',
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
	 * OutSystemsUI Units
	 */
	export enum Units {
		Percentage = '%',
		Pixel = 'px',
	}
}
