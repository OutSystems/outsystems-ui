// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.GlobalEnum {
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
		ActiveScreen = 'active-screen',
		AsideExpandable = 'aside-expandable',
		Container = 'screen-container',
		Content = 'content',
		Footer = 'footer',
		Header = 'header',
		HeaderHideOnScroll = 'hide-header-on-scroll',
		HeaderIsFixed = 'fixed-header',
		HeaderIsVisible = 'header-is--visible',
		HeaderTopContent = 'header-top-content',
		IsTouch = 'is--touch',
		Layout = 'layout',
		LayoutNative = 'layout-native',
		LayoutSide = 'layout-side',
		LayoutTop = 'layout-top',
		List = 'list',
		MainContent = 'main-content',
		MenuLinks = 'app-menu-links',
		Placeholder = 'ph',
	}

	/**
	 * OutSystemsUI css selectors
	 */
	export enum CSSSelectors {
		InputFormControl = 'input.form-control',
	}

	/**
	 * OutSystemsUI common css variables
	 */
	export enum CSSVariables {
		FooterHeight = '--footer-height',
		HeaderContentHeight = '--header-size-content',
		OverlayOpacity = '--overlay-opacity',
		ViewportHeight = '--viewport-height',
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
		Auto = 'auto',
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
	 * OutSystemsUI Date Format values
	 */
	export enum DateFormat {
		D = 'D',
		d = 'd',
		DD = 'DD',
		DDD = 'DDD',
		M = 'M',
		m = 'm',
		MM = 'MM',
		MMM = 'MMM',
		Y = 'Y',
		y = 'y',
		YY = 'YY',
		YYY = 'YYY',
		YYYY = 'YYYY',
	}

	/**
	 * OutSystemsUI Direction options
	 */
	export enum Direction {
		Bottom = 'bottom',
		Down = 'down',
		Left = 'left',
		LTR = 'ltr',
		None = '',
		Right = 'right',
		RTL = 'rtl',
		Top = 'top',
		TTB = 'ttb',
		Up = 'up',
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
		AllowEventPropagation = '[data-allow-event-propagation=true]',
		DataInput = 'data-input',
		Disabled = 'disabled',
		Id = 'id',
		Name = 'name',
		Style = 'style',
		type = 'type',
	}

	/**
	 * OutSystemsUI HTML Elements
	 */
	export enum HTMLElement {
		Body = 'body',
		Button = 'button',
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
		MouseUp = 'mouseup',
		OrientationChange = 'orientationchange',
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
	 * OutSystemsUI KeyframesEffect options
	 */
	export enum KeyframesEffectOptions {
		EasingLinear = 'linear',
		FillBoth = 'both',
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
		None = '',
		Vertical = 'vertical',
	}

	/**
	 * OutSystemsUI patterns names
	 * Note: Can be used for logging purposes
	 */
	export enum PatternName {
		Accordion = 'Accordion',
		AccordionItem = 'Accordion Item',
		AnimatedLabel = 'Animated Label',
		BottomSheet = 'Bottom Sheet',
		ButtonLoading = 'ButtonLoading',
		Carousel = 'Carousel',
		Datepicker = 'Datepicker',
		Dropdown = 'Dropdown',
		DropdownServerSideItem = 'DropdownServerSideItem',
		FlipContent = 'Flip Content',
		FloatingActions = 'Floating Actions',
		FloatingActionsItem = 'Floating Actions Item',
		Gallery = 'Gallery',
		MonthPicker = 'MonthPicker',
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
		Timepicker = 'Timepicker',
		Tooltip = 'Tooltip',
		TouchEvents = 'TouchEvents',
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
	 * OutSystemsUI Input Class Types
	 */
	export enum InputClassTypes {
		InputLarge = 'input-large',
		InputSmall = 'input-small',
	}

	/**
	 * OutSystemsUI Input attribute values Types
	 */
	export enum InputTypeAttr {
		Date = 'date',
		DateTime = 'date-time-edit',
		Text = 'text',
	}

	/**
	 * OutSystemsUI Units
	 */
	export enum Units {
		Percentage = '%',
		Pixel = 'px',
		Em = 'em',
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

	export enum NotchClasses {
		IPhoneX = 'iphonex',
	}

	export enum FocusTrapClasses {
		FocusTrapBottom = 'focus-trap-bottom',
		FocusTrapTop = 'focus-trap-top',
	}

	export enum WarningMessages {
		FeatureNotImplemented = 'This feature is not yet implemented!',
		MethodNotImplemented = 'This Method has no implementation on the context of this pattern.',
	}

	export enum NullValues {
		Time = '00:00:00',
	}
}
