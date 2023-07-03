// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/GlobalEnum.ts
namespace OSFramework.GlobalEnum {
========
namespace OSFramework.OSUI.GlobalEnum {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/GlobalEnum.ts
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
<<<<<<<< HEAD:src/scripts/OSFramework/GlobalEnum.ts
========
		DeprecatedSubmenu = 'submenu',
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/GlobalEnum.ts
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
<<<<<<<< HEAD:src/scripts/OSFramework/GlobalEnum.ts
========
		InputNotValid = 'not-valid',
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/GlobalEnum.ts
	}

	/**
	 * OutSystemsUI css selectors
	 */
	export enum CSSSelectors {
		InputFormControl = 'input.form-control',
<<<<<<<< HEAD:src/scripts/OSFramework/GlobalEnum.ts
========
		IosBounceScroll = 'ios .ios-bounce:not(.hide-header-on-scroll) .content',
		LayoutNativeHeader = 'layout-native:not(.hide-header-on-scroll) .header',
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/GlobalEnum.ts
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
		Auto = 'auto',
		Initial = 'initial',
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
<<<<<<<< HEAD:src/scripts/OSFramework/GlobalEnum.ts
========
		DDD = 'DDD',
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/GlobalEnum.ts
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
<<<<<<<< HEAD:src/scripts/OSFramework/GlobalEnum.ts
		AllowEventPropagation = '[data-allow-event-propagation=true]',
========
		AllowEventPropagation = '[data-allow-event-propagation=true], [data-allow-event-propagation=True]',
		Class = 'class',
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/GlobalEnum.ts
		DataInput = 'data-input',
		Disabled = 'disabled',
		Id = 'id',
		Name = 'name',
		StatusBar = 'data-status-bar-height',
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
		MouseDown = 'mousedown',
		MouseEnter = 'mouseenter',
		MouseLeave = 'mouseleave',
<<<<<<<< HEAD:src/scripts/OSFramework/GlobalEnum.ts
		OrientationChange = 'orientationchange',
========
		MouseUp = 'mouseup',
		OrientationChange = 'orientationchange',
		Prefix = 'on',
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/GlobalEnum.ts
		Resize = 'resize',
		Scroll = 'scroll',
		TouchEnd = 'touchend',
		TouchMove = 'touchmove',
		TouchStart = 'touchstart',
		TransitionEnd = 'transitionend',
		Message = 'message',
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
<<<<<<<< HEAD:src/scripts/OSFramework/GlobalEnum.ts
========
		InlineSvg = 'InlineSVG',
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/GlobalEnum.ts
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
<<<<<<<< HEAD:src/scripts/OSFramework/GlobalEnum.ts
	 * OutSystemsUI Input Types
	 */
	export enum InputTypes {
========
	 * OutSystemsUI Input Class Types
	 */
	export enum InputClassTypes {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/GlobalEnum.ts
		InputLarge = 'input-large',
		InputSmall = 'input-small',
	}

	/**
<<<<<<<< HEAD:src/scripts/OSFramework/GlobalEnum.ts
========
	 * OutSystemsUI Input attribute values Types
	 */
	export enum InputTypeAttr {
		Date = 'date',
		DateTime = 'date-time-edit',
		Text = 'text',
		Time = 'time',
	}

	/**
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/GlobalEnum.ts
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
<<<<<<<< HEAD:src/scripts/OSFramework/GlobalEnum.ts
========
		MethodNotImplemented = 'This Method has no implementation on the context of this pattern.',
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/GlobalEnum.ts
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
<<<<<<<< HEAD:src/scripts/OSFramework/GlobalEnum.ts
========

	export enum SVGHelperConstants {
		DOMType = 'image/svg+xml',
		ParserError = 'parsererror',
		SVG = 'svg',
	}
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/GlobalEnum.ts
}
