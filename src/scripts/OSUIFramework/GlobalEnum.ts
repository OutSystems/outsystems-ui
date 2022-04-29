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
		AcessibilityStyleTag = 'acessibility-style-tag',
		AsideExpandable = 'aside-expandable',
		Header = 'header',
		HeaderHideOnScroll = 'hide-header-on-scroll',
		HeaderIsFixed = 'fixed-header',
		HeaderIsVisible = 'header-is--visible',
		Layout = 'layout',
		LayoutNative = 'layout-native',
		List = 'list',
		MainContent = 'main-content',
		Content = 'content',
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
		PaddingTop = 'padding-top',
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
		Bottom = 'bottom',
		Left = 'left',
		LTR = 'ltr',
		Right = 'right',
		RTL = 'rtl',
		Top = 'top',
	}

	/**
	 * OutSystemsUI Scroll Options
	 */
	export enum ScrollBehavior {
		Auto = 'auto',
		Smooth = 'smooth',
	}

	/**
	 * OutSystemsUI HTML Attributes
	 */
	export enum HTMLAttributes {
		DataInput = 'data-input',
		Disabled = 'disabled',
		Id = 'id',
		Name = 'name',
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
		Scroll = 'scroll',
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
		Left = 'left',
		Opacity = 'opacity',
		PointerEvents = 'pointerEvents',
		Top = 'top',
		Transform = 'transform',
		Width = 'width',
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
		ArrowDown = 'ArrowDown',
		ArrowLeft = 'ArrowLeft',
		ArrowRight = 'ArrowRight',
		ArrowUp = 'ArrowUp',
		Enter = 'Enter',
		Escape = 'Escape',
		Shift = 'Shift',
		ShiftTab = 'ShiftTab', // Do not exist as a keyboard key, but used to manage this behaviour
		Space = ' ',
		Tab = 'Tab',
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
		Dropdown = 'Dropdown',
		DropdownServerSideItem = 'DropdownServerSideItem',
		FlipContent = 'Flip Content',
		FloatingActions = 'Floating Actions',
		FloatingActionsItem = 'Floating Actions Item',
		Gallery = 'Gallery',
		Notification = 'Notification',
		ProgressBar = 'Progress Bar',
		ProgressCircle = 'Progress Circle',
		RangeSlider = 'Range Slider',
		RangeSliderInterval = 'Range Slider Interval',
		Rating = 'Rating',
		Search = 'Search',
		SectionIndex = 'Section Index',
		SectionIndexItem = 'Section Index Item',
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
