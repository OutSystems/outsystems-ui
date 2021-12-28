// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.GlobalEnum {
	/**
	 * OutSystemsUI common properties
	 */
	export enum CommonPatternsProperties {
		ExtendedClass = 'ExtendedClass',
	}

	/**
	 * OutSystemsUI elements cssClasses
	 */
	export enum CssClassElements {
		List = 'list',
	}

	/**
	 * OutSystemsUI position cssClasses and identifiers of position
	 */
	export enum Position {
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
	 * OutSystemsUI elements CSS properties
	 */
	export enum CssProperties {
		None = 'none',
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
	 * OutSystemsUI Scroll Options
	 */
	export enum ScrollBehavior {
		Instant = 'auto',
		Smooth = 'smooth',
	}

	/**
	 * OutSystemsUI HTML Attributes
	 */
	export enum HTMLAttributes {
		DataInput = 'data-input',
		Id = 'id',
		Style = 'style',
	}

	/**
	 * OutSystemsUI HTML Elements
	 */
	export enum HTMLElement {
		Div = 'div',
		FieldSet = 'fieldset',
		Input = 'input',
		Link = 'a',
		Span = 'span',
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
		Resize = 'resize',
		TouchEnd = 'touchend',
		TouchMove = 'touchmove',
		TouchStart = 'touchstart',
		TransitionEnd = 'transitionend',
	}

	/**
	 * OutSystemsUI elements inline styles
	 */
	export enum InlineStyle {
		Display = 'display',
		Height = 'height',
		Opacity = 'opacity',
		PointerEvents = 'pointerEvents',
		Transform = 'transform',
	}

	/**
	 * OutSystems UI inline style properties.
	 */
	//TODO: if more properties appear here, let's consider using https://css-tricks.com/css-in-typescript-with-vanilla-extract/
	export const InlineStyleValue = {
		Display: {
			block: 'block',
			inline: 'inline',
			none: 'none',
			unset: '',
		},
	};

	/**
	 * OutSystemsUI event Keycodes
	 */
	export enum Keycodes {
		ArrowRight = 'ArrowRight',
		ArrowLeft = 'ArrowLeft',
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
		MacOS = 'osx',
		Unknown = 'unknown',
		Windows = 'windows',
	}

	/**
	 * OutSystemsUI Orientation options
	 */
	export enum Orientation {
		Horizontal = 'horizontal',
		Vertical = 'vertical',
	}

	//TODO: change the name of the enum to singular? PatternName or PatternsName
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
		Datepicker = 'Datepicker',
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
		SwipeEvents = 'SwipeEvents',
		Tabs = 'Tabs',
		TabsHeaderItem = 'TabsHeaderItem',
		TabsContentItem = 'TabsContentItem',
		Tooltip = 'Tooltip',
		TouchEvents = 'TouchEvents',
	}

	/**
	 * OutSystemsUI Units
	 */
	export enum Screen {
		Active = 'active-screen',
		Container = 'screen-container',
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

	export enum Browser {
		chrome = 'chrome',
		edge = 'edge',
		firefox = 'firefox',
		ie = 'ie',
		kindle = 'kindle',
		miui = 'miui',
		opera = 'opera',
		safari = 'safari',
		samsung = 'samsung',
		uc = 'uc',
		unknown = 'unknown',
		yandex = 'yandex',
	}

	export enum DeviceOrientation {
		landscape = 'landscape',
		portrait = 'portrait',
		unknown = 'unknown',
	}

	export enum DeviceType {
		desktop = 'desktop',
		phone = 'phone',
		tablet = 'tablet',
	}
}
