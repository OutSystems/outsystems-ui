// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.GlobalEnum {
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
		DarkMode = 'os-dark-mode',
		DeprecatedSubmenu = 'submenu',
		Footer = 'footer',
		Header = 'header',
		HeaderHideOnScroll = 'hide-header-on-scroll',
		HeaderIsFixed = 'fixed-header',
		HeaderIsVisible = 'header-is--visible',
		HeaderTopContent = 'header-top-content',
		HighContrast = 'os-high-contrast',
		InputNotValid = 'not-valid',
		IsTouch = 'is--touch',
		Layout = 'layout',
		LayoutNative = 'layout-native',
		LayoutSide = 'layout-side',
		LayoutTop = 'layout-top',
		List = 'list',
		LoginPassword = 'login-password',
		MainContent = 'main-content',
		MenuLinks = 'app-menu-links',
		Placeholder = 'ph',
		Popup = 'popup-dialog',
		SkipContent = 'skip-nav',
	}

	/**
	 * OutSystemsUI css selectors
	 */
	export enum CSSSelectors {
		InputFormControl = 'input.form-control',
		IosBounceScroll = 'ios .ios-bounce:not(.hide-header-on-scroll) .content',
		LayoutNativeHeader = 'layout-native:not(.hide-header-on-scroll) .header',
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

	export enum FloatingAlignment {
		Center = 'center',
		End = 'end',
		Start = 'start',
	}

	export enum FloatingPosition {
		Auto = 'auto',
		Bottom = 'bottom',
		BottomEnd = 'bottom-end',
		BottomStart = 'bottom-start',
		Center = 'center',
		Left = 'left',
		LeftEnd = 'left-end',
		LeftStart = 'left-start',
		Right = 'right',
		RightEnd = 'right-end',
		RightStart = 'right-start',
		Top = 'top',
		TopEnd = 'top-end',
		TopStart = 'top-start',
	}

	/**
	 * OutSystemsUI elements CSS properties
	 */
	export enum CssProperties {
		Auto = 'auto',
		Initial = 'initial',
		MaxContent = 'max-content',
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
	 * OutSystemsUI Scroll Behavior Options
	 */
	export enum ScrollBehavior {
		Auto = 'auto',
		Instant = 'instant',
		Smooth = 'smooth',
	}

	/**
	 * OutSystemsUI Scroll Position Options
	 */
	export enum ScrollPositionBehavior {
		Start = 'start',
		Center = 'center',
		End = 'end',
		Nearest = 'nearest',
	}

	/**
	 * OutSystemsUI HTML Attributes
	 */
	export enum HTMLAttributes {
		AllowEventPropagation = '[data-allow-event-propagation=true], [data-allow-event-propagation=True]',
		Class = 'class',
		DataInput = 'data-input',
		Disabled = 'disabled',
		For = 'for',
		Href = 'href',
		Id = 'id',
		Name = 'name',
		StatusBar = 'data-status-bar-height',
		Style = 'style',
		Type = 'type',
		Value = 'value',
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
		Label = 'label',
		Link = 'a',
		Radio = 'radio',
		Span = 'span',
	}

	/**
	 * OutSystemsUI HTML Events
	 */
	export enum HTMLEvent {
		AnimationEnd = 'animationend',
		AnimationStart = 'animationstart',
		Blur = 'blur',
		Change = 'change',
		Click = 'click',
		Focus = 'focus',
		keyDown = 'keydown',
		MouseDown = 'mousedown',
		MouseEnter = 'mouseenter',
		MouseLeave = 'mouseleave',
		MouseUp = 'mouseup',
		OrientationChange = 'orientationchange',
		Prefix = 'on',
		Resize = 'resize',
		Scroll = 'scroll',
		ScrollEnd = 'scrollend',
		TouchEnd = 'touchend',
		TouchMove = 'touchmove',
		TouchStart = 'touchstart',
		TransitionEnd = 'transitionend',
		Message = 'message',
	}

	/**
	 * OutSystemsUI Custom Events
	 */
	export enum CustomEvent {
		BalloonOnToggle = 'balloon.onToggle',
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
			contents: 'contents',
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
		End = 'End',
		Enter = 'Enter',
		Escape = 'Escape',
		Home = 'Home',
		PageDown = 'PageDown',
		PageUp = 'PageUp',
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
		Balloon = 'Balloon',
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
		InlineSvg = 'InlineSVG',
		MonthPicker = 'MonthPicker',
		Notification = 'Notification',
		OverflowMenu = 'OverflowMenu',
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
		TabsContentItem = 'TabsContentItem',
		TabsHeaderItem = 'TabsHeaderItem',
		Timepicker = 'Timepicker',
		Tooltip = 'Tooltip',
		TouchEvents = 'TouchEvents',
		Video = 'Video',
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
		Password = 'password',
		Text = 'text',
		Time = 'time',
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

	/**
	 * Events available for all provider based patterns.
	 *
	 * @export
	 * @enum {number}
	 */
	export enum ProviderEvents {
		Initialized = 'Initialized',
		OnProviderConfigsApplied = 'OnProviderConfigsApplied',
	}

	export enum SVGHelperConstants {
		DOMType = 'image/svg+xml',
		ParserError = 'parsererror',
		SVG = 'svg',
	}

	export enum Time {
		HourInSeconds = 3600,
		MinuteInSeconds = 60,
	}
}
