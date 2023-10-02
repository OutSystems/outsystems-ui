declare namespace osui {
    function GetVersion(): string;
    function ToggleClass(el: HTMLElement, state: unknown, className: string): void;
    function GetClosest(elem: HTMLElement, selector: string): unknown;
    function FixInputs(): void;
    function HasMasterDetail(): boolean;
    function HideOnScroll(): unknown;
}
declare namespace OSFramework.OSUI.Constants {
    const A11YAttributes: {
        Aria: {
            Atomic: string;
            Busy: string;
            Controls: string;
            Describedby: string;
            Disabled: string;
            Expanded: string;
            Haspopup: string;
            Hidden: string;
            Label: string;
            Labelledby: string;
            Multiselectable: string;
            Selected: string;
            ValueMax: string;
            ValueMin: string;
        };
        AriaLive: {
            AttrName: string;
            Assertive: string;
            Polite: string;
            Off: string;
        };
        Role: {
            Alert: string;
            AlertDialog: string;
            AttrName: string;
            Button: string;
            Complementary: string;
            Listbox: string;
            MenuItem: string;
            Option: string;
            Presentation: string;
            Progressbar: string;
            Region: string;
            Search: string;
            Tab: string;
            TabList: string;
            TabPanel: string;
            Tooltip: string;
        };
        TabIndex: string;
        States: {
            Empty: string;
            False: string;
            TabIndexHidden: string;
            TabIndexShow: string;
            True: string;
        };
    };
    const Dot = ".";
    const Comma = ",";
    const EnableLogMessages = false;
    const EmptyString = "";
    const FocusTrapIgnoreAttr = "ignore-focus-trap";
    const FocusableElems = "a[href]:not([disabled]),[tabindex=\"0\"], button:not([disabled]), textarea:not([disabled]), input[type=\"text\"]:not([disabled]), input[type=\"radio\"]:not([disabled]), input[type=\"checkbox\"]:not([disabled]),input[type=\"submit\"]:not([disabled]), select:not([disabled])";
    const JavaScriptTypes: {
        Undefined: string;
        Boolean: string;
        Number: string;
        String: string;
        Symbol: string;
        Function: string;
        Object: string;
    };
    const JustInputs = "input:not([type=button]):not([type=checkbox]):not([type=color]):not([type=file]):not([type=hidden]):not([type=image]):not([type=image]):not([type=radio]):not([type=range]):not([type=reset]):not([type=submit]), textarea";
    const HasAccessibilityClass = "has-accessible-features";
    const InvalidNumber = -1;
    const Months: string[];
    const Language: {
        code: string;
        short: string;
    };
    const AccessibilityHideElementClass = "wcag-hide-text";
    const IsRTLClass = "is-rtl";
    const NoTransition = "no-transition";
    const OSUIVersion = "2.18.0";
    const ZeroValue = 0;
}
declare namespace OSFramework.OSUI.ErrorCodes {
    const AbstractChild: {
        FailParentNotFound: string;
    };
    const Accordion: {
        FailChildItemClicked: string;
        FailSetNewChildItem: string;
        FailToSetChildItemAction: string;
        FailUnsetNewChildItem: string;
    };
    const Dropdown: {
        FailOptionItemClicked: string;
        FailOptionItemKeyPressed: string;
        FailSetNewOptionItem: string;
        FailToSetOptionItemAction: string;
        FailUnsetNewOptionItem: string;
        HasNoImplementation: {
            code: string;
            message: string;
        };
    };
    const DropdownServerSide: {
        FailOnSetIntersectionObserver: string;
    };
    const RangeSlider: {
        FailSetValue: string;
    };
    const SectionIndex: {
        FailChildItemClicked: string;
        FailSetNewChildItem: string;
        FailToSetChildItemAction: string;
        FailUnsetNewChildItem: string;
    };
    const SectionIndexItem: {
        FailToSetTargetElement: string;
    };
    const Tooltip: {
        FailOnSetIntersectionObserver: string;
    };
    const Tabs: {
        FailChildItemClicked: string;
        FailSetNewChildContentItem: string;
        FailSetNewChildHeaderItem: string;
        FailToSetChildItemAction: string;
        FailUnsetNewChildContentItem: string;
        FailUnsetNewChildHeaderItem: string;
    };
    const AbstractParent: {
        FailChildNotFound: string;
        FailChildsNotFound: string;
        FailTypeNotFound: string;
    };
    const AbstractProviderPattern: {
        FailProviderEventHandler: string;
        FailProviderEventRemoval: {
            code: string;
            message: string;
        };
        FailProviderEventSet: {
            code: string;
            message: string;
        };
    };
    const ProviderEventsManager: {
        FailPendingEventRemoval: string;
        FailSavingPendingEvent: string;
        FailSavedEventRemoval: string;
        FailSavingEvent: string;
    };
}
declare namespace OSFramework.OSUI.GlobalCallbacks {
    type Generic = {
        (...args: unknown[]): unknown;
    };
    type OSGeneric = {
        (patternId: string, ...args: unknown[]): void;
    };
}
declare namespace OSFramework.OSUI.GlobalEnum {
    enum CommonPatternsProperties {
        ExtendedClass = "ExtendedClass"
    }
    enum CssClassElements {
        AcessibilityStyleTag = "acessibility-style-tag",
        ActiveScreen = "active-screen",
        AsideExpandable = "aside-expandable",
        Container = "screen-container",
        Content = "content",
        DeprecatedSubmenu = "submenu",
        Footer = "footer",
        Header = "header",
        HeaderHideOnScroll = "hide-header-on-scroll",
        HeaderIsFixed = "fixed-header",
        HeaderIsVisible = "header-is--visible",
        HeaderTopContent = "header-top-content",
        InputNotValid = "not-valid",
        IsTouch = "is--touch",
        Layout = "layout",
        LayoutNative = "layout-native",
        LayoutSide = "layout-side",
        LayoutTop = "layout-top",
        List = "list",
        LoginPassword = "login-password",
        MainContent = "main-content",
        MenuLinks = "app-menu-links",
        Placeholder = "ph",
        SkipContent = "skip-nav"
    }
    enum CSSSelectors {
        InputFormControl = "input.form-control",
        IosBounceScroll = "ios .ios-bounce:not(.hide-header-on-scroll) .content",
        LayoutNativeHeader = "layout-native:not(.hide-header-on-scroll) .header"
    }
    enum CSSVariables {
        FooterHeight = "--footer-height",
        HeaderContentHeight = "--header-size-content",
        OverlayOpacity = "--overlay-opacity",
        ViewportHeight = "--viewport-height"
    }
    enum Position {
        Bottom = "bottom",
        BottomLeft = "bottom-left",
        BottomRight = "bottom-right",
        Center = "center",
        Left = "left",
        Right = "right",
        Top = "top",
        TopLeft = "top-left",
        TopRight = "top-right"
    }
    enum FloatingAlignment {
        Center = "center",
        End = "end",
        Start = "start"
    }
    enum FloatingPosition {
        Auto = "auto",
        Bottom = "bottom",
        BottomEnd = "bottom-end",
        BottomStart = "bottom-start",
        Center = "center",
        Left = "left",
        LeftEnd = "left-end",
        LeftStart = "left-start",
        Right = "right",
        RightEnd = "right-end",
        RightStart = "right-start",
        Top = "top",
        TopEnd = "top-end",
        TopStart = "top-start"
    }
    enum CssProperties {
        Auto = "auto",
        Initial = "initial",
        None = "none",
        PaddingTop = "padding-top"
    }
    enum DataBlocksTag {
        DataBlock = "[data-block]",
        Input = "[data-input]",
        Label = "[data-label]",
        TextArea = "[data-textarea]"
    }
    enum DateFormat {
        D = "D",
        d = "d",
        DD = "DD",
        DDD = "DDD",
        M = "M",
        m = "m",
        MM = "MM",
        MMM = "MMM",
        Y = "Y",
        y = "y",
        YY = "YY",
        YYY = "YYY",
        YYYY = "YYYY"
    }
    enum Direction {
        Bottom = "bottom",
        Down = "down",
        Left = "left",
        LTR = "ltr",
        None = "",
        Right = "right",
        RTL = "rtl",
        Top = "top",
        TTB = "ttb",
        Up = "up"
    }
    enum ScrollBehavior {
        Auto = "auto",
        Smooth = "smooth"
    }
    enum HTMLAttributes {
        AllowEventPropagation = "[data-allow-event-propagation=true], [data-allow-event-propagation=True]",
        Class = "class",
        DataInput = "data-input",
        Disabled = "disabled",
        Href = "href",
        Id = "id",
        Name = "name",
        StatusBar = "data-status-bar-height",
        Style = "style",
        Type = "type"
    }
    enum HTMLElement {
        Body = "body",
        Button = "button",
        Div = "div",
        FieldSet = "fieldset",
        Input = "input",
        Link = "a",
        Radio = "radio",
        Span = "span"
    }
    enum HTMLEvent {
        AnimationEnd = "animationend",
        AnimationStart = "animationstart",
        Blur = "blur",
        Click = "click",
        Focus = "focus",
        keyDown = "keydown",
        MouseDown = "mousedown",
        MouseEnter = "mouseenter",
        MouseLeave = "mouseleave",
        MouseUp = "mouseup",
        OrientationChange = "orientationchange",
        Prefix = "on",
        Resize = "resize",
        Scroll = "scroll",
        TouchEnd = "touchend",
        TouchMove = "touchmove",
        TouchStart = "touchstart",
        TransitionEnd = "transitionend"
    }
    enum CustomEvent {
        BalloonOnToggle = "balloon.onToggle"
    }
    enum InlineStyle {
        Display = "display",
        Height = "height",
        Left = "left",
        Opacity = "opacity",
        PointerEvents = "pointerEvents",
        Top = "top",
        Transform = "transform",
        Width = "width"
    }
    const InlineStyleValue: {
        Display: {
            block: string;
            inline: string;
            none: string;
            unset: string;
        };
    };
    enum Keycodes {
        ArrowDown = "ArrowDown",
        ArrowLeft = "ArrowLeft",
        ArrowRight = "ArrowRight",
        ArrowUp = "ArrowUp",
        End = "End",
        Enter = "Enter",
        Escape = "Escape",
        Home = "Home",
        Shift = "Shift",
        ShiftTab = "ShiftTab",
        Space = " ",
        Tab = "Tab"
    }
    enum KeyframesEffectOptions {
        EasingLinear = "linear",
        FillBoth = "both"
    }
    enum MobileOS {
        Android = "android",
        IOS = "ios",
        MacOS = "osx",
        Unknown = "unknown",
        Windows = "windows"
    }
    enum Orientation {
        Horizontal = "horizontal",
        None = "",
        Vertical = "vertical"
    }
    enum PatternName {
        Accordion = "Accordion",
        AccordionItem = "Accordion Item",
        AnimatedLabel = "Animated Label",
        Balloon = "Balloon",
        BottomSheet = "Bottom Sheet",
        ButtonLoading = "ButtonLoading",
        Carousel = "Carousel",
        Datepicker = "Datepicker",
        Dropdown = "Dropdown",
        DropdownServerSideItem = "DropdownServerSideItem",
        FlipContent = "Flip Content",
        FloatingActions = "Floating Actions",
        FloatingActionsItem = "Floating Actions Item",
        Gallery = "Gallery",
        InlineSvg = "InlineSVG",
        MonthPicker = "MonthPicker",
        Notification = "Notification",
        OverflowMenu = "OverflowMenu",
        ProgressBar = "Progress Bar",
        ProgressCircle = "Progress Circle",
        RangeSlider = "Range Slider",
        RangeSliderInterval = "Range Slider Interval",
        Rating = "Rating",
        Search = "Search",
        SectionIndex = "Section Index",
        SectionIndexItem = "Section Index Item",
        Sidebar = "Sidebar",
        Submenu = "Submenu",
        SwipeEvents = "SwipeEvents",
        Tabs = "Tabs",
        TabsContentItem = "TabsContentItem",
        TabsHeaderItem = "TabsHeaderItem",
        Timepicker = "Timepicker",
        Tooltip = "Tooltip",
        TouchEvents = "TouchEvents",
        Video = "Video"
    }
    enum ShapeTypes {
        Rounded = "rounded",
        Sharp = "none",
        SoftRounded = "soft"
    }
    enum InputClassTypes {
        InputLarge = "input-large",
        InputSmall = "input-small"
    }
    enum InputTypeAttr {
        Date = "date",
        DateTime = "date-time-edit",
        Password = "password",
        Text = "text",
        Time = "time"
    }
    enum Units {
        Percentage = "%",
        Pixel = "px",
        Em = "em"
    }
    enum Browser {
        chrome = "chrome",
        edge = "edge",
        firefox = "firefox",
        ie = "ie",
        kindle = "kindle",
        miui = "miui",
        opera = "opera",
        safari = "safari",
        samsung = "samsung",
        uc = "uc",
        unknown = "unknown",
        yandex = "yandex"
    }
    enum DeviceOrientation {
        landscape = "landscape",
        portrait = "portrait",
        unknown = "unknown"
    }
    enum DeviceType {
        desktop = "desktop",
        phone = "phone",
        tablet = "tablet"
    }
    enum NotchClasses {
        IPhoneX = "iphonex"
    }
    enum FocusTrapClasses {
        FocusTrapBottom = "focus-trap-bottom",
        FocusTrapTop = "focus-trap-top"
    }
    enum WarningMessages {
        FeatureNotImplemented = "This feature is not yet implemented!",
        MethodNotImplemented = "This Method has no implementation on the context of this pattern."
    }
    enum NullValues {
        Time = "00:00:00"
    }
    enum ProviderEvents {
        Initialized = "Initialized",
        OnProviderConfigsApplied = "OnProviderConfigsApplied"
    }
    enum SVGHelperConstants {
        DOMType = "image/svg+xml",
        ParserError = "parsererror",
        SVG = "svg"
    }
    enum Time {
        HourInSeconds = 3600,
        MinuteInSeconds = 60
    }
}
declare namespace OSFramework.OSUI.Behaviors {
    type SpringAnimationProperties = {
        friction: number;
        mass: number;
        tension: number;
    };
    type SpringAnimationConfigs = {
        addSpringAnimation: boolean;
        springAnimationProperties: SpringAnimationProperties;
    };
    class DragParams {
        DragOrientation: GlobalEnum.Orientation;
        ExpectedDirection: GlobalEnum.Direction;
        InvalidDrag: boolean;
        IsMoving: boolean;
        IsOpen: boolean;
        IsReadyToTriggerCallback: boolean;
        LastX: number;
        LastY: number;
        MoveX: number;
        MoveY: number;
        Size: any;
        SpringAnimation: Animation;
        VerticalDrag: boolean;
    }
    export class AnimateOnDrag {
        private _dragParams;
        private readonly _swipeTriggerSpeed;
        private _targetElement;
        constructor(target: HTMLElement);
        private _checkIsDraggingInsideBounds;
        private _updateLastPositions;
        private _updateUI;
        get dragParams(): DragParams;
        onDragEnd(offsetX: number, offsetY: number, timeTaken: number, callback: GlobalCallbacks.Generic, springProperties?: SpringAnimationConfigs): void;
        onDragMove(offsetX: number, offsetY: number, currentX: number, currentY: number, event: TouchEvent): void;
        onDragStart(verticalDrag: boolean, expectedDirection: GlobalEnum.Direction, currentX: number, currentY: number, isOpen: boolean, size: string): void;
    }
    export abstract class OverlayTransitionOnDrag {
        static Set(target: HTMLElement, currentDragValue: number, direction: GlobalEnum.Direction, size: string): void;
        static UnSet(target: HTMLElement): void;
    }
    export abstract class SpringAnimation {
        private static _createSpringEffect;
        static CreateSpringAnimation(target: HTMLElement, offsetX: number, offsetY: number, orientation: GlobalEnum.Orientation, springProperties: SpringAnimationProperties): Animation;
    }
    export {};
}
declare namespace OSFramework.OSUI.Behaviors {
    class FocusManager {
        private _lastFocusedElem;
        constructor();
        setFocusToStoredElement(): void;
        storeLastFocusedElement(): void;
    }
}
declare namespace OSFramework.OSUI.Behaviors {
    type FocusTrapParams = {
        focusBottomCallback: GlobalCallbacks.Generic;
        focusTargetElement: HTMLElement;
        focusTopCallback: GlobalCallbacks.Generic;
    };
    class FocusTrap {
        private _firstFocusableElement;
        private _focusBottomCallback;
        private _focusTopCallback;
        private _focusableElements;
        private _hasBeenPassThoughFirstOne;
        private _lastFocusableElement;
        private _predictableBottomElement;
        private _predictableTopElement;
        private _targetElement;
        constructor(opts: FocusTrapParams);
        private _buildPredictableElements;
        private _focusBottomHandler;
        private _focusHandler;
        private _focusTopHandler;
        private _removeEventListeners;
        private _setEventListeners;
        private _setFocusableElements;
        private _setFocusableProperties;
        private _unsetCallbacks;
        disableForA11y(): void;
        dispose(): void;
        enableForA11y(): void;
        get bottomElement(): HTMLElement;
        get topElement(): HTMLElement;
        get focusableElements(): HTMLElement[];
    }
}
declare namespace OSFramework.OSUI.Behaviors {
    function Scroll(element: HTMLElement, offSet: OffsetValues, isSmooth?: boolean): void;
    function ScrollVerticalPosition(scrollableElement?: HTMLElement): ScrollPosition;
}
declare namespace OSFramework.OSUI.Event.DOMEvents {
    abstract class AbstractEvent<T> implements IEvent<T> {
        private _handlers;
        get handlers(): GlobalCallbacks.OSGeneric[];
        addHandler(handler: GlobalCallbacks.OSGeneric): void;
        hasHandlers(): boolean;
        removeHandler(handler: GlobalCallbacks.OSGeneric): void;
        trigger(data?: T, ...args: unknown[]): void;
        abstract addEvent(): void;
        abstract removeEvent(): void;
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents {
    abstract class AbstractEventsManager<ET, D> {
        private _events;
        constructor();
        addHandler(eventType: ET, handler: GlobalCallbacks.Generic): void;
        hasHandlers(eventType: ET): boolean;
        removeHandler(eventType: ET, handler: GlobalCallbacks.Generic): void;
        trigger(eventType: ET, data?: D, ...args: unknown[]): void;
        get events(): Map<ET, IEvent<D>>;
        protected abstract getInstanceOfEventType(eventType: ET): IEvent<D>;
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents {
    interface IEvent<D> {
        handlers: GlobalCallbacks.OSGeneric[];
        addEvent(): void;
        addHandler(handler: GlobalCallbacks.OSGeneric, ...args: any[]): void;
        hasHandlers(): boolean;
        removeEvent(): void;
        removeHandler(handler: GlobalCallbacks.OSGeneric): void;
        trigger(data: D, ...args: unknown[]): unknown;
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
    abstract class AbstractListener<T> extends AbstractEvent<T> implements IListener {
        private _eventName;
        private _eventTarget;
        private _eventType;
        protected eventCallback: EventListenerObject;
        protected useCapture: boolean;
        constructor(eventTarget: HTMLElement | Document | Window, eventType: GlobalEnum.HTMLEvent | GlobalEnum.CustomEvent, isCustomEvent?: boolean);
        addEvent(): void;
        removeEvent(): void;
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
    class BalloonOnToggle extends AbstractListener<string> {
        constructor();
        private _onToggleTrigger;
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
    class BodyOnClick extends AbstractListener<string> {
        private _enableBodyClick;
        constructor();
        private _bodyTrigger;
        disableBodyClickEvent(): void;
        enableBodyClickEvent(): void;
        get getBodyClickStatus(): boolean;
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
    class BodyOnMouseDown extends AbstractListener<string> {
        constructor();
        private _bodyTrigger;
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
    interface IListener extends IEvent<unknown> {
        disableBodyClickEvent?(): void;
        enableBodyClickEvent?(): void;
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
    enum Type {
        BalloonOnToggle = "balloon.onToggle",
        BodyOnClick = "body.onclick",
        BodyOnMouseDown = "body.mousedown",
        OrientationChange = "window.onorientationchange",
        ScreenOnScroll = "screen.onscroll",
        WindowResize = "window.onresize"
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
    class ListenerManager extends AbstractEventsManager<Type, string> {
        protected getInstanceOfEventType(listenerType: Type): IListener;
    }
    class GlobalListenerManager {
        private static _listenerManager;
        static get Instance(): ListenerManager;
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
    class OrientationChange extends AbstractListener<string> {
        constructor();
        private _orientationTrigger;
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
    class ScreenOnScroll extends AbstractListener<string> {
        constructor();
        private _screenTrigger;
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents.Listeners {
    class WindowResize extends AbstractListener<string> {
        private _timeout;
        constructor();
        private _windowTrigger;
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents.Observers {
    abstract class AbstractObserver<O> extends AbstractEvent<string> implements IObserver<O, string> {
        private _observerOptions;
        private _observerTarget;
        protected observer: ResizeObserver | MutationObserver;
        constructor(observerOptions: O, observerTarget: HTMLElement);
        protected startObserver(): void;
        removeEvent(): void;
        get observerOptions(): O;
        get observerTarget(): HTMLElement;
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents.Observers {
    interface IObserver<O, D> extends IEvent<D> {
        observerOptions: O;
        observerTarget: HTMLElement;
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents.Observers {
    enum ObserverEvent {
        RTL = "RTL"
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents.Observers {
    class ObserverManager extends AbstractEventsManager<unknown, string> {
        protected getInstanceOfEventType(observerType: Observers.ObserverEvent): Observers.IObserver<unknown, unknown>;
    }
    class GlobalObserverManager {
        private static _observerManager;
        static get Instance(): ObserverManager;
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents.Observers.MutationObservers {
    abstract class AbstractMutationObserver extends AbstractObserver<MutationObserverInit> implements IObserver<MutationObserverInit, string> {
        constructor(observerOptions: MutationObserverInit, observerTarget: HTMLElement);
        addEvent(): void;
        protected abstract observerHandler(mutationList: MutationRecord[]): void;
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents.Observers.MutationObservers.RTL {
    class RTLObserver extends AbstractMutationObserver {
        private _hasAlreadyRTL;
        constructor();
        observerHandler(mutationList: MutationRecord[]): void;
    }
}
declare namespace OSFramework.OSUI.Event.DOMEvents.Observers.MutationObservers.RTL {
    class RTLObserverConfigs implements MutationObserverInit {
        attributeFilter: Array<string>;
        attributeOldValue: boolean;
        subtree: boolean;
        constructor();
    }
}
declare namespace OSFramework.OSUI.Event {
    abstract class AbstractGestureEvent implements GestureEvent.IGestureEvent {
        private _endEvent;
        private _endTriggerCallback;
        private _gestureParams;
        private _moveEvent;
        private _moveTriggerCallback;
        private _startEvent;
        private _startTriggerCallback;
        private _targetElement;
        constructor(target: HTMLElement);
        private _eventTouchEnd;
        private _eventTouchMove;
        private _eventTouchStart;
        private _removeEventListeners;
        private _unsetCallbacks;
        protected setCallbacks(onStartCallback?: GlobalCallbacks.Generic, onMoveCallback?: GlobalCallbacks.Generic, onEndCallback?: GlobalCallbacks.Generic): void;
        protected setEventListeners(): void;
        get targetElement(): HTMLElement;
        unsetTouchEvents(): void;
        protected abstract setSwipeEvents(...args: GlobalCallbacks.Generic[]): void;
    }
}
declare namespace OSFramework.OSUI.Event.GestureEvent.Callbacks {
    type GestureStart = {
        (x: number, y: number): void;
    };
    type GestureMove = {
        (x: number, y: number, offsetX: number, offsetY: number, evt: TouchEvent): void;
    };
    type GestureEnd = {
        (offsetX: number, offsetY: number, timeTaken: number): void;
    };
    type SwipeDown = {
        (): void;
    };
    type SwipeLeft = {
        (): void;
    };
    type SwipeRight = {
        (): void;
    };
    type SwipeUp = {
        (): void;
    };
}
declare namespace OSFramework.OSUI.Event.GestureEvent {
    class DragEvent extends AbstractGestureEvent {
        constructor(target: HTMLElement);
        setSwipeEvents(onStartCallback: Event.GestureEvent.Callbacks.GestureStart, onMoveCallback: Event.GestureEvent.Callbacks.GestureMove, onEndCallback?: Event.GestureEvent.Callbacks.GestureEnd): void;
    }
}
declare namespace OSFramework.OSUI.Event.GestureEvent {
    interface IGestureEvent {
        targetElement: HTMLElement;
        unsetTouchEvents(): void;
    }
}
declare namespace OSFramework.OSUI.Event.GestureEvent {
    class SwipeEvent extends AbstractGestureEvent {
        private _swipeDownCallback;
        private _swipeLeftCallback;
        private _swipeRightCallback;
        private _swipeUpCallback;
        private _threshold;
        private _velocity;
        constructor(target: HTMLElement);
        private _onGestureEnd;
        protected setSwipeCallbacks(swipeDownCallback: GlobalCallbacks.Generic, swipeLeftCallback: GlobalCallbacks.Generic, swipeRightCallback: GlobalCallbacks.Generic, swipeUpCallback: GlobalCallbacks.Generic): void;
        setSwipeEvents(swipeDownCallback: Event.GestureEvent.Callbacks.SwipeDown, swipeLeftCallback: Event.GestureEvent.Callbacks.SwipeLeft, swipeRightCallback: Event.GestureEvent.Callbacks.SwipeRight, swipeUpCallback: Event.GestureEvent.Callbacks.SwipeUp): void;
    }
}
declare namespace OSFramework.OSUI.Event.ProviderEvents {
    interface IProviderEvent {
        callback: GlobalCallbacks.Generic;
        eventName: string;
        eventUniqueId: string;
    }
}
declare namespace OSFramework.OSUI.Event.ProviderEvents {
    interface IProviderEventManager {
        addPendingEvent(eventName: string, callback: GlobalCallbacks.Generic, eventUniqueId: string): void;
        get events(): Map<string, IProviderEvent>;
        get hasEvents(): boolean;
        get hasPendingEvents(): boolean;
        get pendingEvents(): Map<string, IProviderEvent>;
        removePendingEvent(eventUniqueId: string): void;
        removeSavedEvent(eventUniqueId: string): void;
        saveEvent(eventName: string, callback: GlobalCallbacks.Generic, eventUniqueId: string): void;
    }
}
declare namespace OSFramework.OSUI.Event.ProviderEvents {
    class ProviderEvent implements IProviderEvent {
        callback: GlobalCallbacks.Generic;
        eventName: string;
        eventUniqueId: string;
        constructor(callback: GlobalCallbacks.Generic, eventName: string, eventUniqueId: string);
    }
}
declare namespace OSFramework.OSUI.Event.ProviderEvents {
    class ProviderEventsManager implements IProviderEventManager {
        private _eventsMap;
        private _pendingEventsMap;
        addPendingEvent(eventName: string, callback: GlobalCallbacks.Generic, eventUniqueId: string): void;
        removePendingEvent(eventUniqueId: string): void;
        removeSavedEvent(eventUniqueId: string): void;
        saveEvent(eventName: string, callback: GlobalCallbacks.Generic, eventUniqueId: string): void;
        get events(): Map<string, IProviderEvent>;
        get pendingEvents(): Map<string, IProviderEvent>;
        get hasEvents(): boolean;
        get hasPendingEvents(): boolean;
    }
}
declare namespace OSFramework.OSUI.Feature {
    abstract class AbstractFeature<PT, O> implements IFeature {
        private _featureElem;
        private _featureOptions;
        private _featurePattern;
        constructor(featurePattern: PT, featureElem: HTMLElement, options: O);
        dispose(): void;
        get featureElem(): HTMLElement;
        get featureOptions(): O;
        get featurePattern(): PT;
    }
}
declare namespace OSFramework.OSUI.Feature {
    interface IFeature extends Interface.IDisposable {
    }
}
declare namespace OSFramework.OSUI.Feature.Balloon {
    type BalloonOptions = {
        alignment: GlobalEnum.FloatingAlignment;
        allowedPlacements: Array<GlobalEnum.FloatingPosition>;
        anchorElem: HTMLElement;
        position: GlobalEnum.FloatingPosition;
        shape: GlobalEnum.ShapeTypes;
    };
    class Balloon<PT> extends AbstractFeature<PT, BalloonOptions> implements IBalloon {
        private _currentFocusedElementIndex;
        private _eventBodyClick;
        private _eventOnKeypress;
        private _floatingInstance;
        private _floatingOptions;
        private _focusManagerInstance;
        private _focusTrapInstance;
        private _focusableBalloonElements;
        private _isOpenedByApi;
        private _onToggleEvent;
        isOpen: boolean;
        constructor(featurePattern: PT, featureElem: HTMLElement, options: BalloonOptions);
        private _bodyClickCallback;
        private _handleFocusBehavior;
        private _manageFocusInsideBalloon;
        private _onkeypressCallback;
        private _removeEventListeners;
        private _setA11YProperties;
        private _setCallbacks;
        private _setEventListeners;
        private _toggleBalloon;
        private _unsetCallbacks;
        build(): void;
        close(): void;
        dispose(): void;
        open(isOpenedByApi: boolean, arrowKeyPressed?: GlobalEnum.Keycodes.ArrowDown | GlobalEnum.Keycodes.ArrowUp): void;
        setBalloonShape(shape?: GlobalEnum.ShapeTypes): void;
        setFloatingBehaviour(isUpdate?: boolean): void;
        setFloatingConfigs(): void;
        updateFloatingConfigs(floatingConfigs?: Utils.FloatingPosition.FloatingPositionConfig): void;
        updatePositionOption(position: GlobalEnum.FloatingPosition): void;
    }
}
declare namespace OSFramework.OSUI.Feature.Balloon.Enum {
    enum CssClasses {
        IsOpen = "osui-balloon--is-open",
        Pattern = "osui-balloon"
    }
    enum CssCustomProperties {
        Shape = "--osui-balloon-shape"
    }
    enum Properties {
        AnchorId = "AnchorId",
        BalloonPosition = "BalloonPosition",
        BalloonShape = "BalloonShape"
    }
}
declare namespace OSFramework.OSUI.Feature.Balloon {
    interface IBalloon extends Feature.IFeature, Interface.IOpenable {
        open(isOpenedByApi?: boolean, arrowKeyPressed?: GlobalEnum.Keycodes.ArrowDown | GlobalEnum.Keycodes.ArrowUp): void;
        setBalloonShape(shape?: GlobalEnum.ShapeTypes): void;
        updatePositionOption(position: GlobalEnum.FloatingPosition): void;
    }
}
declare namespace OSFramework.OSUI.Helper {
    function AsyncInvocation(callback: GlobalCallbacks.Generic, ...args: unknown[]): void;
    function ApplySetTimeOut(callback: GlobalCallbacks.Generic, time: number, ...args: unknown[]): void;
}
declare namespace OSFramework.OSUI.Helper {
    abstract class BoundPosition {
        private static _checkIsOutBounds;
        static GetBodyBounds(): DOMRect;
        static GetRecommendedPosition(element: HTMLElement, testAgainstElement?: HTMLElement, elementOffset?: number | OffsetValues): string | undefined;
        static GetRecommendedPositionByBounds(elementBounds: DOMRect, testAgainstElementBounds: DOMRect): string | undefined;
        static IsOutBounds(element: HTMLElement, testAgainstElement?: HTMLElement, elementOffset?: number | OffsetValues): OutOfBoundaries;
    }
}
declare namespace OSFramework.OSUI.Helper {
    abstract class Dates {
        private static _serverFormat;
        static GetTimeFromDate(_date: Date): string;
        static IsBeforeThan(date1: string, date2: string): boolean;
        static IsNull(date: string | Date): boolean;
        static NormalizeDateTime(date: string | Date, normalizeToMax?: boolean): Date;
        static SetServerDateFormat(date: string): void;
        static get ServerFormat(): string;
    }
}
declare namespace OSFramework.OSUI.Helper {
    abstract class DeviceInfo {
        private static _browser;
        private static _iphoneDetails;
        private static _isAndroid;
        private static _isIos;
        private static _isIphoneWithNotch;
        private static _isNativeApp;
        private static _isPwa;
        private static _isTouch;
        private static _operatingSystem;
        private static _getOperatingSystem;
        private static _getUserAgent;
        private static _isChrome;
        private static _isEdge;
        private static _isFirefox;
        private static _isIE;
        private static _isKindle;
        private static _isMiui;
        private static _isOpera;
        private static _isSafari;
        private static _isSamsung;
        private static _isUC;
        private static _isYandex;
        static get HasAccessibilityEnabled(): boolean;
        static get IsDesktop(): boolean;
        static get IsPhone(): boolean;
        static get IsIphoneWithNotch(): boolean;
        static get IsTablet(): boolean;
        static get IsPwa(): boolean;
        static get IsNative(): boolean;
        static get IsAndroid(): boolean;
        static get IsIos(): boolean;
        static get IsTouch(): boolean;
        static get NotchPosition(): GlobalEnum.Position;
        static GetBrowser(userAgent?: string): GlobalEnum.Browser;
        static GetDeviceOrientation(): GlobalEnum.DeviceOrientation;
        static GetDeviceType(): GlobalEnum.DeviceType;
        static GetOperatingSystem(userAgent?: string): GlobalEnum.MobileOS;
    }
}
declare namespace OSFramework.OSUI.Helper {
    abstract class AttributeManipulation {
        static Get(element: HTMLElement, attrName: string): string | undefined;
        static Has(element: HTMLElement, attrName: string): boolean;
        static Id(element: HTMLElement): string | undefined;
        static Remove(element: HTMLElement, attrName: string): void;
        static Set(element: HTMLElement, attrName: string, attrValue: boolean | number | string): void;
    }
    abstract class StyleManipulation {
        static AddClass(element: HTMLElement, cssClass: string): void;
        static ContainsClass(element: HTMLElement, cssClass: string): boolean;
        static ExtendedClass(element: HTMLElement, currentCssClasses: string, newCssClass: string): void;
        static GetBorderRadiusValueFromShapeType(shapeName: string): string;
        static GetColorValueFromColorType(colorName: string): string;
        static GetCssClasses(element: HTMLElement): Set<string>;
        static RemoveClass(element: HTMLElement, cssClass: string): void;
        static RemoveStyleAttribute(element: HTMLElement, cssProperty: string): void;
        static SetStyleAttribute(element: HTMLElement, cssProperty: string, ruleValue: number | string): void;
        static ToggleClass(element: HTMLElement, cssClass: string): void;
    }
    export abstract class Dom {
        static get Attribute(): typeof AttributeManipulation;
        static get Styles(): typeof StyleManipulation;
        static ClassSelector(element: HTMLElement | Document, cssClass: string): HTMLElement | undefined;
        static Disable(element: HTMLElement): void;
        static Enable(element: HTMLElement): void;
        static GenerateUniqueId(): string;
        static GetElementById(id: string): HTMLElement;
        static GetElementByUniqueId(uniqueId: string): HTMLElement;
        static GetFocusableElements(element: HTMLElement): HTMLElement[];
        static Move(element: HTMLElement, target: HTMLElement): void;
        static SetInputValue(inputElem: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, value: string): void;
        static TagSelector(element: HTMLElement, htmlTag: string): HTMLElement | undefined;
        static TagSelectorAll(element: HTMLElement | Document, htmlTag: string): HTMLElement[] | undefined;
    }
    export {};
}
declare namespace OSFramework.OSUI.Helper {
    abstract class InvalidInputs {
        private static _checkInvalidInputs;
        private static _scrollToInvalidInput;
        private static _searchElementId;
        static FocusFirstInvalidInput(elementId: string, isSmooth: boolean, elementParentClass: string): string;
    }
}
declare namespace OSFramework.OSUI.Helper {
    abstract class Language {
        private static _lang;
        static get Lang(): string;
        static get ShortLang(): string;
        static Set(language: string): void;
    }
}
declare namespace OSFramework.OSUI.Helper {
    function LogMessage(message: string): string;
}
declare namespace OSFramework.OSUI.Helper {
    abstract class A11Y {
        static AriaAtomicFalse(element: HTMLElement): void;
        static AriaAtomicTrue(element: HTMLElement): void;
        static AriaBusyFalse(element: HTMLElement): void;
        static AriaBusyTrue(element: HTMLElement): void;
        static AriaControls(element: HTMLElement, targetId: string): void;
        static AriaDescribedBy(element: HTMLElement, targetId: string): void;
        static AriaDisabled(element: HTMLElement, isDisabled: boolean): void;
        static AriaDisabledFalse(element: HTMLElement): void;
        static AriaDisabledTrue(element: HTMLElement): void;
        static AriaExpanded(element: HTMLElement, value: string): void;
        static AriaExpandedFalse(element: HTMLElement): void;
        static AriaExpandedTrue(element: HTMLElement): void;
        static AriaHasPopup(element: HTMLElement, value: string): void;
        static AriaHasPopupFalse(element: HTMLElement): void;
        static AriaHasPopupTrue(element: HTMLElement): void;
        static AriaHidden(element: HTMLElement, value: string): void;
        static AriaHiddenFalse(element: HTMLElement): void;
        static AriaHiddenTrue(element: HTMLElement): void;
        static AriaLabel(element: HTMLElement, value: string): void;
        static AriaLabelledBy(element: HTMLElement, targetId: string): void;
        static AriaLiveAssertive(element: HTMLElement): void;
        static AriaLiveOff(element: HTMLElement): void;
        static AriaLivePolite(element: HTMLElement): void;
        static AriaSelectedFalse(element: HTMLElement): void;
        static AriaSelectedTrue(element: HTMLElement): void;
        static AriaValueMax(element: HTMLElement, value: number): void;
        static AriaValueMin(element: HTMLElement, value: number): void;
        static MultiselectableFalse(element: HTMLElement): void;
        static MultiselectableTrue(element: HTMLElement): void;
        static RoleAlert(element: HTMLElement): void;
        static RoleButton(element: HTMLElement): void;
        static RoleComplementary(element: HTMLElement): void;
        static RoleListbox(element: HTMLElement): void;
        static RoleMenuItem(element: HTMLElement): void;
        static RoleOption(element: HTMLElement): void;
        static RolePresentation(element: HTMLElement): void;
        static RoleProgressBar(element: HTMLElement): void;
        static RoleRegion(element: HTMLElement): void;
        static RoleSearch(element: HTMLElement): void;
        static RoleTab(element: HTMLElement): void;
        static RoleTabList(element: HTMLElement): void;
        static RoleTabPanel(element: HTMLElement): void;
        static RoleTooltip(element: HTMLElement): void;
        static SetElementsTabIndex(state: boolean, elements: HTMLElement[]): void;
        static TabIndex(element: HTMLElement, value: string): void;
        static TabIndexFalse(element: HTMLElement): void;
        static TabIndexTrue(element: HTMLElement): void;
    }
}
declare namespace OSFramework.OSUI.Helper.MapOperation {
    function FindInMap(patternName: string, patternId: string, map: Map<string, Interface.IPattern>): Interface.IPattern;
    function ExportKeys(map: Map<string, Interface.IPattern>): Array<string>;
}
declare namespace OSFramework.OSUI.Helper {
    abstract class SVG {
        static IsValid(svgString: string): boolean;
    }
}
declare namespace OSFramework.OSUI.Helper {
    function Sanitize(value: string): string;
}
declare namespace OSFramework.OSUI.Helper {
    abstract class Times {
        static ConvertInSeconds(time: Date): number;
        static IsNull(time: string): boolean;
    }
}
declare namespace OSFramework.OSUI.Helper {
    abstract class URL {
        static IsImage(url: string): boolean;
        static IsValid(url: string): boolean;
    }
}
declare namespace OSFramework.OSUI.Interface {
    interface IBuilder {
        build(): void;
    }
}
declare namespace OSFramework.OSUI.Interface {
    interface ICallback {
        registerCallback(callback: GlobalCallbacks.OSGeneric, eventName?: string): void;
    }
}
declare namespace OSFramework.OSUI.Interface {
    interface IChild extends IPattern {
        get isFirstChild(): boolean;
        set isFirstChild(value: boolean);
        get isLastChild(): boolean;
        set isLastChild(value: boolean);
        setBlur?(): void;
        setFocus?(): void;
        setTabindex?(): void;
        unsetTabindex?(): void;
    }
}
declare namespace OSFramework.OSUI.Interface {
    interface IDisposable {
        dispose(): void;
    }
}
declare namespace OSFramework.OSUI.Interface {
    interface IDragEvent extends IGestureEvent {
        gestureEventInstance: Event.GestureEvent.DragEvent;
        setGestureEvents(onGestureStart: Event.GestureEvent.Callbacks.GestureStart, onGestureMove: Event.GestureEvent.Callbacks.GestureMove, onGestureEnd: Event.GestureEvent.Callbacks.GestureEnd): any;
    }
}
declare namespace OSFramework.OSUI.Interface {
    interface IFloatable extends IOpenable {
    }
}
declare namespace OSFramework.OSUI.Interface {
    interface IGestureEvent {
        hasGestureEvents: boolean;
        removeGestureEvents(): void;
    }
}
declare namespace OSFramework.OSUI.Interface {
    interface IOpenable {
        isOpen?: boolean;
        close(): void;
        open(isOpenedByApi?: boolean): void;
    }
}
declare namespace OSFramework.OSUI.Interface {
    interface IParent extends IPattern {
        beNotifiedByChild(childItem: IChild, notifiedTo: string): void;
    }
}
declare namespace OSFramework.OSUI.Interface {
    interface IPattern extends IBuilder, IDisposable, ISearchById {
        isBuilt: boolean;
        selfElement: HTMLElement;
        uniqueId: string;
        widgetId: string;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
    }
}
declare namespace OSFramework.OSUI.Interface {
    interface IProviderPattern<P> extends Interface.IPattern {
        provider: P;
        providerInfo: ProviderInfo;
        setProviderConfigs(newConfigs: ProviderConfigs): void;
        updateProviderEvents(providerInfo: ProviderInfo): void;
    }
}
declare namespace OSFramework.OSUI.Interface {
    interface IRenderUpdate {
        updateOnRender(): void;
    }
}
declare namespace OSFramework.OSUI.Interface {
    interface ISearchById {
        equalsToID(id: string): boolean;
    }
}
declare namespace OSFramework.OSUI.Interface {
    interface ISwipeEvent extends IGestureEvent {
        gestureEventInstance: Event.GestureEvent.SwipeEvent;
        setGestureEvents(swipeDownCallback: Event.GestureEvent.Callbacks.SwipeDown, swipeLeftCallback: Event.GestureEvent.Callbacks.SwipeLeft, swipeRightCallback: Event.GestureEvent.Callbacks.SwipeRight, swipeUpCallback: Event.GestureEvent.Callbacks.SwipeUp): any;
    }
}
declare namespace OSFramework.OSUI.Patterns {
    abstract class AbstractPattern<C extends AbstractConfiguration> implements Interface.IPattern {
        private _configs;
        private _isBuilt;
        private _platformEventInitialized;
        private _selfElem;
        private _uniqueId;
        private _widgetId;
        protected isProviderBased: boolean;
        constructor(uniqueId: string, configs: C);
        private _setCommonHtmlElements;
        private _unsetCommonHtmlElements;
        protected finishBuild(): void;
        protected triggerPlatformEventCallback(platFormCallback: GlobalCallbacks.OSGeneric, ...args: unknown[]): void;
        protected triggerPlatformInitializedEventCallback(): void;
        protected unsetGlobalCallbacks(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        dispose(): void;
        equalsToID(patternId: string): boolean;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
        protected get _enableAccessibility(): boolean;
        get selfElement(): HTMLElement;
        get isBuilt(): boolean;
        get configs(): C;
        get uniqueId(): string;
        get widgetId(): string;
        protected abstract setA11YProperties(): void;
        protected abstract setCallbacks(): void;
        protected abstract setHtmlElements(): void;
        protected abstract unsetCallbacks(): void;
        protected abstract unsetHtmlElements(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns {
    abstract class AbstractChild<C extends AbstractConfiguration, PT extends Interface.IParent> extends AbstractPattern<C> implements Interface.IChild {
        private _isFirstChild;
        private _isLastChild;
        private _parentId;
        private _parentObject;
        protected notifyParent(actionType: string): void;
        protected setParentInfo(parentSelector: string, getPatternByIdAPI: Function, canBeOrphan?: boolean): void;
        get isFirstChild(): boolean;
        set isFirstChild(value: boolean);
        get isLastChild(): boolean;
        set isLastChild(value: boolean);
        get parentId(): string;
        get parentObject(): PT;
    }
}
declare namespace OSFramework.OSUI.Patterns {
    abstract class AbstractConfiguration {
        ExtendedClass: string;
        constructor(config: JSON);
        protected validateBoolean(value: boolean | undefined, defaultValue: boolean): boolean;
        protected validateDate(value: string | Date, defaultValue: string): string | Date;
        protected validateInRange(value: unknown, defaultValue: unknown, ...args: unknown[]): unknown;
        protected validateNumber(value: number, defaultValue: number): number;
        protected validateString(value: string | undefined, defaultValue: string): string;
        protected validateTime(value: string, defaultValue: string): string;
        validateCanChange(_isBuilt: boolean, _key: string): boolean;
        validateDefault(_key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns {
    abstract class AbstractParent<C extends AbstractConfiguration, CT extends Interface.IChild> extends AbstractPattern<C> implements Interface.IParent {
        private _childIdsByType;
        private _childItemsByType;
        protected getChild(childId: string): CT;
        protected getChildByIndex(index: number, childType?: string): CT;
        protected getChildIndex(childId: string): number;
        protected setChild(childItem: CT): void;
        protected unsetChild(childId: string): void;
        getChildItems(type?: string): Array<CT>;
        abstract beNotifiedByChild(childItem: CT, notifiedTo: string): void;
    }
}
declare namespace OSFramework.OSUI.Patterns {
    abstract class AbstractProviderConfiguration extends AbstractConfiguration {
        protected mergeConfigs(commonConfigs: ProviderConfigs, specificConfigs: ProviderConfigs, extendedConfigs?: ProviderConfigs): ProviderConfigs;
        abstract getProviderConfig(): ProviderConfigs;
    }
}
declare namespace OSFramework.OSUI.Patterns {
    abstract class AbstractProviderPattern<P, C extends AbstractConfiguration> extends AbstractPattern<C> implements Interface.IProviderPattern<P> {
        private _platformEventProviderConfigsAppliedCallback;
        private _provider;
        private _providerInfo;
        protected providerEventsManagerInstance: Event.ProviderEvents.IProviderEventManager;
        constructor(uniqueId: string, configs: C);
        private _getEventIndexFromArray;
        private _handleProviderEventsAPI;
        protected redraw(): void;
        protected unsetCallbacks(): void;
        build(): void;
        checkAddedProviderEvents(): void;
        checkPendingProviderEvents(): void;
        dispose(): void;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
        setProviderConfigs(providerConfigs: unknown): void;
        setProviderEvent(eventName: string, callback: GlobalCallbacks.Generic, uniqueId: string, saveEvent?: boolean): void;
        unsetProviderEvent(eventId: string): void;
        updateProviderEvents(providerInfo: ProviderInfo): void;
        get providerInfo(): ProviderInfo;
        set providerInfo(providerInfo: ProviderInfo);
        set provider(p: P);
        get provider(): P;
        protected abstract prepareConfigs(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Accordion {
    class Accordion extends AbstractParent<AccordionConfig, AccordionItem.IAccordionItem> implements IAccordion {
        constructor(uniqueId: string, configs: JSON);
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        addAccordionItem(childItem: AccordionItem.IAccordionItem): void;
        beNotifiedByChild(childItem: AccordionItem.IAccordionItem, notifiedTo: Enum.ChildNotifyActionType): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        collapseAllItems(): void;
        dispose(): void;
        expandAllItems(): void;
        removeAccordionItem(childId: string): void;
        triggerAccordionItemClose(childId: string): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Accordion {
    class AccordionConfig extends AbstractConfiguration {
        MultipleItems: boolean;
        constructor(config: JSON);
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.Accordion.Enum {
    enum ChildNotifyActionType {
        Add = "add",
        Click = "click",
        Removed = "removed"
    }
    enum CssClass {
        Pattern = "osui-accordion"
    }
    enum Properties {
        MultipleItems = "MultipleItems"
    }
}
declare namespace OSFramework.OSUI.Patterns.Accordion {
    interface IAccordion extends Interface.IParent {
        addAccordionItem(accordionItem: AccordionItem.IAccordionItem): void;
        collapseAllItems(): void;
        expandAllItems(): void;
        removeAccordionItem(uniqueId: string): void;
        triggerAccordionItemClose(accordionItemId: string): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.AccordionItem {
    class AccordionItem extends AbstractChild<AccordionItemConfig, Accordion.IAccordion> implements IAccordionItem {
        private _accordionItemContentElem;
        private _accordionItemIconCustomElem;
        private _accordionItemIconElem;
        private _accordionItemPlaceholder;
        private _accordionItemTitleElem;
        private _accordionTitleFocusableChildren;
        private _allowTitleEvents;
        private _collapsedHeight;
        private _eventOnClick;
        private _eventOnTransitionEnd;
        private _eventOnkeyPress;
        private _expandedHeight;
        private _isOpen;
        private _platformEventOnToggle;
        constructor(uniqueId: string, configs: JSON);
        private _accordionOnClickHandler;
        private _addEvents;
        private _animationAsync;
        private _handleTabIndex;
        private _onKeyboardPress;
        private _onToggleCallback;
        private _removeEvents;
        private _setAccordionParent;
        private _setIconPosition;
        private _setIconType;
        private _setIsDisabledState;
        private _transitionEndHandler;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected setInitialCssClasses(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        get isDisabled(): boolean;
        get isOpen(): boolean;
        allowTitleEvents(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        close(): void;
        dispose(): void;
        open(): void;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.AccordionItem {
    class AccordionItemConfig extends AbstractConfiguration {
        Icon: string;
        IconPosition: string;
        IsDisabled: boolean;
        StartsExpanded: boolean;
        constructor(config: JSON);
        validateCanChange(isBuilt: boolean, key: string): boolean;
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.AccordionItem.Enum {
    enum Properties {
        IconPosition = "IconPosition",
        IsDisabled = "IsDisabled",
        Icon = "Icon",
        StartsExpanded = "StartsExpanded"
    }
    enum CssClass {
        PatternAnimating = "osui-accordion-item__content--is-animating",
        PatternClosed = "osui-accordion-item--is-closed",
        PatternCollapsed = "osui-accordion-item__content--is-collapsed",
        PatternDisabled = "osui-accordion-item--is-disabled",
        PatternExpanded = "osui-accordion-item__content--is-expanded",
        PatternContent = "osui-accordion-item__content",
        PatternIcon = "osui-accordion-item__icon",
        PatternIconCaret = "osui-accordion-item__icon--caret",
        PatternIconCustom = "osui-accordion-item__icon--custom",
        PatternIconHidden = "osui-accordion-item__icon--hidden",
        PatternIconPlusMinus = "osui-accordion-item__icon--plus-minus",
        PatternIconPositionIsLeft = "osui-accordion-item__title--is-left",
        PatternIconPositionIsRight = "osui-accordion-item__title--is-right",
        PatternOpen = "osui-accordion-item--is-open",
        PatternTitle = "osui-accordion-item__title"
    }
    enum Events {
        OnToggle = "OnToggle"
    }
    enum IconType {
        Caret = "Caret",
        Custom = "Custom",
        PlusMinus = "PlusMinus"
    }
}
declare namespace OSFramework.OSUI.Patterns.AccordionItem {
    interface IAccordionItem extends Interface.IChild, Interface.IOpenable {
        isDisabled: boolean;
        isOpen: boolean;
        allowTitleEvents(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.AnimatedLabel {
    class AnimatedLabel extends AbstractPattern<AnimatedLabelConfig> implements IAnimatedLabel {
        private _eventAnimationStart;
        private _eventBlur;
        private _eventFocus;
        private _inputElement;
        private _inputPhElement;
        private _isLabelFocus;
        private _labelPhElement;
        constructor(uniqueId: string, configs: JSON);
        private _addEvents;
        private _inputAnimationStartCallback;
        private _inputBlurCallback;
        private _inputFocusCallback;
        private _inputStateToggle;
        private _removeEvents;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        dispose(): void;
        updateOnRender(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.AnimatedLabel {
    class AnimatedLabelConfig extends AbstractConfiguration {
        constructor(config: JSON);
    }
}
declare namespace OSFramework.OSUI.Patterns.AnimatedLabel.Enum {
    enum AnimationEvent {
        OnAutoFillStart = "onAutoFillStart"
    }
    enum CssClasses {
        InputPlaceholder = "animated-label-input",
        IsActive = "active",
        LabelPlaceholder = "animated-label-text",
        Pattern = "animated-label"
    }
    enum Messages {
        InputNotFound = "Missing input or textarea.",
        LabelNotFound = "We notice that a label is missing inside the Label Placeholder. In order to grant accessibility add it and assign the Input Widget accordingly."
    }
}
declare namespace OSFramework.OSUI.Patterns.AnimatedLabel {
    interface IAnimatedLabel extends Interface.IPattern, Interface.IRenderUpdate {
    }
}
declare namespace OSFramework.OSUI.Patterns.BottomSheet {
    class BottomSheet extends AbstractPattern<BottomSheetConfig> implements IBottomSheet, Interface.IDragEvent {
        private _animateOnDragInstance;
        private _bottomSheetContentElem;
        private _bottomSheetHeaderElem;
        private _eventOnContentScroll;
        private _eventOnKeypress;
        private _focusManagerInstance;
        private _focusTrapInstance;
        private _gestureEventInstance;
        private _hasGestureEvents;
        private _isOpen;
        private _parentSelf;
        private _platformEventOnToggle;
        springAnimationConfigs: {
            addSpringAnimation: boolean;
            springAnimationProperties: {
                tension: number;
                friction: number;
                mass: number;
            };
        };
        get gestureEventInstance(): Event.GestureEvent.DragEvent;
        get hasGestureEvents(): boolean;
        constructor(uniqueId: string, configs: JSON);
        private _handleFocusBehavior;
        private _handleGestureEvents;
        private _handleShape;
        private _onContentScrollCallback;
        private _onGestureEnd;
        private _onGestureMove;
        private _onGestureStart;
        private _onkeypressCallback;
        private _toggleBottomSheet;
        private _toggleHandler;
        private _triggerOnToggleEvent;
        protected removeEventListeners(): void;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setEventListeners(): void;
        protected setHtmlElements(): void;
        protected setInitialOptions(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        close(): void;
        dispose(): void;
        open(): void;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
        removeGestureEvents(): void;
        setGestureEvents(onGestureStart: Event.GestureEvent.Callbacks.GestureStart, onGestureMove: Event.GestureEvent.Callbacks.GestureMove, onGestureEnd: Event.GestureEvent.Callbacks.GestureEnd): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.BottomSheet {
    class BottomSheetConfig extends AbstractConfiguration {
        Shape: GlobalEnum.ShapeTypes;
        ShowHandler: boolean;
        constructor(config: JSON);
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.BottomSheet.Callbacks {
    type OSOnToggleEvent = {
        (bottomsheetId: string, isOpen: boolean): void;
    };
}
declare namespace OSFramework.OSUI.Patterns.BottomSheet.Enum {
    enum CssClass {
        HasHandler = "osui-bottom-sheet--has-handler",
        HasSCroll = "osui-bottom-sheet--has-scroll",
        IsOpen = "osui-bottom-sheet--is-open",
        IsActive = "osui-bottom-sheet--is-active",
        PatternContent = "osui-bottom-sheet__content",
        PatternHeader = "osui-bottom-sheet__header",
        PatternOverlay = "osui-bottom-sheet-overlay",
        PatternTopBar = "osui-bottom-sheet__header__top-bar"
    }
    enum CssCustomProperties {
        Shape = "--bottom-sheet-shape"
    }
    enum Events {
        OnToggle = "OnToggle"
    }
    enum Properties {
        Shape = "Shape",
        ShowHandler = "ShowHandler"
    }
}
declare namespace OSFramework.OSUI.Patterns.BottomSheet {
    interface IBottomSheet extends Interface.IPattern {
        close(): void;
        open(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.ButtonLoading {
    class ButtonLoading extends AbstractPattern<ButtonLoadingConfig> implements IButtonLoading {
        private _buttonElement;
        private _spinnerElement;
        constructor(uniqueId: string, configs: JSON);
        private _setInitialButtonState;
        private _setIsLoading;
        private _setLoadingLabel;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        dispose(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.ButtonLoading {
    class ButtonLoadingConfig extends AbstractConfiguration {
        IsLoading: boolean;
        ShowLoadingAndLabel: boolean;
        constructor(config: JSON);
    }
}
declare namespace OSFramework.OSUI.Patterns.ButtonLoading.Enum {
    enum Properties {
        IsLoading = "IsLoading",
        ShowLoadingAndLabel = "ShowLoadingAndLabel"
    }
    enum CssClass {
        Button = "btn",
        IsLoading = "osui-btn-loading--is-loading",
        ShowSpinnerOnly = "osui-btn-loading-show-spinner",
        Spinner = "osui-btn-loading__spinner-animation"
    }
}
declare namespace OSFramework.OSUI.Patterns.ButtonLoading {
    interface IButtonLoading extends Interface.IPattern {
    }
}
declare namespace OSFramework.OSUI.Patterns.Carousel {
    abstract class AbstractCarousel<P, C extends AbstractCarouselConfig> extends AbstractProviderPattern<P, C> implements ICarousel {
        constructor(uniqueId: string, configs: C);
        build(): void;
        abstract goTo(index: number): void;
        abstract next(): void;
        abstract previous(): void;
        abstract setCarouselDirection(direction: string): void;
        abstract toggleDrag(hasDrag: boolean): void;
        abstract toggleOnRender(blockOnRender: boolean): void;
        abstract updateOnRender(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Carousel {
    abstract class AbstractCarouselConfig extends Patterns.AbstractProviderConfiguration {
        AutoPlay: boolean;
        Direction: GlobalEnum.Direction.LTR | GlobalEnum.Direction.RTL | GlobalEnum.Direction.TTB;
        Height: string | number;
        ItemsDesktop: number;
        ItemsGap: string | number;
        ItemsPhone: number;
        ItemsTablet: number;
        Loop: boolean;
        Navigation: Enum.Navigation;
        Padding: string | number;
        StartingPosition: number;
        constructor(config: JSON);
        validateCanChange(isBuilt: boolean, key: string): boolean;
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.Carousel.Callbacks {
    type OSOnSlideMovedEvent = {
        (carouselId: string, index: number): void;
    };
}
declare namespace OSFramework.OSUI.Patterns.Carousel.Factory {
    function NewCarousel(carouselId: string, configs: string, provider: string): Patterns.Carousel.ICarousel;
}
declare namespace OSFramework.OSUI.Patterns.Carousel.Enum {
    enum CarouselEvents {
        OnSlideMoved = "OnSlideMoved"
    }
    enum CssVariables {
        CarouselWidth = "--osui-carousel-track-width"
    }
    enum CssClass {
        CarouselWrapper = "osui-carousel",
        Content = "osui-carousel__content",
        HasPagination = "osui-carousel--has-pagination",
        Track = "osui-carousel__track"
    }
    enum Direction {
        None = "",
        LeftToRight = "LeftToRight",
        RightToLeft = "RightToLeft"
    }
    enum Properties {
        AutoPlay = "AutoPlay",
        Height = "Height",
        ItemsDesktop = "ItemsDesktop",
        ItemsGap = "ItemsGap",
        ItemsPhone = "ItemsPhone",
        ItemsTablet = "ItemsTablet",
        Loop = "Loop",
        Navigation = "Navigation",
        Padding = "Padding",
        StartingPosition = "StartingPosition"
    }
    enum Provider {
        Splide = "Splide"
    }
    enum Navigation {
        Arrows = "arrows",
        Both = "both",
        Dots = "dots",
        None = "none"
    }
    enum Defaults {
        Height = "auto",
        SpaceNone = "0px"
    }
}
declare namespace OSFramework.OSUI.Patterns.Carousel {
    interface ICarousel extends Interface.IPattern {
        goTo(index: number): void;
        next(): void;
        previous(): void;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
        setCarouselDirection(direction: string): void;
        setProviderConfigs(providerConfigs: ProviderConfigs): void;
        setProviderEvent(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic, uniqueId: string): void;
        toggleDrag(hasDrag: boolean): void;
        toggleOnRender(blockOnRender: boolean): void;
        unsetProviderEvent(eventId: string): void;
        updateOnRender(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.DatePicker {
    abstract class AbstractDatePicker<P, C extends AbstractDatePickerConfig> extends AbstractProviderPattern<P, C> implements IDatePicker {
        constructor(uniqueId: string, configs: C);
        abstract clear(): void;
        abstract close(): void;
        abstract disableDays(value: string[]): void;
        abstract disableWeekDays(value: number[]): void;
        abstract open(): void;
        abstract setLanguage(value: string): void;
        abstract updateInitialDate(date1: string, date2?: string): void;
        abstract updatePrompt(promptMessage: string): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.DatePicker {
    abstract class AbstractDatePickerConfig extends Patterns.AbstractProviderConfiguration {
        DateFormat: string;
        FirstWeekDay: number;
        MaxDate: string;
        MinDate: string;
        ShowTodayButton: boolean;
        ShowWeekNumbers: boolean;
        TimeFormat: string;
        constructor(config: JSON);
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.DatePicker.Callbacks {
    type OSOnChangeEvent = {
        (datepickerId: string, selectedDate: string | string[]): void;
    };
}
declare namespace OSFramework.OSUI.Patterns.DatePicker.Factory {
    function NewDatePicker(datePickerId: string, configs: string, mode: Enum.Mode, provider: string): Patterns.DatePicker.IDatePicker;
}
declare namespace OSFramework.OSUI.Patterns.DatePicker.Enum {
    enum CssClass {
        Calendar = "osui-datepicker-calendar",
        Pattern = "osui-datepicker"
    }
    enum DatePickerEvents {
        OnChange = "OnChange",
        OnInitialize = "OnInitialize"
    }
    enum Mode {
        Range = "range",
        Single = "single"
    }
    enum Properties {
        DateFormat = "DateFormat",
        FirstWeekDay = "FirstWeekDay",
        MaxDate = "MaxDate",
        MinDate = "MinDate",
        ShowTodayButton = "ShowTodayButton",
        ShowWeekNumbers = "ShowWeekNumbers",
        TimeFormat = "TimeFormat"
    }
    enum Provider {
        FlatPicker = "flatpickr"
    }
    enum TimeFormatMode {
        Disable = "disabled",
        Time12hFormat = "12",
        Time24hFormat = "24"
    }
}
declare namespace OSFramework.OSUI.Patterns.DatePicker {
    interface IDatePicker extends Interface.IPattern {
        clear(): void;
        close(): void;
        disableDays(disableDays: string[]): void;
        disableWeekDays(disableDays: number[]): void;
        open(): void;
        setLanguage(value: string): void;
        setProviderConfigs(providerConfigs: ProviderConfigs): void;
        setProviderEvent(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic, uniqueId: string): void;
        unsetProviderEvent(eventId: string): void;
        updateInitialDate(date1: string, date2?: string): void;
        updatePrompt(promptMessage: string): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Dropdown {
    abstract class AbstractDropdown<P, C extends AbstractDropdownConfig> extends AbstractProviderPattern<P, C> implements IDropdown {
        constructor(uniqueId: string, configs: C);
        abstract clear(): void;
        abstract close(): void;
        abstract disable(): void;
        abstract enable(): void;
        abstract getSelectedValues(): string;
        abstract open(): void;
        abstract validation(isValid: boolean, validationMessage: string): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Dropdown {
    abstract class AbstractDropdownConfig extends Patterns.AbstractProviderConfiguration {
        IsDisabled: boolean;
        ShowDropboxAsPopup: boolean;
        constructor(config: JSON);
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.Dropdown.Callbacks {
    type OSOnSelectEvent = {
        (dropdownId: string, selectedOptions: string[]): void;
    };
}
declare namespace OSFramework.OSUI.Patterns.Dropdown.Factory {
    function NewDropdown(dropdownId: string, mode: string, provider: string, configs: string): Patterns.Dropdown.IDropdown;
}
declare namespace OSFramework.OSUI.Patterns.Dropdown.Enum {
    enum CssClass {
        DropdownLarge = "dropdown--is-large",
        DropdownSmall = "dropdown--is-small"
    }
    enum Mode {
        Search = "search",
        ServerSide = "server-side",
        Tags = "tags"
    }
    enum Properties {
        IsDisabled = "IsDisabled"
    }
    enum Provider {
        OSUIComponents = "osui-components",
        VirtualSelect = "virtual-select"
    }
}
declare namespace OSFramework.OSUI.Patterns.Dropdown {
    interface IDropdown extends Interface.IPattern {
        clear(): void;
        close(): void;
        disable(): void;
        enable(): void;
        getSelectedValues(): string;
        open(): void;
        setProviderConfigs(providerConfigs: ProviderConfigs): void;
        setProviderEvent(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic, uniqueId: string): void;
        unsetProviderEvent(eventId: string): void;
        validation(isValid: boolean, validationMessage: string): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Dropdown.ServerSide {
    class OSUIDropdownServerSide extends Patterns.AbstractParent<OSUIDropdownServerSideConfig, Patterns.DropdownServerSideItem.IDropdownServerSideItem> implements IDropdownServerSide {
        private _activeScreenElement;
        private _balloonContainerElement;
        private _balloonContentElement;
        private _balloonFocusableElemsInFooter;
        private _balloonFooterElement;
        private _balloonOptionsAriaLabel;
        private _balloonOptionsWrapperElement;
        private _balloonPositionClass;
        private _balloonSearchInputElement;
        private _balloonSearchInputWrapperElement;
        private _balloonWrapperElement;
        private _closeDynamically;
        private _eventOnBodyClick;
        private _eventOnClick;
        private _eventOnClickInputSearch;
        private _eventOnCloseTransitionEnd;
        private _eventOnOrientationChange;
        private _eventOnScreenScroll;
        private _eventOnSearchInputBlur;
        private _eventOnSearchInputFocus;
        private _eventOnSpanFocus;
        private _eventOnTouchMove;
        private _eventOnWindowResize;
        private _eventOnkeyboardPress;
        private _focusTrapInstance;
        private _hasA11yEnabled;
        private _intersectionObserver;
        private _isBlocked;
        private _isOpen;
        private _platformEventOnToggleCallback;
        private _selectValuesWrapper;
        private _selectValuesWrapperAriaLabel;
        private _selfElementBoundingClientRect;
        private _windowWidth;
        constructor(uniqueId: string, configs: JSON);
        private _addErrorMessage;
        private _close;
        private _endOfCloseAnimation;
        private _getRecommendedPosition;
        private _handleFocusTrap;
        private _hasNoImplementation;
        private _moveBallonElement;
        private _onBodyClick;
        private _onKeyboardPressed;
        private _onOrientationChange;
        private _onScreenScroll;
        private _onSearchInputBlur;
        private _onSearchInputClicked;
        private _onSearchInputFocus;
        private _onSelectValuesWrapperClicked;
        private _onSpanElementFocus;
        private _onTouchMove;
        private _onWindowResize;
        private _open;
        private _optionItemHasBeenClicked;
        private _optionItemKeyPressed;
        private _setBalloonCoordinates;
        private _setBalloonWrapperExtendedClass;
        private _setCssClasses;
        private _setInitialOptions;
        private _setNewOptionItem;
        private _setObserver;
        private _setUpEvents;
        private _touchMove;
        private _triggerToogleCalbackEvent;
        private _unsetEvents;
        private _unsetNewOptionItem;
        private _unsetObserver;
        private _updateBalloonAccessibilityElements;
        private _updateOptionItemFocuStateOnKeyPress;
        private _updatePatternState;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        beNotifiedByChild(childItem: Patterns.DropdownServerSideItem.DropdownServerSideItem, notifiedTo: Enum.ChildNotifyActionType): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        clear(): void;
        close(): void;
        disable(): void;
        dispose(): void;
        enable(): void;
        getSelectedValues(): string;
        open(): void;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
        setBalloonOptionsAriaLabel(value?: string): void;
        setProviderConfigs(): string;
        setProviderEvent(): string;
        setSelectAriaLabel(value?: string): void;
        unsetProviderEvent(): string;
        validation(isValid: boolean, validationMessage: string): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Dropdown.ServerSide {
    class OSUIDropdownServerSideConfig extends Patterns.AbstractConfiguration {
        private _balloonMaxHeight;
        private _balloonOptionsArialabel;
        private _selectValuesWrapperAriaLabel;
        AllowMultipleSelection: boolean;
        IsDisabled: boolean;
        constructor(config: JSON);
        validateDefault(key: string, value: unknown): unknown;
        get balloonMaxHeight(): number;
        get balloonOptionsArialabel(): string;
        get selectValuesWrapperAriaLabel(): string;
    }
}
declare namespace OSFramework.OSUI.Patterns.Dropdown.ServerSide.Enum {
    enum ChildNotifyActionType {
        Add = "add",
        Click = "click",
        KeyPressed = "keyPressed",
        Removed = "removed"
    }
    enum CssClass {
        BalloonContainer = "osui-dropdown-serverside__balloon-container",
        BalloonContent = "osui-dropdown-serverside__balloon-content",
        BalloonFooter = "osui-dropdown-serverside__balloon-footer",
        BalloonHasNotSearchInput = "osui-dropdown-serverside__balloon--has-not-search",
        BalloonPositionBottom = "osui-dropdown-serverside__balloon--is-bottom",
        BalloonPositionTop = "osui-dropdown-serverside__balloon--is-top",
        BalloonSearch = "osui-dropdown-serverside__balloon-search",
        BalloonWrapper = "osui-dropdown-serverside__balloon-wrapper",
        ErrorMessage = "osui-dropdown-serverside-error-message",
        IsDisabled = "osui-dropdown-serverside--is-disabled",
        IsOpened = "osui-dropdown-serverside--is-opened",
        IsVisible = "osui-dropdown-serverside-visible",
        NotValid = "osui-dropdown-serverside--not-valid",
        Pattern = "osui-dropdown-serverside",
        SearchInputIsFocused = "osui-dropdown-serverside__search-input--is-focused",
        SelectText = "osui-dropdown-serverside__text",
        SelectValuesWrapper = "osui-dropdown-serverside__selected-values-wrapper"
    }
    enum Events {
        OnToggle = "OnToggle"
    }
    enum InlineCssVariables {
        BalloonMaxHeight = "--osui-dropdown-ss-balloon-max-height",
        InputHeight = "--osui-dropdown-ss-input-height",
        Left = "--osui-dropdown-ss-left",
        ThresholVerticalAnimate = "--osui-dropdown-ss-thresholdanimateval",
        Top = "--osui-dropdown-ss-top",
        Width = "--osui-dropdown-ss-width"
    }
    enum Properties {
        AllowMultipleSelection = "AllowMultipleSelection",
        IsDisabled = "IsDisabled"
    }
    enum PropertiesValues {
        BalloonOptionsWrapperAriaLabelMultipleValue = "Select one or more options",
        BalloonOptionsWrapperAriaLabelSingleValue = "Select an option",
        MaxHeight = 320,
        SelectValuesWrapperAriaLabelValue = "Select an option",
        ThresholVerticalAnimateValue = 20
    }
}
declare namespace OSFramework.OSUI.Patterns.Dropdown.ServerSide {
    interface IDropdownServerSide extends Patterns.Dropdown.IDropdown, Interface.IParent {
    }
}
declare namespace OSFramework.OSUI.Patterns.DropdownServerSideItem.Callbacks {
    type OSOnSelectEvent = {
        (dropdownId: string, itemId: any): void;
    };
}
declare namespace OSFramework.OSUI.Patterns.DropdownServerSideItem {
    class DropdownServerSideItem extends AbstractChild<DropdownServerSideItemConfig, Dropdown.ServerSide.IDropdownServerSide> implements IDropdownServerSideItem {
        private _eventOnClick;
        private _eventOnkeyboardPress;
        private _platformEventOnClickCallback;
        keyboardTriggeredKey: string;
        constructor(uniqueId: string, configs: JSON);
        private _onKeyboardPressed;
        private _onSelected;
        private _removeEvents;
        private _setUpEvents;
        private _updateSelectedStatus;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        dispose(): void;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
        setBlur(): void;
        setFocus(): void;
        setTabindex(): void;
        toggleSelected(triggerCallback?: boolean): void;
        unsetTabindex(): void;
        get IsSelected(): boolean;
        get ItemId(): string;
    }
}
declare namespace OSFramework.OSUI.Patterns.DropdownServerSideItem {
    class DropdownServerSideItemConfig extends AbstractConfiguration {
        IsSelected: boolean;
        ItemId: string;
        constructor(config: JSON);
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.DropdownServerSideItem.Enum {
    enum CssClass {
        DropdownParentBalloon = "osui-dropdown-serverside__balloon-wrapper",
        IsSelected = "osui-dropdown-serverside-item--is-selected"
    }
    enum Events {
        OnSelected = "OnSelected"
    }
    enum Properties {
        IsSelected = "IsSelected",
        ItemId = "ItemId"
    }
}
declare namespace OSFramework.OSUI.Patterns.DropdownServerSideItem {
    interface IDropdownServerSideItem extends Interface.IChild {
        keyboardTriggeredKey: string;
        get IsSelected(): boolean;
        get ItemId(): string;
        toggleSelected(triggerCallback?: boolean): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.FlipContent.Enum {
    enum Properties {
        FlipSelf = "FlipSelf",
        IsFlipped = "IsFlipped"
    }
    enum CssClass {
        PatternBack = "osui-flip-content__container__back",
        PatternContainer = "osui-flip-content__container",
        PatternDataFlipped = "data-flipped",
        PatternFlipSelf = "osui-flip-content--flip-self",
        PatternFront = "osui-flip-content__container__front",
        PatternIsFlipped = "osui-flip-content--flipped"
    }
    enum Events {
        OnToggle = "OnToggle"
    }
}
declare namespace OSFramework.OSUI.Patterns.FlipContent {
    class FlipContent extends AbstractPattern<FlipContentConfig> implements IFlipContent {
        private _eventClick;
        private _eventKeydown;
        private _flipWrapperElement;
        private _platformEventOnToggle;
        constructor(uniqueId: string, configs: JSON);
        private _keydownCallback;
        private _removeEvents;
        private _setEventHandlers;
        private _setStartsFlipped;
        private _toggleClasses;
        private _triggerPlatformEvent;
        private _updateA11yProperties;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        dispose(): void;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
        showBackContent(): void;
        showFrontContent(): void;
        toggleFlipContent(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.FlipContent {
    class FlipContentConfig extends AbstractConfiguration {
        FlipSelf: boolean;
        IsFlipped: boolean;
        constructor(config: JSON);
        validateCanChange(isBuilt: boolean, key: string): boolean;
    }
}
declare namespace OSFramework.OSUI.Patterns.FlipContent {
    interface IFlipContent extends Interface.IPattern {
        showBackContent(): void;
        showFrontContent(): void;
        toggleFlipContent(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Gallery.Enum {
    enum CssVariables {
        PatternItemsDesktop = "--gallery-desktop-items",
        PatternItemsTablet = "--gallery-tablet-items",
        PatternItemsPhone = "--gallery-phone-items",
        PatternItemsGap = "--gallery-gap",
        PatternListItemsDesktop = "--gallery-list-desktop-items",
        PatternListItemsTablet = "--gallery-list-tablet-items",
        PatternListItemsPhone = "--gallery-list-phone-items"
    }
    enum Properties {
        ItemsGap = "ItemsGap",
        RowItemsDesktop = "RowItemsDesktop",
        RowItemsPhone = "RowItemsPhone",
        RowItemsTablet = "RowItemsTablet",
        MinRowItemsAllowed = 1
    }
}
declare namespace OSFramework.OSUI.Patterns.Gallery {
    class Gallery extends AbstractPattern<GalleryConfig> implements IGallery {
        constructor(uniqueId: string, configs: JSON);
        private _setItemsGap;
        private _setRowItemsDesktop;
        private _setRowItemsPhone;
        private _setRowItemsTablet;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Gallery {
    class GalleryConfig extends AbstractConfiguration {
        ItemsGap: string;
        RowItemsDesktop: number;
        RowItemsPhone: number;
        RowItemsTablet: number;
        constructor(config: JSON);
    }
}
declare namespace OSFramework.OSUI.Patterns.Gallery {
    interface IGallery extends Interface.IPattern {
    }
}
declare namespace OSFramework.OSUI.Patterns.InlineSvg.Callbacks {
    type OSInitializedEvent = {
        (inlineSvgId: string): void;
    };
}
declare namespace OSFramework.OSUI.Patterns.InlineSvg.Enum {
    enum CssClass {
        Pattern = "osui-inline-svg"
    }
    enum Properties {
        SVGCode = "SVGCode"
    }
}
declare namespace OSFramework.OSUI.Patterns.InlineSvg {
    interface IInlineSvg extends Interface.IPattern {
    }
}
declare namespace OSFramework.OSUI.Patterns.InlineSvg {
    class InlineSvg extends AbstractPattern<InlineSvgConfig> implements IInlineSvg {
        constructor(uniqueId: string, configs: JSON);
        private _setSvgCode;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        dispose(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.InlineSvg {
    class InlineSvgConfig extends AbstractConfiguration {
        SVGCode: string;
        constructor(config: any);
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.MonthPicker {
    abstract class AbstractMonthPicker<P, C extends AbstractMonthPickerConfig> extends AbstractProviderPattern<P, C> implements IMonthPicker {
        constructor(uniqueId: string, configs: C);
        abstract clear(): void;
        abstract close(): void;
        abstract open(): void;
        abstract setLanguage(value: string): void;
        abstract updateInitialMonth(monthYear: MonthYear): void;
        abstract updatePrompt(promptMessage: string): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.MonthPicker {
    abstract class AbstractMonthPickerConfig extends Patterns.AbstractProviderConfiguration {
        DateFormat: string;
        InitialMonth: MonthYear;
        MaxMonth: MonthYear;
        MinMonth: MonthYear;
        constructor(config: JSON);
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.MonthPicker.Callbacks {
    type OSOnSelectedEvent = {
        (monthPickerId: string, selectedMonth: string, monthOrder: number, selectedYear: number): void;
    };
}
declare namespace OSFramework.OSUI.Patterns.MonthPicker.Enum {
    enum CssClass {
        Dropdown = "osui-monthpicker__dropdown",
        Pattern = "osui-monthpicker"
    }
    enum Events {
        OnSelected = "OnSelected"
    }
    enum Properties {
        DateFormat = "DateFormat",
        InitialMonth = "InitialMonth",
        MinMonth = "MinMonth",
        MaxMonth = "MaxMonth"
    }
    enum Provider {
        Flatpickr = "flatpickr"
    }
}
declare namespace OSFramework.OSUI.Patterns.MonthPicker {
    interface IMonthPicker extends Interface.IPattern, Interface.IOpenable {
        clear(): void;
        setLanguage(value: string): void;
        setProviderConfigs(providerConfigs: ProviderConfigs): void;
        setProviderEvent(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic, uniqueId: string): void;
        unsetProviderEvent(eventId: string): void;
        updateInitialMonth(monthYear: MonthYear): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.MonthPicker.Factory {
    function NewMonthPicker(monthPickerId: string, provider: string, configs: string): OSFramework.OSUI.Patterns.MonthPicker.IMonthPicker;
}
declare namespace OSFramework.OSUI.Patterns.Notification.Callbacks {
    type OSOnToggleEvent = {
        (notificationId: string, isOpen: boolean): void;
    };
}
declare namespace OSFramework.OSUI.Patterns.Notification.Enum {
    enum CssClass {
        Pattern = "osui-notification",
        PatternIsOpen = "osui-notification--is-open",
        PatternPosition = "osui-notification--is-"
    }
    enum CssProperty {
        Width = "--notification-width"
    }
    enum Defaults {
        DefaultPosition = "top",
        DefaultWidth = "370px"
    }
    enum Events {
        OnToggle = "OnToggle"
    }
    enum Properties {
        CloseAfterTime = "CloseAfterTime",
        InteractToClose = "InteractToClose",
        NeedsSwipes = "NeedsSwipes",
        Position = "Position",
        StartsOpen = "StartsOpen",
        Width = "Width"
    }
}
declare namespace OSFramework.OSUI.Patterns.Notification {
    interface INotification extends Interface.IPattern {
        hide(): void;
        show(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Notification {
    class Notification extends AbstractPattern<NotificationConfig> implements INotification, Interface.ISwipeEvent {
        private _eventOnClick;
        private _eventOnKeypress;
        private _eventType;
        private _focusManagerInstance;
        private _focusTrapInstance;
        private _gestureEventInstance;
        private _hasGestureEvents;
        private _isOpen;
        private _parentSelf;
        private _platformEventOnToggle;
        constructor(uniqueId: string, configs: JSON);
        private _autoCloseNotification;
        private _clickCallback;
        private _handleFocusBehavior;
        private _handleGestureEvents;
        private _hideNotification;
        private _keypressCallback;
        private _removeEvents;
        private _showNotification;
        private _triggerOnToggleEvent;
        private _updateA11yProperties;
        private _updateCloseAfterTime;
        private _updateInteractToClose;
        private _updatePosition;
        private _updateWidth;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected setInitialStates(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: any): void;
        dispose(): void;
        hide(): void;
        onSwipeBottom(): void;
        onSwipeLeft(): void;
        onSwipeRight(): void;
        onSwipeUp(): void;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
        removeGestureEvents(): void;
        setGestureEvents(onSwipeDownCallback: Event.GestureEvent.Callbacks.SwipeDown, onSwipeLeftCallback: Event.GestureEvent.Callbacks.SwipeLeft, onSwipeRightCallback: Event.GestureEvent.Callbacks.SwipeRight, onSwipeUpCallback: Event.GestureEvent.Callbacks.SwipeUp): void;
        show(): void;
        get gestureEventInstance(): Event.GestureEvent.SwipeEvent;
        get hasGestureEvents(): boolean;
    }
}
declare namespace OSFramework.OSUI.Patterns.Notification {
    class NotificationConfig extends AbstractConfiguration {
        CloseAfterTime: number;
        InteractToClose: boolean;
        NeedsSwipes: boolean;
        Position: string;
        StartsOpen: boolean;
        Width: string;
        validateCanChange(isBuilt: boolean, key: string): boolean;
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.OverflowMenu.Callbacks {
    type OSOnToggleEvent = {
        (overflowMenuId: string, isOpen: boolean): void;
    };
}
declare namespace OSFramework.OSUI.Patterns.OverflowMenu.Enum {
    enum AriaLabel {
        Trigger = "Trigger the balloon"
    }
    enum CssClass {
        Open = "osui-overflow-menu--is-open",
        Trigger = "osui-overflow-menu__trigger",
        Balloon = "osui-overflow-menu__balloon"
    }
    enum CssCustomProperties {
        Shape = "--osui-overflow-menu-shape"
    }
    enum Events {
        OnMenuToggle = "OnToggle"
    }
    enum Properties {
        Position = "Position",
        Shape = "Shape"
    }
}
declare namespace OSFramework.OSUI.Patterns.OverflowMenu {
    interface IOverflowMenu extends Interface.IPattern, Interface.IOpenable {
        disable(): void;
        enable(): void;
        open(isOpenedByApi?: boolean, arrowKeyPressed?: GlobalEnum.Keycodes.ArrowDown | GlobalEnum.Keycodes.ArrowUp): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.OverflowMenu {
    class OverflowMenu extends AbstractPattern<OverflowMenuConfig> implements IOverflowMenu {
        private _ariaLabelTrigger;
        private _balloonElem;
        private _balloonFeature;
        private _eventBalloonOnToggle;
        private _eventOnClick;
        private _eventOnKeydown;
        private _isDisabled;
        private _isOpenedByApi;
        private _platformEventOnToggle;
        private _triggerElem;
        balloonOptions: Feature.Balloon.BalloonOptions;
        isOpen: boolean;
        constructor(uniqueId: string, configs: JSON);
        private _balloonOnToggleCallback;
        private _onClickCallback;
        private _onKeydownCallback;
        private _setBalloonFeature;
        private _setOverflowMenuShape;
        private _togglePattern;
        private _triggerOnToggleEvent;
        protected removeEventListeners(): void;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setEventListeners(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        close(): void;
        disable(): void;
        dispose(): void;
        enable(): void;
        open(isOpenedByApi: boolean, keyPressed?: GlobalEnum.Keycodes.ArrowDown | GlobalEnum.Keycodes.ArrowUp): void;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
        setBalloonOptions(balloonOptions?: Feature.Balloon.BalloonOptions): void;
        setTriggerAriaLabel(ariaLabelText: string): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.OverflowMenu {
    class OverflowMenuConfig extends AbstractConfiguration {
        Position: GlobalEnum.FloatingPosition;
        Shape: GlobalEnum.ShapeTypes;
        constructor(config: JSON);
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.Progress {
    abstract class AbstractProgress<C extends ProgressConfiguration> extends AbstractPattern<C> implements IProgress {
        private _eventAnimateEntranceEnd;
        protected contentElem: HTMLElement;
        protected gradientLength: number;
        protected progressElem: HTMLElement;
        protected progressType: ProgressEnum.ProgressTypes;
        constructor(uniqueId: string, configs: C);
        private _animateEntranceEnd;
        private _setAccessibilityProps;
        protected animateInitial(): void;
        protected animateOnValueChange(): void;
        protected setCallbacks(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        protected updatedProgressValue(): void;
        build(): void;
        progressApplyGradient(gradientType: string, colors: GradientColor): void;
        resetProgressValue(): void;
        setProgressValue(value: number): void;
        protected abstract addInitialAnimation(): void;
        protected abstract setElementProgressValue(value: number): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Progress {
    abstract class ProgressConfiguration extends AbstractConfiguration {
        AnimateInitialProgress: boolean;
        InitialProgress: number;
        Progress: number;
        ProgressCircleSize: string;
        ProgressColor: string;
        Shape: string;
        Thickness: number;
        TrailColor: string;
        constructor(config: any);
    }
}
declare namespace OSFramework.OSUI.Patterns.Progress {
    interface IProgress extends Interface.IPattern {
        progressApplyGradient(gradientType: string, colors: GradientColor): void;
        resetProgressValue(): void;
        setProgressValue(value: number): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Progress.ProgressEnum {
    enum AriaLabel {
        Progress = "progress"
    }
    enum CssClass {
        AddInitialAnimation = "animate-entrance",
        AnimateProgressChange = "animate-progress-change",
        Container = "osui-progress-bar__container",
        ProgressBarContent = "osui-progress-bar__content",
        ProgressCircleContent = "osui-progress-circle__content"
    }
    enum InlineStyleProp {
        ProgressColor = "--progress-color",
        ProgressValue = "--progress-value",
        ProgressGradient = "--progress-gradient",
        Shape = "--shape",
        Thickness = "--thickness",
        TrailColor = "--trail-color"
    }
    enum Gradient {
        LinearHorizontal = "LinearHorizontal",
        LinearVertical = "LinearVertical",
        LinearDiagonally = "LinearDiagonally",
        Radial = "Radial"
    }
    enum Properties {
        ExtendedClass = "ExtendedClass",
        MaxProgressValue = 100,
        MinProgressValue = 0,
        Progress = "Progress",
        ProgressColor = "ProgressColor",
        ProgressCircleSize = "ProgressCircleSize",
        Shape = "Shape",
        Thickness = "Thickness",
        TrailColor = "TrailColor"
    }
    enum ProgressTypes {
        Bar = "Bar",
        Circle = "Circle"
    }
    enum ShapeTypes {
        Round = "round",
        Rounded = "rounded",
        Soft = "soft",
        Sharp = "sharp"
    }
}
declare namespace OSFramework.OSUI.Patterns.Progress.Factory {
    function NewProgress(progressId: string, type: string, configs: string): Patterns.Progress.IProgress;
}
declare namespace OSFramework.OSUI.Patterns.Progress.Bar {
    class Bar extends Progress.AbstractProgress<ProgressBarConfig> {
        constructor(uniqueId: string, configs: any);
        private _setCssVariables;
        private _updateProgressColor;
        private _updateShape;
        private _updateThickness;
        private _updateTrailColor;
        protected addInitialAnimation(): void;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setElementProgressValue(value: number): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        dispose(): void;
        progressApplyGradient(gradientType: string, colors: GradientColor): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Progress.Bar {
    class ProgressBarConfig extends Progress.ProgressConfiguration {
        constructor(config: any);
    }
}
declare namespace OSFramework.OSUI.Patterns.Progress.Circle.Enum {
    enum CssClass {
        Progress = "osui-progress-circle__container__progress-path",
        SVG = "svg-wrapper",
        Trail = "osui-progress-circle__container__trail-path"
    }
    enum InlineStyleProp {
        CircleRadius = "--radius",
        CircleSize = "--circle-size",
        GradientURL = "--progress-circle-gradient-url",
        ProgressCircleSize = "--progress-circle-size",
        StrokeDasharray = "--stroke-dasharray",
        StrokeDashoffset = "--stroke-dashoffset"
    }
    enum DefaultValues {
        GradientId = "progressGradient-",
        RadialFr = "15%",
        RadialRadius = "95%",
        Size = "auto"
    }
    enum GradientName {
        Linear = "linearGradient",
        Radial = "radialGradient"
    }
}
declare namespace OSFramework.OSUI.Patterns.Progress.Circle {
    class Circle extends Progress.AbstractProgress<ProgressCircleConfig> {
        private _blockParent;
        private _circleCircumference;
        private _circleSize;
        private _gradientElem;
        private _needsResizeObserver;
        private _resizeObserver;
        private _strokeDasharray;
        private _strokeDashoffset;
        linearGradientCoords: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        };
        radialGradientCoords: {
            fr: Enum.DefaultValues;
            r: Enum.DefaultValues;
        };
        constructor(uniqueId: string, configs: any);
        private _addResizeOberser;
        private _checkResizeObserver;
        private _progressToOffset;
        private _removeResizeOberver;
        private _setCssVariables;
        private _setGradientCoords;
        private _updateCircleProps;
        private _updateProgressValue;
        protected addInitialAnimation(): void;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setElementProgressValue(value: number): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        protected updateProgressColor(): void;
        protected updateShape(): void;
        protected updateThickness(): void;
        protected updateTrailColor(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        createSVGGradient(gradientId: string, gradientName: string, gradientCoords: unknown, gradientLenght: number, colors: GradientColor): void;
        dispose(): void;
        progressApplyGradient(gradientType: string, colors: GradientColor): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Progress.Circle {
    class ProgressCircleConfig extends Progress.ProgressConfiguration {
        constructor(config: any);
    }
}
declare namespace OSFramework.OSUI.Patterns.RangeSlider {
    abstract class AbstractRangeSlider<P, C extends AbstractRangeSliderConfig> extends AbstractProviderPattern<P, C> implements IRangeSlider {
        constructor(uniqueId: string, configs: C);
        abstract disable(): void;
        abstract enable(): void;
        abstract setRangeIntervalChangeOnDragEnd(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.RangeSlider {
    abstract class AbstractRangeSliderConfig extends Patterns.AbstractProviderConfiguration {
        InitialValueFrom: number;
        InitialValueTo: number;
        IsDisabled: boolean;
        IsInterval: boolean;
        MaxValue: number;
        MinValue: number;
        Orientation: Orientation;
        ShowFloatingLabel: boolean;
        ShowTickMarks: boolean;
        Size: string;
        StartingValueFrom: number;
        StartingValueTo: number;
        Step: number;
        TickMarksInterval: number;
        constructor(config: JSON);
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.RangeSlider.Callbacks {
    type OSOnValueChangeEvent = {
        (rangeSliderId: string, startValue: number, endValue: number): void;
    };
}
declare namespace OSFramework.OSUI.Patterns.RangeSlider.Enum {
    enum CssClass {
        ClassModifier = "osui-range-slider--is-",
        IsInterval = "osui-range-slider--is-interval",
        HasTicks = "osui-range-slider--has-ticks",
        RangeSlider = "osui-range-slider",
        RangeSliderProviderElem = "osui-range-slider__provider"
    }
    enum CssProperties {
        Size = "--range-slider-size"
    }
    enum DefaultValues {
        PercentualSize = "100%",
        PixelSize = "100px"
    }
    enum Mode {
        Single = "single",
        Interval = "interval"
    }
    enum Properties {
        InitialValueTo = "InitialValueTo",
        InitialValueFrom = "InitialValueFrom",
        IsDisabled = "IsDisabled",
        MaxValue = "MaxValue",
        MinValue = "MinValue",
        Orientation = "Orientation",
        ShowTickMarks = "ShowTickMarks",
        ShowFloatingLabel = "ShowFloatingLabel",
        Size = "Size",
        StartingValueTo = "StartingValueTo",
        StartingValueFrom = "StartingValueFrom",
        Step = "Step",
        TickMarksInterval = "TickMarksInterval"
    }
    enum Provider {
        NoUiSlider = "noUiSlider"
    }
    enum RangeSliderEvents {
        OnInitialize = "OnInitialize",
        OnValueChange = "OnValueChange"
    }
    enum RangeSliderTypes {
        Slider = "slider",
        Interval = "interval"
    }
}
declare namespace OSFramework.OSUI.Patterns.RangeSlider {
    interface IRangeSlider extends Interface.IPattern {
        disable(uniqueId: string): void;
        enable(uniqueId: string): void;
        setProviderConfigs(providerConfigs: ProviderConfigs): void;
        setProviderEvent(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic, uniqueId: string): void;
        unsetProviderEvent(eventId: string): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.RangeSlider.Factory {
    function NewRangeSlider(rangeSliderId: string, configs: string, mode: Enum.Mode, provider: string): Patterns.RangeSlider.IRangeSlider;
}
declare namespace OSFramework.OSUI.Patterns.Rating.Enum {
    enum CssClass {
        IconStates = "icon-states",
        IsEdit = "is-edit",
        IsHalf = "is-half",
        RatingInput = "rating-input",
        RatingItem = "rating-item",
        Size = "rating-",
        WCAGHideText = "wcag-hide-text"
    }
    enum Events {
        OnSelected = "OnSelected"
    }
    enum Properties {
        IsEdit = "IsEdit",
        MaxRatingScale = 100,
        MinRatingScale = 0,
        RatingScale = "RatingScale",
        RatingValue = "RatingValue",
        Size = "Size"
    }
}
declare namespace OSFramework.OSUI.Patterns.Rating {
    interface IRating extends Interface.IPattern {
    }
}
declare namespace OSFramework.OSUI.Patterns.Rating {
    class Rating extends AbstractPattern<RatingConfig> implements IRating {
        private _clonedPlaceholders;
        private _decimalValue;
        private _disabled;
        private _eventOnRatingClick;
        private _isHalfValue;
        private _platformEventOnSelect;
        private _ratingFieldsetElem;
        private _ratingHasEventAdded;
        private _ratingIconStatesElem;
        private _ratingInputName;
        constructor(uniqueId: string, configs: JSON);
        private _createItems;
        private _getDecimalValue;
        private _getIsHalfValue;
        private _getValue;
        private _handlePlaceholders;
        private _manageRatingEvent;
        private _ratingOnClick;
        private _removeEvents;
        private _renderItem;
        private _setFieldsetDisabledStatus;
        private _setInitialCssClasses;
        private _setInitialPropertiesValues;
        private _setIsDisabled;
        private _setIsEdit;
        private _setScale;
        private _setSize;
        private _setValue;
        private _triggerOnSelectEvent;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        dispose(): void;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Rating {
    class RatingConfig extends AbstractConfiguration {
        IsEdit: boolean;
        RatingScale: number;
        RatingValue: number;
        Size: string;
        constructor(config: JSON);
    }
}
declare namespace OSFramework.OSUI.Patterns.Search.Enum {
    enum CssClass {
        Pattern = "osui-search",
        PatternGlassBar = "osui-search__glass-bar",
        PatternGlassButton = "osui-search__glass-button",
        PatternGlassCircle = "osui-search__glass-circle",
        PatternInput = "osui-search__input",
        PatternIsOpen = "osui-search--is-open",
        PatternNative = "osui-search--native"
    }
    enum AriaLabel {
        Close = "Close search",
        Open = "Open search"
    }
}
declare namespace OSFramework.OSUI.Patterns.Search {
    interface ISearch extends Interface.IPattern {
        IsNativeEnabled: boolean;
        IsOpen: boolean;
        enableNativeBehavior(): void;
        setAriaLabel(openAriaLabel: string, closeAriaLabel: string): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Search {
    class Search extends AbstractPattern<SearchConfig> implements ISearch {
        private _enableNative;
        private _isOpen;
        private _searchCloseAriaLabel;
        private _searchGlassButton;
        private _searchInput;
        private _searchOpenAriaLabel;
        constructor(uniqueId: string, configs: JSON);
        private _nativeSearchBehavior;
        private _removeEvents;
        private _toggleNativeSearch;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        dispose(): void;
        enableNativeBehavior(): void;
        setAriaLabel(openAriaLabel: string, closeAriaLabel: string): void;
        get IsNativeEnabled(): boolean;
        get IsOpen(): boolean;
    }
}
declare namespace OSFramework.OSUI.Patterns.Search {
    class SearchConfig extends AbstractConfiguration {
        constructor(config: JSON);
    }
}
declare namespace OSFramework.OSUI.Patterns.SectionIndex.Enum {
    enum ChildNotifyActionType {
        Active = "active",
        Add = "add",
        Click = "click",
        KeyPressed = "keyPressed",
        Inactive = "unactive",
        Removed = "removed"
    }
    enum CssClass {
        IsActiveItem = "osui-section-index-item--is-active",
        IsSticky = "osui-section-index--is-sticky",
        Pattern = "osui-section-index"
    }
    enum CssVariable {
        TopPosition = "--top-position"
    }
    enum Properties {
        IsFixed = "IsFixed",
        SmoothScrolling = "SmoothScrolling"
    }
}
declare namespace OSFramework.OSUI.Patterns.SectionIndex {
    interface ISectionIndex extends Interface.IParent {
        contentPaddingTop: string | number;
    }
}
declare namespace OSFramework.OSUI.Patterns.SectionIndex {
    class SectionIndex extends AbstractParent<SectionIndexConfig, SectionIndexItem.ISectionIndexItem> implements ISectionIndex {
        private _activeSectionIndexItem;
        private _contentPaddingTop;
        private _mainScrollContainerElement;
        private _navigateOnClick;
        private _scrollTimeout;
        constructor(uniqueId: string, configs: JSON);
        private _addSectionIndexItem;
        private _childItemHasBeenClicked;
        private _getContentPaddingTop;
        private _removeSectionIndexItem;
        private _setActiveChildOnClick;
        private _setActiveChildOnScroll;
        private _toggleIsFixed;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        beNotifiedByChild(childItem: Patterns.SectionIndexItem.SectionIndexItem, notifiedTo: Enum.ChildNotifyActionType): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        dispose(): void;
        get contentPaddingTop(): string | number;
    }
}
declare namespace OSFramework.OSUI.Patterns.SectionIndex {
    class SectionIndexConfig extends AbstractConfiguration {
        IsFixed: boolean;
        SmoothScrolling: boolean;
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.SectionIndexItem.Enum {
    enum Properties {
        ScrollToWidgetId = "ScrollToWidgetId"
    }
    enum DataTypes {
        dataItem = "data-item"
    }
}
declare namespace OSFramework.OSUI.Patterns.SectionIndexItem {
    interface ISectionIndexItem extends Interface.IChild {
        IsSelected: boolean;
        TargetElement: HTMLElement;
        TargetElementOffset: OffsetValues;
        setIsActive(): void;
        unsetIsActive(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.SectionIndexItem {
    class SectionIndexItem extends AbstractChild<SectionIndexItemConfig, SectionIndex.ISectionIndex> implements ISectionIndexItem {
        private _eventOnClick;
        private _eventOnScreenScroll;
        private _eventOnkeyBoardPress;
        private _headerHeight;
        private _headerIsFixed;
        private _isActive;
        private _mainScrollContainerElement;
        private _targetElement;
        private _targetElementOffset;
        constructor(uniqueId: string, configs: JSON);
        private _onKeyboardPressed;
        private _onScreenScroll;
        private _onSelected;
        private _removeEvents;
        private _setHeaderSize;
        private _setLinkAttribute;
        private _setTargetElement;
        private _setTargetOffsetInfo;
        private _setUpEvents;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        dispose(): void;
        setIsActive(): void;
        unsetIsActive(): void;
        get IsSelected(): boolean;
        get TargetElement(): HTMLElement;
        get TargetElementOffset(): OffsetValues;
    }
}
declare namespace OSFramework.OSUI.Patterns.SectionIndexItem {
    class SectionIndexItemConfig extends AbstractConfiguration {
        ScrollToWidgetId: string;
        validateCanChange(isBuilt: boolean, key: string): boolean;
    }
}
declare namespace OSFramework.OSUI.Patterns.Sidebar.Callbacks {
    type OSOnToggleEvent = {
        (sidebarId: string, isOpen: boolean): void;
    };
}
declare namespace OSFramework.OSUI.Patterns.Sidebar.Enum {
    enum Properties {
        StartsOpen = "StartsOpen",
        Direction = "Direction",
        Width = "Width",
        HasOverlay = "HasOverlay"
    }
    enum Defaults {
        Width = "500px"
    }
    enum CssClass {
        Aside = "osui-sidebar",
        Content = "osui-sidebar__content",
        ClassModifier = "osui-sidebar--is-",
        HasOverlay = "osui-sidebar--has-overlay",
        Header = "osui-sidebar__header",
        IsOpen = "osui-sidebar--is-open",
        Overlay = "osui-sidebar__overlay"
    }
    enum CssProperty {
        Width = "--sidebar-width"
    }
    enum Events {
        OnToggle = "OnToggle"
    }
}
declare namespace OSFramework.OSUI.Patterns.Sidebar {
    interface ISidebar extends Interface.IPattern, Interface.IOpenable {
        clickOutsideToClose(closeOnOutSIdeClick: boolean): void;
        toggleGestures(enableSwipe: boolean): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Sidebar {
    class Sidebar extends AbstractPattern<SidebarConfig> implements ISidebar, Interface.IDragEvent {
        private _animateOnDragInstance;
        private _clickOutsideToClose;
        private _clickedOutsideElement;
        private _currentDirectionCssClass;
        private _eventOverlayClick;
        private _eventOverlayMouseDown;
        private _eventSidebarKeypress;
        private _focusManagerInstance;
        private _focusTrapInstance;
        private _gestureEventInstance;
        private _hasGestureEvents;
        private _isOpen;
        private _parentSelf;
        private _platformEventOnToggle;
        constructor(uniqueId: string, configs: JSON);
        private _closeSidebar;
        private _handleFocusBehavior;
        private _handleGestureEvents;
        private _onGestureEnd;
        private _onGestureMove;
        private _onGestureStart;
        private _openSidebar;
        private _overlayClickCallback;
        private _overlayMouseDownCallback;
        private _removeEvents;
        private _setDirection;
        private _setHasOverlay;
        private _setInitialCssClasses;
        private _setWidth;
        private _sidebarKeypressCallback;
        private _toggle;
        private _toggleGesturesSidebar;
        private _triggerOnToggleEvent;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        clickOutsideToClose(closeOnOutSideClick: boolean): void;
        close(): void;
        dispose(): void;
        open(): void;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
        removeGestureEvents(): void;
        setGestureEvents(onGestureStartCallback: Event.GestureEvent.Callbacks.GestureStart, onGestureMoveCallback: Event.GestureEvent.Callbacks.GestureMove, onGestureEndCallback: Event.GestureEvent.Callbacks.GestureEnd): void;
        toggleGestures(enableSwipe: boolean): void;
        get gestureEventInstance(): Event.GestureEvent.DragEvent;
        get hasGestureEvents(): boolean;
    }
}
declare namespace OSFramework.OSUI.Patterns.Sidebar {
    class SidebarConfig extends AbstractConfiguration {
        Direction: GlobalEnum.Direction;
        HasOverlay: boolean;
        StartsOpen: boolean;
        Width: string;
        constructor(config: JSON);
        validateCanChange(isBuilt: boolean, key: string): boolean;
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.Submenu.Enum {
    enum CssClass {
        Pattern = "osui-submenu",
        PatternActive = "active",
        PatternHeader = "osui-submenu__header",
        PatternIsDropdown = "osui-submenu--is-dropdown",
        PatternIsHidden = "osui-submenu--is-hidden",
        PatternIsHover = "osui-submenu--is-hover",
        PatternIsOpen = "osui-submenu--is-open",
        PatternIcon = "osui-submenu__header__icon",
        PatternItem = "osui-submenu__header__item",
        PatternLinks = "osui-submenu__items"
    }
    enum Events {
        OnToggle = "OnToggle"
    }
    enum Properties {
        OpenOnHover = "OpenOnHover"
    }
}
declare namespace OSFramework.OSUI.Patterns.Submenu {
    interface ISubmenu extends Interface.IPattern, Interface.IOpenable, Interface.IRenderUpdate {
        clickOutsideToClose(clickOutsideToClose: boolean): void;
        setOpenOnHover(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Submenu {
    class Submenu extends AbstractPattern<SubmenuConfig> implements ISubmenu {
        private _eventBalloonKeypress;
        private _eventClick;
        private _eventKeypress;
        private _eventOnMouseEnter;
        private _eventOnMouseLeave;
        private _focusManagerInstance;
        private _focusTrapInstance;
        private _globalEventBody;
        private _hasActiveLinks;
        private _hasElements;
        private _isActive;
        private _isOpen;
        private _platformEventOnToggleCallback;
        private _submenuActiveLinksElement;
        private _submenuAllLinksElement;
        private _submenuHeaderElement;
        private _submenuLinksElement;
        hasClickOutsideToClose: boolean;
        constructor(uniqueId: string, configs: JSON);
        private _bodyClickCallback;
        private _checkForActiveLinks;
        private _clickCallback;
        private _handleFocusBehavior;
        private _keypressBalloonCallback;
        private _keypressCallback;
        private _onMouseEnterCallback;
        private _onMouseLeaveCallback;
        private _removeActive;
        private _removeEvents;
        private _setActive;
        private _show;
        private _toggleSubmenu;
        private _updateA11yProperties;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected setInitialStates(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        clickOutsideToClose(clickOutsideToClose: boolean): void;
        close(): void;
        dispose(): void;
        open(): void;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
        setOpenOnHover(): void;
        updateOnRender(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Submenu {
    class SubmenuConfig extends AbstractConfiguration {
        OpenOnHover: boolean;
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.SwipeEvents.Enum {
    enum Events {
        SwipeUp = "SwipeUp",
        SwipeDown = "SwipeDown",
        SwipeRight = "SwipeRight",
        SwipeLeft = "SwipeLeft"
    }
    enum Properties {
        Threshold = 10,
        Velocity = 0.3
    }
}
declare namespace OSFramework.OSUI.Patterns.SwipeEvents {
    interface ISwipeEvents extends Interface.IPattern {
        EventGestureEnd: GlobalCallbacks.Generic;
        EventGestureMove: GlobalCallbacks.Generic;
    }
}
declare namespace OSFramework.OSUI.Patterns.SwipeEvents {
    class SwipeEvents extends AbstractPattern<SwipeEventsConfig> implements ISwipeEvents {
        private _gestureMoveEvent;
        private _gestureStartEvent;
        private _swipableElement;
        private _swipeDownCallback;
        private _swipeLeftCallback;
        private _swipeRightCallback;
        private _swipeUpCallback;
        private _threshold;
        private _velocity;
        constructor(uniqueId: string, configs: JSON);
        private _removeEventListeners;
        private _setEventListeners;
        private _triggerSwipeDown;
        private _triggerSwipeLeft;
        private _triggerSwipeRight;
        private _triggerSwipeUp;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        EventGestureEnd(offsetX: number, offsetY: number, timeTaken: number): void;
        EventGestureMove(event: TouchEvent): void;
        build(): void;
        dispose(): void;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.SwipeEvents {
    class SwipeEventsConfig extends AbstractConfiguration {
        WidgetId: string;
        constructor(config: JSON);
    }
}
declare namespace OSFramework.OSUI.Patterns.Tabs.Callbacks {
    type OSOnChangeEvent = {
        (tabsId: string, ActiveTab: number): void;
    };
}
declare namespace OSFramework.OSUI.Patterns.Tabs.Enum {
    enum ChildNotifyActionType {
        AddContentItem = "add-content-item",
        AddHeaderItem = "add-header-item",
        Click = "click",
        RemovedContentItem = "removed-content-item",
        RemovedHeaderItem = "removed-header-item",
        DisabledHeaderItem = "disabled-header-item",
        EnabledHeaderItem = "enabled-header-item",
        UpdateIndicator = "update-indicator"
    }
    enum CssClasses {
        ActiveTab = "osui-tabs--is-active",
        IsVertical = "osui-tabs--is-vertical",
        IsHorizontal = "osui-tabs--is-horizontal",
        IsJustified = "osui-tabs--is-justified",
        HasContentAutoHeight = "osui-tabs--has-auto-height",
        HasDragGestures = "osui-tabs--has-drag",
        Modifier = "osui-tabs--is-",
        TabsWrapper = "osui-tabs",
        TabsHeader = "osui-tabs__header",
        TabsContent = "osui-tabs__content",
        TabsHeaderItem = "osui-tabs__header-item",
        TabsContentItem = "osui-tabs__content-item",
        TabsIndicatorElem = "osui-tabs__header__indicator"
    }
    enum Attributes {
        DataTab = "data-tab",
        DataDirection = "data-direction"
    }
    enum CssProperty {
        TabsContentItemOverflow = "--tabs-content-item-overflow",
        TabsHeaderItems = "--tabs-header-items",
        TabsHeight = "--tabs-height",
        TabsIndicatorSize = "--tabs-indicator-size",
        TabsIndicatorTransform = "--tabs-indicator-transform"
    }
    enum Properties {
        ContentAutoHeight = "ContentAutoHeight",
        Height = "Height",
        JustifyHeaders = "JustifyHeaders",
        StartingTab = "StartingTab",
        TabsOrientation = "TabsOrientation",
        TabsVerticalPosition = "TabsVerticalPosition"
    }
    enum ObserverOptions {
        RootMargin = "1px"
    }
    enum ElementsBlockingOnChange {
        Dropdown = ".pop-comp-active"
    }
    enum ChildTypes {
        TabsContentItem = "TabsContentItem",
        TabsHeaderItem = "TabsHeaderItem"
    }
    enum Events {
        OnChange = "OnChange"
    }
}
declare namespace OSFramework.OSUI.Patterns.Tabs {
    interface ITabs extends Interface.IParent {
        changeTab(tabIndex: number, tabsHeaderItem: TabsHeaderItem.ITabsHeaderItem, blockObserver?: boolean, triggerEvent?: boolean, triggeredByObserver?: boolean): void;
        toggleDragGestures(addDragGestures: boolean): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Tabs {
    class Tabs extends AbstractParent<TabsConfig, TabsContentItem.ITabsContentItem | TabsHeaderItem.ITabsHeaderItem> implements ITabs {
        private _activeTabContentElement;
        private _activeTabHeaderElement;
        private _currentOrientation;
        private _currentVerticalPositon;
        private _dragObserver;
        private _eventOnHeaderKeypress;
        private _eventOnResize;
        private _hasDragGestures;
        private _hasSingleContent;
        private _headerItemsLength;
        private _platformEventTabsOnChange;
        private _requestAnimationFrameOnIndicatorResize;
        private _tabsContentElement;
        private _tabsHeaderElement;
        private _tabsIndicatorElement;
        constructor(uniqueId: string, configs: JSON);
        private _addContentItem;
        private _addEvents;
        private _addHeaderItem;
        private _changeActiveContentItem;
        private _changeActiveHeaderItem;
        private _getTargetIndex;
        private _handleKeypressEvent;
        private _handleOnResizeEvent;
        private _handleTabIndicator;
        private _prepareHeaderAndContentItems;
        private _removeContentItem;
        private _removeEvents;
        private _removeHeaderItem;
        private _scrollToTargetContent;
        private _setContentAutoHeight;
        private _setDragObserver;
        private _setHeaderItemsCustomProperty;
        private _setHeight;
        private _setInitialOptions;
        private _setIsJustified;
        private _setOrientation;
        private _setPosition;
        private _setTabHeaderItemDisabledStatus;
        private _tabHeaderItemHasBeenClicked;
        private _triggerOnChangeEvent;
        private _unsetDragObserver;
        private _updateItemsConnection;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        beNotifiedByChild(childItem: Patterns.TabsHeaderItem.TabsHeaderItem | Patterns.TabsContentItem.TabsContentItem, notifiedTo: Enum.ChildNotifyActionType): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        changeTab(tabIndex?: number, tabsHeaderItem?: Patterns.TabsHeaderItem.ITabsHeaderItem, triggerEvent?: boolean, triggeredByObserver?: boolean): void;
        dispose(): void;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
        toggleDragGestures(addDragGestures: boolean): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Tabs {
    class TabsConfig extends AbstractConfiguration {
        ContentAutoHeight: boolean;
        Height: string;
        JustifyHeaders: boolean;
        StartingTab: number;
        TabsOrientation: GlobalEnum.Orientation;
        TabsVerticalPosition: GlobalEnum.Direction;
        validateCanChange(isBuilt: boolean, key: string): boolean;
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.TabsContentItem {
    interface ITabsContentItem extends Interface.IChild {
        IsActive: boolean;
        getDataTab(): number;
        getOffsetLeft(): number;
        setAriaLabelledByAttribute(headerItemId: string): void;
        setDataTab(dataTab: number): void;
        setIsActive(): void;
        setOnDragObserver(observer: IntersectionObserver): void;
        unobserveDragObserver(observer: IntersectionObserver): void;
        unsetIsActive(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.TabsContentItem {
    class TabsContentItem extends AbstractChild<TabsContentItemConfig, Tabs.ITabs> implements ITabsContentItem {
        private _dataTab;
        private _focusableElements;
        private _isActive;
        constructor(uniqueId: string, configs: JSON);
        protected setA11YProperties(isUpdate?: boolean): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        dispose(): void;
        getDataTab(): number;
        getOffsetLeft(): number;
        setAriaLabelledByAttribute(headerItemId: string): void;
        setDataTab(dataTab: number): void;
        setIsActive(): void;
        setOnDragObserver(observer: IntersectionObserver): void;
        unobserveDragObserver(observer: IntersectionObserver): void;
        unsetIsActive(): void;
        get IsActive(): boolean;
    }
}
declare namespace OSFramework.OSUI.Patterns.TabsContentItem {
    class TabsContentItemConfig extends AbstractConfiguration {
        constructor(config: JSON);
    }
}
declare namespace OSFramework.OSUI.Patterns.TabsHeaderItem {
    interface ITabsHeaderItem extends Interface.IChild {
        IsActive: boolean;
        disable(): void;
        enable(): void;
        getDataTab(): number;
        setAriaControlsAttribute(contentItemId: string): void;
        setDataTab(dataTab: number): void;
        setFocus(): void;
        setIsActive(): void;
        unsetIsActive(): void;
        updateOnRender(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.TabsHeaderItem {
    class TabsHeaderItem extends AbstractChild<TabsHeaderItemConfig, Tabs.ITabs> implements ITabsHeaderItem {
        private _dataTab;
        private _eventOnTabsClick;
        private _isActive;
        constructor(uniqueId: string, configs: JSON);
        private _handleClickEvent;
        private _removeEvents;
        private _setUpEvents;
        protected setA11YProperties(isUpdate?: boolean): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        disable(): void;
        dispose(): void;
        enable(): void;
        getDataTab(): number;
        setAriaControlsAttribute(contentItemId: string): void;
        setDataTab(dataTab: number): void;
        setFocus(): void;
        setIsActive(): void;
        unsetIsActive(): void;
        updateOnRender(): void;
        get IsActive(): boolean;
    }
}
declare namespace OSFramework.OSUI.Patterns.TabsHeaderItem {
    class TabsHeaderItemConfig extends AbstractConfiguration {
        constructor(config: JSON);
    }
}
declare namespace OSFramework.OSUI.Patterns.TimePicker {
    abstract class AbstractTimePicker<P, C extends AbstractTimePickerConfig> extends AbstractProviderPattern<P, C> implements ITimePicker {
        constructor(uniqueId: string, configs: C);
        abstract clear(): void;
        abstract close(): void;
        abstract open(): void;
        abstract setLanguage(value: string): void;
        abstract updateInitialTime(time: string): void;
        abstract updatePrompt(promptMessage: string): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.TimePicker {
    abstract class AbstractTimePickerConfig extends Patterns.AbstractProviderConfiguration {
        FirstWeekDay: number;
        InitialTime: string;
        Is24Hours: boolean;
        MaxTime: string;
        MinTime: string;
        TimeFormat: string;
        constructor(config: JSON);
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.TimePicker.Callbacks {
    type OSOnChangeEvent = {
        (timepickerId: string, selectedTime: string): void;
    };
}
declare namespace OSFramework.OSUI.Patterns.TimePicker.Enum {
    enum CssClass {
        Dropdown = "osui-timepicker__dropdown",
        Pattern = "osui-timepicker"
    }
    enum TimePickerEvents {
        OnChange = "OnChange"
    }
    enum Properties {
        InitialTime = "InitialTime",
        Is24Hours = "Is24Hours",
        MaxTime = "MaxTime",
        MinTime = "MinTime",
        TimeFormat = "TimeFormat"
    }
    enum Provider {
        FlatPicker = "flatpickr"
    }
    enum TimeFormatMode {
        Time12hFormat = "12",
        Time24hFormat = "24"
    }
}
declare namespace OSFramework.OSUI.Patterns.TimePicker {
    interface ITimePicker extends Interface.IPattern, Interface.IOpenable {
        clear(): void;
        setLanguage(value: string): void;
        setProviderConfigs(providerConfigs: ProviderConfigs): void;
        setProviderEvent(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic, uniqueId: string): void;
        unsetProviderEvent(eventId: string): void;
        updateInitialTime(time: string): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.TimePicker.Factory {
    function NewTimePicker(timePickerId: string, configs: string, provider: string): Patterns.TimePicker.ITimePicker;
}
declare namespace OSFramework.OSUI.Patterns.Tooltip.Enum {
    enum AriaLabelText {
        Content = "toggle tooltip"
    }
    enum CssClass {
        BalloonContent = "osui-tooltip__balloon-wrapper__balloon",
        BalloonIsOpened = "osui-tooltip__balloon-wrapper--is-open",
        BalloonIsOpening = "osui-tooltip__balloon-wrapper--is-opening",
        BalloonWrapper = "osui-tooltip__balloon-wrapper",
        Content = "osui-tooltip__content",
        IsHover = "osui-tooltip--is-hover",
        IsOpened = "osui-tooltip--is-open",
        Pattern = "osui-tooltip"
    }
    enum Events {
        OnToggle = "OnToggle"
    }
    enum InlineCssVariables {
        Height = "--osui-tooltip-height",
        Left = "--osui-tooltip-left",
        Top = "--osui-tooltip-top",
        Width = "--osui-tooltip-width"
    }
    enum Properties {
        IsHover = "IsHover",
        Position = "Position",
        StartVisible = "StartVisible"
    }
}
declare namespace OSFramework.OSUI.Patterns.Tooltip {
    interface ITooltip extends Interface.IPattern, Interface.IOpenable {
        get IsOpen(): boolean;
    }
}
declare namespace OSFramework.OSUI.Patterns.Tooltip {
    class Tooltip extends AbstractPattern<TooltipConfig> implements ITooltip {
        private _activeScreenElement;
        private _eventBalloonWrapperOnMouseEnter;
        private _eventBalloonWrapperOnMouseLeave;
        private _eventIconOnMouseEnter;
        private _eventIconOnMouseLeave;
        private _eventOnBalloonClick;
        private _eventOnBlur;
        private _eventOnBodyClick;
        private _eventOnClick;
        private _eventOnFocus;
        private _eventOnOpenedBalloon;
        private _eventOnScreenScroll;
        private _eventOnWindowResize;
        private _intersectionObserver;
        private _isBalloonWrapperMouseEnter;
        private _isIconMouseEnter;
        private _isOpen;
        private _isOpenedByApi;
        private _platformEventOnToggleCallback;
        private _requestAnimationOnBodyScroll;
        private _requestAnimationOnWindowResize;
        private _selfElementBoundingClientRect;
        private _tooltipBalloonContentActiveElem;
        private _tooltipBalloonContentElem;
        private _tooltipBalloonPositionClass;
        private _tooltipBalloonWrapperElem;
        private _tooltipIconElem;
        constructor(uniqueId: string, configs: JSON);
        private _moveBalloonElement;
        private _onBalloonClick;
        private _onBalloonWrapperMouseEnter;
        private _onBalloonWrapperMouseLeave;
        private _onBlur;
        private _onBodyClick;
        private _onClick;
        private _onFocus;
        private _onIconMouseEnter;
        private _onIconMouseLeave;
        private _onOpenedBalloon;
        private _onScreenScroll;
        private _onWindowResize;
        private _setBalloonCoordinates;
        private _setBalloonPosition;
        private _setBalloonWrapperExtendedClass;
        private _setCssClasses;
        private _setObserver;
        private _setUpEvents;
        private _triggerClose;
        private _triggerOpen;
        private _unsetEvents;
        private _unsetObserver;
        private _updateIsHover;
        private _updateIsVisible;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        close(): void;
        dispose(): void;
        open(): void;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
        get IsOpen(): boolean;
    }
}
declare namespace OSFramework.OSUI.Patterns.Tooltip {
    class TooltipConfig extends AbstractConfiguration {
        IsHover: boolean;
        Position: GlobalEnum.Position;
        StartVisible: boolean;
        constructor(config: JSON);
        validateCanChange(isBuilt: boolean, key: string): boolean;
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace OSFramework.OSUI.Patterns.TouchEvents.Enum {
    enum Properties {
    }
    enum Events {
        End = "End",
        Move = "Move",
        Start = "Start"
    }
}
declare namespace OSFramework.OSUI.Patterns.TouchEvents {
    interface ITouchEvents extends Interface.IPattern {
    }
}
declare namespace OSFramework.OSUI.Patterns.TouchEvents {
    class TouchEvents extends AbstractPattern<TouchEventsConfig> implements ITouchEvents {
        private _currentX;
        private _currentY;
        private _endEvent;
        private _endEventCallback;
        private _eventMoveCallback;
        private _eventStartCallback;
        private _moveEvent;
        private _startEvent;
        private _startTime;
        private _startX;
        private _startY;
        private _timeTaken;
        private _touchingElement;
        private _trackableElement;
        private _translateX;
        private _translateY;
        constructor(uniqueId: string, configs: JSON);
        private _eventTouchEnd;
        private _eventTouchMove;
        private _eventTouchStart;
        private _removeEventListeners;
        private _setEventListeners;
        private _triggerTouchEnd;
        private _triggerTouchMove;
        private _triggerTouchStart;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        dispose(): void;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.TouchEvents {
    class TouchEventsConfig extends AbstractConfiguration {
        WidgetId: string;
        constructor(config: JSON);
    }
}
declare namespace OSFramework.OSUI.Patterns.Video.Callbacks {
    type OSOnStateChangedEvent = {
        (videoId: string, stateChanged: string): void;
    };
}
declare namespace OSFramework.OSUI.Patterns.Video.Enum {
    enum CssClass {
        VideoSource = "osui-video-source",
        VideoTrack = "osui-video-track"
    }
    enum Events {
        OnStateChanged = "StateChanged"
    }
    enum VideoStates {
        OnEnded = "Ended",
        OnPause = "Paused",
        OnPlaying = "Playing",
        Unstarted = "Unstarted"
    }
    enum Properties {
        Autoplay = "Autoplay",
        Controls = "Controls",
        Height = "Height",
        Loop = "Loop",
        Muted = "Muted",
        PosterURL = "PosterURL",
        URL = "URL",
        Width = "Width"
    }
    enum VideoTags {
        Source = "source",
        Track = "track"
    }
    enum VideoAttributes {
        Captions = "captions",
        Default = "default",
        Height = "height",
        TypePath = "video/",
        Width = "width",
        Muted = "muted"
    }
}
declare namespace OSFramework.OSUI.Patterns.Video {
    interface IVideo extends Interface.IPattern {
        getVideoState: string;
        setVideoJumpToTime(currentTime: number): void;
        setVideoPause(): void;
        setVideoPlay(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Video {
    class Video extends AbstractPattern<VideoConfig> implements IVideo {
        private _platformEventOnStateChanged;
        private _videoElement;
        private _videoJumpTime;
        private _videoSourceElement;
        private _videoState;
        constructor(uniqueId: string, configs: JSON);
        private _setAutoplay;
        private _setControls;
        private _setHeight;
        private _setLoop;
        private _setMuted;
        private _setPosterUrl;
        private _setVideoConfigs;
        private _setVideoSource;
        private _setVideoTrack;
        private _setWidth;
        private _triggerOnStateChangedEvent;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        dispose(): void;
        get getVideoState(): string;
        registerCallback(eventName: string, callback: GlobalCallbacks.OSGeneric): void;
        setVideoJumpToTime(currentTime: number): void;
        setVideoPause(): void;
        setVideoPlay(): void;
    }
}
declare namespace OSFramework.OSUI.Patterns.Video {
    class VideoConfig extends AbstractConfiguration {
        Autoplay: boolean;
        Captions: string;
        Controls: boolean;
        Height: string;
        Loop: boolean;
        Muted: boolean;
        PosterURL: string;
        URL: string;
        Width: string;
        constructor(config: JSON);
    }
}
declare namespace OSFramework.OSUI.Utils.FloatingPosition.Enum {
    enum CssCustomProperties {
        Offset = "--osui-floating-offset",
        YPosition = "--osui-floating-position-y",
        XPosition = "--osui-floating-position-x"
    }
    enum Provider {
        FloatingUI = "FloatingUI"
    }
}
declare namespace OSFramework.OSUI.Utils.FloatingPosition {
    abstract class FloatingPosition implements IFloatingPosition {
        protected eventOnUpdateCallback: OSFramework.OSUI.GlobalCallbacks.Generic;
        protected floatingConfigs: FloatingPositionConfig;
        protected isBuilt: boolean;
        constructor(options: FloatingPositionConfig);
        protected getOffsetValue(): number;
        build(): void;
        dispose(): void;
        update(options: FloatingPositionConfig): void;
        abstract setFloatingPosition(): void;
        abstract unsetFloatingPosition(): void;
    }
}
declare namespace OSFramework.OSUI.Utils.FloatingPosition {
    class FloatingPositionConfig {
        AnchorElem: HTMLElement;
        AutoPlacement: boolean;
        AutoPlacementOptions: AutoPlacementOptions;
        FloatingElem: HTMLElement;
        Position: string;
        UpdatePosition: boolean;
    }
}
declare namespace OSFramework.OSUI.Utils.FloatingPosition.Factory {
    function NewFloatingPosition(configs: FloatingPositionConfig, provider: string): void;
}
declare namespace OSFramework.OSUI.Utils.FloatingPosition {
    interface IFloatingPosition {
        setFloatingPosition(): void;
        unsetFloatingPosition(): void;
    }
}
declare namespace OutSystems.OSUI.ErrorCodes {
    const Success: {
        code: string;
        message: string;
    };
    const Dropdown: {
        FailChangeProperty: string;
        FailClear: string;
        FailClose: string;
        FailDisable: string;
        FailDispose: string;
        FailEnable: string;
        FailGetSelectedValues: string;
        FailOpen: string;
        FailRegisterCallback: string;
        FailRegisterProviderConfig: string;
        FailRegisterProviderEvent: string;
        FailRemoveProviderEvent: string;
        FailSetValidation: string;
        FailSetValues: string;
        FailTogglePopup: string;
    };
    const Notification: {
        FailChangeProperty: string;
        FailDispose: string;
        FailHide: string;
        FailRegisterCallback: string;
        FailShow: string;
    };
    const SectionIndex: {
        FailChangeProperty: string;
        FailDisable: string;
        FailDispose: string;
        FailEnable: string;
        FailRegisterCallback: string;
    };
    const Accordion: {
        FailChangeProperty: string;
        FailCollapseAll: string;
        FailDispose: string;
        FailExpandAll: string;
        FailRegisterCallback: string;
    };
    const AccordionItem: {
        FailAllowTitleEvents: string;
        FailChangeProperty: string;
        FailCollapseItem: string;
        FailDispose: string;
        FailExpandItem: string;
        FailRegisterCallback: string;
    };
    const Carousel: {
        FailChangeProperty: string;
        FailDispose: string;
        FailDirection: string;
        FailGoTo: string;
        FailNext: string;
        FailPrevious: string;
        FailRegisterCallback: string;
        FailToggleDrag: string;
        FailUpdate: string;
        FailRegisterProviderConfig: string;
        FailRegisterProviderEvent: string;
        FailRemoveProviderEvent: string;
        FailEnableOnRender: string;
        FailDisableOnRender: string;
    };
    const DatePicker: {
        FailChangeProperty: string;
        FailClear: string;
        FailClose: string;
        FailDisableDays: string;
        FailDisableWeekDays: string;
        FailDispose: string;
        FailOpen: string;
        FailRedraw: string;
        FailRegisterCallback: string;
        FailRegisterProviderConfig: string;
        FailRegisterProviderEvent: string;
        FailRemoveProviderEvent: string;
        FailSetEditableInput: string;
        FailSetLanguage: string;
        FailToggleNativeBehavior: string;
        FailUpdateInitialDate: string;
        FailUpdatePrompt: string;
    };
    const FlipContent: {
        FailChangeProperty: string;
        FailDispose: string;
        FailRegisterCallback: string;
        FailShowBack: string;
        FailShowFront: string;
        FailToggle: string;
    };
    const Progress: {
        FailChangeProperty: string;
        FailDispose: string;
        FailProgressValue: string;
        FailProgressReset: string;
        FailtProgressGradient: string;
        FailRegisterCallback: string;
    };
    const RangeSlider: {
        FailChangeProperty: string;
        FailDispose: string;
        FailOnDragEnd: string;
        FailRegisterCallback: string;
        FailSetValues: string;
        FailResetValues: string;
        FailRegisterProviderConfig: string;
        FailRegisterProviderEvent: string;
        FailRemoveProviderEvent: string;
        FailEnable: string;
        FailDisable: string;
    };
    const Sidebar: {
        FailChangeProperty: string;
        FailClose: string;
        FailDispose: string;
        FailOpen: string;
        FailRegisterCallback: string;
        FailToggleSwipe: string;
        FailClickOutsideToClose: string;
    };
    const Submenu: {
        FailChangeProperty: string;
        FailClose: string;
        FailDispose: string;
        FailOpen: string;
        FailOpenOnHover: string;
        FailRegisterCallback: string;
        FailUpdate: string;
        FailClickOutsideToClose: string;
    };
    const Tooltip: {
        FailChangeProperty: string;
        FailClose: string;
        FailDispose: string;
        FailOpen: string;
        FailRegisterCallback: string;
    };
    const AnimatedLabel: {
        FailChangeProperty: string;
        FailDispose: string;
        FailRegisterCallback: string;
        FailUpdate: string;
    };
    const ButtonLoading: {
        FailChangeProperty: string;
        FailDispose: string;
        FailRegisterCallback: string;
    };
    const DropdownServerSideItem: {
        FailChangeProperty: string;
        FailDispose: string;
        FailRegisterCallback: string;
    };
    const FloatingActions: {
        FailChangeProperty: string;
        FailDispose: string;
        FailRegisterCallback: string;
    };
    const Gallery: {
        FailChangeProperty: string;
        FailDispose: string;
        FailRegisterCallback: string;
    };
    const Rating: {
        FailChangeProperty: string;
        FailDispose: string;
        FailRegisterCallback: string;
    };
    const Search: {
        FailChangeProperty: string;
        FailDispose: string;
        FailRegisterCallback: string;
        FailEnableNativeBehavior: string;
        FailUpdateGlassButtonAriaLabel: string;
    };
    const SectionIndexItem: {
        FailChangeProperty: string;
        FailDispose: string;
        FailRegisterCallback: string;
    };
    const Tabs: {
        FailChangeProperty: string;
        FailDispose: string;
        FailRegisterCallback: string;
        FailSetActive: string;
        FailToggleSwipe: string;
    };
    const TabsContentItem: {
        FailChangeProperty: string;
        FailDispose: string;
        FailRegisterCallback: string;
    };
    const TabsHeaderItem: {
        FailChangeProperty: string;
        FailDisableTabHeader: string;
        FailDispose: string;
        FailEnableTabHeader: string;
        FailRegisterCallback: string;
        FailUpdate: string;
    };
    const BottomSheet: {
        FailChangeProperty: string;
        FailDispose: string;
        FailRegisterCallback: string;
        FailOpen: string;
        FailClose: string;
    };
    const TimePicker: {
        FailChangeProperty: string;
        FailClear: string;
        FailClose: string;
        FailDispose: string;
        FailOpen: string;
        FailRedraw: string;
        FailRegisterCallback: string;
        FailRegisterProviderConfig: string;
        FailRegisterProviderEvent: string;
        FailRemoveProviderEvent: string;
        FailToggleNativeBehavior: string;
        FailSetLanguage: string;
        FailUpdateInitialTime: string;
        FailSetEditableInput: string;
        FailUpdatePrompt: string;
    };
    const MonthPicker: {
        FailChangeProperty: string;
        FailClear: string;
        FailClose: string;
        FailDispose: string;
        FailOpen: string;
        FailRedraw: string;
        FailRegisterCallback: string;
        FailRegisterProviderConfig: string;
        FailRegisterProviderEvent: string;
        FailRemoveProviderEvent: string;
        FailSetEditableInput: string;
        FailSetLanguage: string;
        FailUpdateInitialMonth: string;
        FailUpdatePrompt: string;
    };
    const Utilities: {
        FailGetInvalidInput: string;
        FailScrollToElement: string;
        FailSetFocus: string;
        FailAddFavicon: string;
        FailMoveElement: string;
        FailSetActiveElement: string;
        FailSetSelectedRow: string;
        FailShowPassword: string;
        FailMasterDetailSetContentFocus: string;
        FailSetAccessibilityRole: string;
        FailSetAriaHidden: string;
        FailSetLang: string;
        FailSkipToContent: string;
        FailToggleTextSpacing: string;
        FailSetActiveMenuItems: string;
        FailSetBottomBarActiveElement: string;
        FailSetMenuAttributes: string;
        FailSetMenuIcon: string;
        FailSetMenuIconListeners: string;
        FailSetMenuListeners: string;
        FailToggleSideMenu: string;
        FailListItemAnimate: string;
        FailCheckIsMenuDraggable: string;
        FailSetExtendedMenuHide: string;
        FailSetExtendedMenuShow: string;
        FailCheckIsRTL: string;
    };
    const InlineSvg: {
        FailChangeProperty: string;
        FailDispose: string;
        FailRegisterCallback: string;
    };
    const OverflowMenu: {
        FailChangeProperty: string;
        FailDispose: string;
        FailRegisterCallback: string;
        FailOpen: string;
        FailClose: string;
        FailEnable: string;
        FailDisable: string;
    };
    const Video: {
        FailChangeProperty: string;
        FailDispose: string;
        FailRegisterCallback: string;
        FailGetState: string;
        FailPause: string;
        FailPlay: string;
        FailSetTime: string;
    };
    const Legacy: {
        FailAddFavicon_Legacy: string;
        MoveElement_Legacy: string;
        MasterDetailSetContentFocus_Legacy: string;
        SetAccessibilityRole_Legacy: string;
        SetAriaHidden_Legacy: string;
        SetFocus_Legacy: string;
        SetLang_Legacy: string;
        SkipToContent_Legacy: string;
        ToggleTextSpacing_Legacy: string;
    };
}
declare namespace OutSystems.OSUI {
    function GetVersion(): string;
}
declare namespace OutSystems.OSUI.Patterns.AccordionAPI {
    function ChangeProperty(accordionId: string, propertyName: string, propertyValue: unknown): string;
    function CollapseAllItems(accordionId: string): string;
    function Create(accordionId: string, configs: string): OSFramework.OSUI.Patterns.Accordion.IAccordion;
    function Dispose(accordionId: string): string;
    function ExpandAllItems(accordionId: string): string;
    function GetAllAccordions(): Array<string>;
    function GetAccordionById(AccordionId: string): OSFramework.OSUI.Patterns.Accordion.IAccordion;
    function Initialize(accordionId: string): OSFramework.OSUI.Patterns.Accordion.IAccordion;
    function RegisterCallback(accordionId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
}
declare namespace OutSystems.OSUI.Patterns.AccordionItemAPI {
    function AllowTitleEvents(accordionItemId: string): string;
    function ChangeProperty(accordionItemId: string, propertyName: string, propertyValue: unknown): string;
    function Collapse(accordionItemId: string): string;
    function Create(accordionItemId: string, configs: string): OSFramework.OSUI.Patterns.AccordionItem.IAccordionItem;
    function Dispose(accordionItemId: string): string;
    function Expand(accordionItemId: string): string;
    function GetAllAccordionItems(): Array<string>;
    function GetAccordionItemById(accordionItemId: string): OSFramework.OSUI.Patterns.AccordionItem.IAccordionItem;
    function Initialize(accordionItemId: string): OSFramework.OSUI.Patterns.AccordionItem.IAccordionItem;
    function RegisterCallback(accordionItemId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
}
declare namespace OutSystems.OSUI.Patterns.AnimatedLabelAPI {
    function ChangeProperty(animatedLabelId: string, propertyName: string, propertyValue: unknown): string;
    function Create(animatedLabelId: string, configs: string): OSFramework.OSUI.Patterns.AnimatedLabel.IAnimatedLabel;
    function Dispose(animatedLabelId: string): string;
    function GetAllAnimatedLabels(): Array<string>;
    function GetAnimatedLabelById(animatedLabelId: string): OSFramework.OSUI.Patterns.AnimatedLabel.IAnimatedLabel;
    function Initialize(animatedLabelId: string): OSFramework.OSUI.Patterns.AnimatedLabel.IAnimatedLabel;
    function RegisterCallback(dropdownId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
    function UpdateOnRender(animatedLabelId: string): string;
}
declare namespace OutSystems.OSUI.Patterns.BottomSheetAPI {
    function ChangeProperty(bottomSheetId: string, propertyName: string, propertyValue: any): string;
    function Create(bottomSheetId: string, configs: string): OSFramework.OSUI.Patterns.BottomSheet.IBottomSheet;
    function Dispose(bottomSheetId: string): string;
    function GetAllBottomSheetItemsMap(): Array<string>;
    function GetBottomSheetItemById(bottomSheetId: string): OSFramework.OSUI.Patterns.BottomSheet.IBottomSheet;
    function Initialize(bottomSheetId: string): OSFramework.OSUI.Patterns.BottomSheet.IBottomSheet;
    function Open(bottomSheetId: string): string;
    function Close(bottomSheetId: string): string;
    function RegisterCallback(bottomSheetId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
}
declare namespace OutSystems.OSUI.Patterns.ButtonLoadingAPI {
    function ChangeProperty(buttonLoadingId: string, propertyName: string, propertyValue: unknown): string;
    function Create(buttonLoadingId: string, configs: string): OSFramework.OSUI.Patterns.ButtonLoading.IButtonLoading;
    function Dispose(buttonLoadingId: string): string;
    function GetAllButtonsLoading(): Array<string>;
    function GetButtonLoadingById(buttonLoadingId: string): OSFramework.OSUI.Patterns.ButtonLoading.IButtonLoading;
    function Initialize(buttonLoadingId: string): OSFramework.OSUI.Patterns.ButtonLoading.IButtonLoading;
    function RegisterCallback(dropdownId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
}
declare namespace OutSystems.OSUI.Patterns.CarouselAPI {
    function CarouselEnableOnRender(carouselId: string): string;
    function CarouselDisableOnRender(carouselId: string): string;
    function ChangeProperty(carouselId: string, propertyName: string, propertyValue: any): string;
    function Create(carouselId: string, configs: string, provider: string): OSFramework.OSUI.Patterns.Carousel.ICarousel;
    function Dispose(carouselId: string): string;
    function GetAllCarouselItemsMap(): Array<string>;
    function GetCarouselItemById(carouselId: string): OSFramework.OSUI.Patterns.Carousel.ICarousel;
    function GoTo(carouselId: string, index: number): string;
    function Initialize(carouselId: string): OSFramework.OSUI.Patterns.Carousel.ICarousel;
    function Next(carouselId: string): string;
    function Previous(carouselId: string): string;
    function RegisterCallback(carouselId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
    function ToggleDrag(carouselId: string, hasDrag: boolean): string;
    function UpdateOnRender(carouselId: string): string;
    function SetCarouselDirection(carouselId: string, direction: string): string;
    function SetProviderConfigs(carouselId: string, configs: CarouselProviderConfigs): string;
    function SetProviderEvent(carouselId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic): string;
    function UnsetProviderEvent(carouselId: string, eventId: string): string;
}
declare namespace OutSystems.OSUI.Patterns.DatePickerAPI {
    function ChangeProperty(datePickerId: string, propertyName: string, propertyValue: any): string;
    function Clear(datePickerId: string): string;
    function Close(datePickerId: string): string;
    function Create(datePickerId: string, configs: string, mode: OSFramework.OSUI.Patterns.DatePicker.Enum.Mode, provider: string): OSFramework.OSUI.Patterns.DatePicker.IDatePicker;
    function ToggleNativeBehavior(datePickerId: string, IsNative: boolean): string;
    function Dispose(datePickerId: string): string;
    function GetAllDatePickerItemsMap(): Array<string>;
    function GetDatePickerItemById(datePickerId: string): OSFramework.OSUI.Patterns.DatePicker.IDatePicker;
    function Initialize(datePickerId: string): OSFramework.OSUI.Patterns.DatePicker.IDatePicker;
    function Open(datePickerId: string): string;
    function RegisterCallback(datePickerId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
    function Redraw(datePickerId: string): string;
    function SetLanguage(datePickerId: string, isoCode: string): string;
    function UpdateInitialDate(datePickerId: string, date1: string, date2?: string): string;
    function UpdatePrompt(datePickerId: string, promptMessage: string): string;
    function DisableDays(datePickerId: string, disableDays: string[]): string;
    function DisableWeekDays(datePickerId: string, disableWeekDays: number[]): string;
    function SetProviderConfigs(datePickerId: string, providerConfigs: DatePickerProviderConfigs): string;
    function SetProviderEvent(datePickerId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic): string;
    function UnsetProviderEvent(datePickerId: string, eventId: string): string;
    function SetEditableInput(datePickerId: string, IsEditable: boolean): string;
}
declare namespace OutSystems.OSUI.Patterns.DropdownAPI {
    function ChangeProperty(dropdownId: string, propertyName: string, propertyValue: unknown): string;
    function Clear(dropdownId: string): string;
    function Close(dropdownId: string): string;
    function Create(dropdownId: string, mode: string, provider: string, configs: string): OSFramework.OSUI.Patterns.Dropdown.IDropdown;
    function Disable(dropdownId: string): string;
    function TogglePopup(dropdownId: string, isEnabled: boolean): string;
    function Dispose(dropdownId: string): string;
    function Enable(dropdownId: string): string;
    function GetAllDropdowns(): Array<string>;
    function GetDropdownById(dropdownId: string): OSFramework.OSUI.Patterns.Dropdown.IDropdown;
    function GetSelectedValues(dropdownId: string): string;
    function Open(dropdownId: string): string;
    function Initialize(dropdownId: string): OSFramework.OSUI.Patterns.Dropdown.IDropdown;
    function RegisterCallback(dropdownId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
    function SetProviderConfigs(dropdownId: string, providerConfigs: DatePickerProviderConfigs): string;
    function SetProviderEvent(dropdownId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic): string;
    function UnsetProviderEvent(dropdownId: string, eventId: string): string;
    function SetValidation(dropdownId: string, isValid: boolean, validationMessage: string): string;
    function SetValues(dropdownId: string, selectedValues: string, silentOnChangedEvent?: boolean): string;
}
declare namespace OutSystems.OSUI.Patterns.DropdownServerSideItemAPI {
    function ChangeProperty(dropdownServerSideItemId: string, propertyName: string, propertyValue: any): string;
    function Create(dropdownServerSideItemId: string, configs: string): OSFramework.OSUI.Patterns.DropdownServerSideItem.IDropdownServerSideItem;
    function Dispose(dropdownServerSideItemId: string): string;
    function GetAllDropdownServerSideItemItemsMap(): Array<string>;
    function GetDropdownServerSideItemItemById(dropdownServerSideItemId: string): OSFramework.OSUI.Patterns.DropdownServerSideItem.IDropdownServerSideItem;
    function Initialize(dropdownServerSideItemId: string): OSFramework.OSUI.Patterns.DropdownServerSideItem.IDropdownServerSideItem;
    function RegisterCallback(dropdownServerSideItemId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
}
declare namespace OutSystems.OSUI.Patterns.FlipContentAPI {
    function ChangeProperty(flipId: string, propertyName: string, propertyValue: any): string;
    function Create(flipId: string, configs: string): OSFramework.OSUI.Patterns.FlipContent.IFlipContent;
    function Dispose(flipId: string): string;
    function GetAllFlipContent(): Array<string>;
    function GetFlipContentById(flipId: string): OSFramework.OSUI.Patterns.FlipContent.IFlipContent;
    function Initialize(flipId: string): OSFramework.OSUI.Patterns.FlipContent.IFlipContent;
    function RegisterCallback(flipId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
    function ShowBackContent(flipId: string): string;
    function ShowFrontContent(flipId: string): string;
    function ToggleFlipContent(flipId: string): string;
}
declare namespace OutSystems.OSUI.Patterns.GalleryAPI {
    function ChangeProperty(galleryId: string, propertyName: string, propertyValue: any): string;
    function Create(galleryId: string, configs: string): OSFramework.OSUI.Patterns.Gallery.IGallery;
    function Dispose(galleryId: string): string;
    function GetAllGalleries(): Array<string>;
    function GetGalleryById(galleryId: string): OSFramework.OSUI.Patterns.Gallery.IGallery;
    function Initialize(galleryId: string): OSFramework.OSUI.Patterns.Gallery.IGallery;
    function RegisterCallback(dropdownId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
}
declare namespace OutSystems.OSUI.Patterns.InlineSvgAPI {
    function ChangeProperty(inlineSvgId: string, propertyName: string, propertyValue: any): string;
    function Create(inlineSvgId: string, configs: string): OSFramework.OSUI.Patterns.InlineSvg.IInlineSvg;
    function Dispose(inlineSvgId: string): string;
    function GetAllInlineSvgs(): Array<string>;
    function GetInlineSvgById(inlineSvgId: string): OSFramework.OSUI.Patterns.InlineSvg.IInlineSvg;
    function Initialize(inlineSvgId: string): OSFramework.OSUI.Patterns.InlineSvg.IInlineSvg;
    function RegisterCallback(inlineSvgId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
}
declare namespace OutSystems.OSUI.Patterns.MonthPickerAPI {
    function ChangeProperty(monthPickerId: string, propertyName: string, propertyValue: any): string;
    function Clear(monthPickerId: string): string;
    function Close(monthPickerId: string): string;
    function Create(monthPickerId: string, configs: string, provider: string): OSFramework.OSUI.Patterns.MonthPicker.IMonthPicker;
    function Dispose(monthPickerId: string): string;
    function GetAllMonthPickerItemsMap(): Array<string>;
    function GetMonthPickerItemById(monthPickerId: string): OSFramework.OSUI.Patterns.MonthPicker.IMonthPicker;
    function Initialize(monthPickerId: string): OSFramework.OSUI.Patterns.MonthPicker.IMonthPicker;
    function Open(monthPickerId: string): string;
    function RegisterCallback(monthPickerId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
    function SetProviderConfigs(monthPickerId: string, providerConfigs: MonthPickerProviderConfigs): string;
    function SetProviderEvent(monthPickerId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic): string;
    function SetLanguage(monthPickerId: string, isoCode: string): string;
    function SetEditableInput(monthPickerId: string, IsEditable: boolean): string;
    function UnsetProviderEvent(monthPickerId: string, eventId: string): string;
    function UpdateInitialMonth(monthPickerId: string, monthYear: MonthYear): string;
    function UpdatePrompt(monthPickerId: string, promptMessage: string): string;
}
declare namespace OutSystems.OSUI.Patterns.NotificationAPI {
    function ChangeProperty(notificationId: string, propertyName: string, propertyValue: any): string;
    function Create(notificationId: string, configs: string): OSFramework.OSUI.Patterns.Notification.INotification;
    function Dispose(notificationId: string): string;
    function GetAllNotifications(): Array<string>;
    function GetNotificationById(notificationId: string): OSFramework.OSUI.Patterns.Notification.INotification;
    function Hide(notificationId: string): string;
    function Initialize(notificationId: string): OSFramework.OSUI.Patterns.Notification.INotification;
    function RegisterCallback(notificationId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
    function Show(notificationId: string): string;
}
declare namespace OutSystems.OSUI.Patterns.OverflowMenuAPI {
    function ChangeProperty(overflowMenuId: string, propertyName: string, propertyValue: unknown): string;
    function Create(overflowMenuId: string, configs: string): OSFramework.OSUI.Patterns.OverflowMenu.IOverflowMenu;
    function Disable(overflowMenuId: string): string;
    function Dispose(overflowMenuId: string): string;
    function Enable(overflowMenuId: string): string;
    function GetAllOverflowMenus(): Array<string>;
    function GetOverflowMenuById(overflowMenuId: string): OSFramework.OSUI.Patterns.OverflowMenu.IOverflowMenu;
    function Initialize(overflowMenuId: string): OSFramework.OSUI.Patterns.OverflowMenu.IOverflowMenu;
    function RegisterCallback(overflowMenuId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic): string;
    function Open(overflowMenuId: string): string;
    function Close(overflowMenuId: string): string;
}
declare namespace OutSystems.OSUI.Patterns.ProgressAPI {
    function ChangeProperty(progressId: string, propertyName: string, propertyValue: any): string;
    function Create(progressId: string, type: string, configs: string): OSFramework.OSUI.Patterns.Progress.IProgress;
    function Dispose(progressId: string): string;
    function GetAllProgressItemsMap(): Array<string>;
    function GetProgressItemById(progressId: string): OSFramework.OSUI.Patterns.Progress.IProgress;
    function Initialize(progressId: string): OSFramework.OSUI.Patterns.Progress.IProgress;
    function RegisterCallback(dropdownId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
    function ResetProgressValue(progressId: string): string;
    function SetProgressValue(progressId: string, progress: number): string;
    function ProgressApplyGradient(progressId: string, gradientType: string, colors: string): string;
}
declare namespace OutSystems.OSUI.Patterns.RangeSliderAPI {
    function ChangeProperty(rangeSliderId: string, propertyName: string, propertyValue: unknown): string;
    function Create(rangeSliderId: string, configs: string, mode: OSFramework.OSUI.Patterns.RangeSlider.Enum.Mode, provider: string): OSFramework.OSUI.Patterns.RangeSlider.IRangeSlider;
    function Disable(rangeSliderId: string): string;
    function Dispose(rangeSliderId: string): string;
    function Enable(rangeSliderId: string): string;
    function GetAllRangeSliderItemsMap(): Array<string>;
    function GetRangeSliderItemById(rangeSliderId: string): OSFramework.OSUI.Patterns.RangeSlider.IRangeSlider;
    function Initialize(rangeSliderId: string): OSFramework.OSUI.Patterns.RangeSlider.IRangeSlider;
    function RegisterCallback(rangeSliderId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
    function SetRangeIntervalChangeOnDragEnd(rangeSliderId: string): string;
    function SetRangeSliderValue(rangeSliderId: string, valueFrom: number, valueTo?: number): string;
    function ResetRangeSliderValue(rangeSliderId: string): string;
    function SetProviderConfigs(rangeSliderId: string, configs: RangeSliderProviderConfigs): string;
    function SetProviderEvent(rangeSliderId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic): string;
    function UnsetProviderEvent(rangeSliderId: string, eventId: string): string;
}
declare namespace OutSystems.OSUI.Patterns.RatingAPI {
    function ChangeProperty(ratingId: string, propertyName: string, propertyValue: any): string;
    function Create(ratingId: string, configs: string): OSFramework.OSUI.Patterns.Rating.IRating;
    function Dispose(ratingId: string): string;
    function GetAllRatings(): Array<string>;
    function GetRatingById(ratingId: string): OSFramework.OSUI.Patterns.Rating.IRating;
    function Initialize(ratingId: string): OSFramework.OSUI.Patterns.Rating.IRating;
    function RegisterCallback(ratingId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
}
declare namespace OutSystems.OSUI.Patterns.SearchAPI {
    function ChangeProperty(searchId: string, propertyName: string, propertyValue: any): string;
    function Create(searchId: string, configs: string): OSFramework.OSUI.Patterns.Search.ISearch;
    function Dispose(searchId: string): string;
    function GetAllSearches(): Array<string>;
    function GetSearchById(searchId: string): OSFramework.OSUI.Patterns.Search.ISearch;
    function Initialize(searchId: string): OSFramework.OSUI.Patterns.Search.ISearch;
    function RegisterCallback(searchId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
    function EnableNativeBehavior(searchId: string): string;
    function UpdateGlassButtonAriaLabel(searchId: string, openAriaLabel: string, closeAriaLabel: string): string;
}
declare namespace OutSystems.OSUI.Patterns.SectionIndexAPI {
    function ChangeProperty(sectionIndexId: string, propertyName: string, propertyValue: any): string;
    function Create(sectionIndexId: string, configs: string): OSFramework.OSUI.Patterns.SectionIndex.ISectionIndex;
    function Dispose(sectionIndexId: string): string;
    function GetAllSectionIndexItemsMap(): Array<string>;
    function GetSectionIndexById(sectionIndexId: string): OSFramework.OSUI.Patterns.SectionIndex.ISectionIndex;
    function Initialize(sectionIndexId: string): OSFramework.OSUI.Patterns.SectionIndex.ISectionIndex;
    function RegisterCallback(sectionIndexId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
}
declare namespace OutSystems.OSUI.Patterns.SectionIndexItemAPI {
    function ChangeProperty(sectionIndexItemId: string, propertyName: string, propertyValue: any): string;
    function Create(sectionIndexItemId: string, configs: string): OSFramework.OSUI.Patterns.SectionIndexItem.ISectionIndexItem;
    function Dispose(sectionIndexItemId: string): string;
    function GetAllSectionIndexItemItemsMap(): Array<string>;
    function GetSectionIndexItemById(sectionIndexItemId: string): OSFramework.OSUI.Patterns.SectionIndexItem.ISectionIndexItem;
    function Initialize(sectionIndexItemId: string): OSFramework.OSUI.Patterns.SectionIndexItem.ISectionIndexItem;
    function RegisterCallback(sectionIndexItemId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
}
declare namespace OutSystems.OSUI.Patterns.SidebarAPI {
    function ChangeProperty(sidebarId: string, propertyName: string, propertyValue: unknown): string;
    function ClickOutsideToClose(sidebarId: string, closeOnOutSIdeClick: boolean): string;
    function Close(sidebarId: string): string;
    function Create(sidebarId: string, configs: string): OSFramework.OSUI.Patterns.Sidebar.ISidebar;
    function Dispose(sidebarId: string): string;
    function GetAllSidebars(): Array<string>;
    function GetSidebarById(sidebarId: string): OSFramework.OSUI.Patterns.Sidebar.ISidebar;
    function Initialize(sidebarId: string): OSFramework.OSUI.Patterns.Sidebar.ISidebar;
    function Open(sidebarId: string): string;
    function RegisterCallback(sidebarId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
    function ToggleGestures(sidebarId: string, enableSwipe: boolean): string;
}
declare namespace OutSystems.OSUI.Patterns.SubmenuAPI {
    function ChangeProperty(submenuId: string, propertyName: string, propertyValue: any): string;
    function ClickOutsideToClose(submenuId: string, clickOutsideToClose: boolean): string;
    function Close(submenuId: string): string;
    function Open(submenuId: string): string;
    function Create(submenuId: string, configs: string): OSFramework.OSUI.Patterns.Submenu.ISubmenu;
    function Dispose(submenuId: string): string;
    function GetAllSubmenus(): Array<string>;
    function GetSubmenuById(submenuId: string): OSFramework.OSUI.Patterns.Submenu.ISubmenu;
    function Initialize(submenuId: string): OSFramework.OSUI.Patterns.Submenu.ISubmenu;
    function RegisterCallback(submenuId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
    function SubmenuOpenOnHover(submenuId: string): string;
    function UpdateOnRender(submenuId: string): string;
}
declare namespace OutSystems.OSUI.Patterns.SwipeEventsAPI {
    function Create(swipeEventsId: string, configs: string): OSFramework.OSUI.Patterns.SwipeEvents.ISwipeEvents;
    function Dispose(swipeEventsId: string): void;
    function GetAllSwipeEvents(): Array<string>;
    function GetSwipeEventsById(swipeEventsId: string): OSFramework.OSUI.Patterns.SwipeEvents.ISwipeEvents;
    function Initialize(swipeEventsId: string): OSFramework.OSUI.Patterns.SwipeEvents.ISwipeEvents;
    function RegisterCallback(swipeEventsID: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): void;
    function GestureMove(swipeEventsId: string, event: TouchEvent): void;
    function GestureEnd(swipeEventsId: string, offsetX: number, offsetY: number, timeTaken: number): void;
}
declare namespace OutSystems.OSUI.Patterns.TabsAPI {
    function ChangeProperty(tabsId: string, propertyName: string, propertyValue: unknown): string;
    function Create(tabsId: string, configs: string): OSFramework.OSUI.Patterns.Tabs.ITabs;
    function Dispose(tabsId: string): string;
    function GetAllTabs(): Array<string>;
    function GetTabsById(tabsId: string): OSFramework.OSUI.Patterns.Tabs.ITabs;
    function Initialize(tabsId: string): OSFramework.OSUI.Patterns.Tabs.ITabs;
    function RegisterCallback(tabsId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
    function TabsToggleSwipe(tabsId: string, enableSwipe: boolean): string;
    function SetActiveTab(tabsId: string, tabsNumber: number): string;
}
declare namespace OutSystems.OSUI.Patterns.TabsContentItemAPI {
    function ChangeProperty(tabsContentItemId: string, propertyName: string, propertyValue: any): string;
    function Create(tabsContentItemId: string, configs: string): OSFramework.OSUI.Patterns.TabsContentItem.ITabsContentItem;
    function Dispose(tabsContentItemId: string): string;
    function GetAllTabsContentItems(): Array<string>;
    function GetTabsContentItemById(tabsContentItemId: string): OSFramework.OSUI.Patterns.TabsContentItem.ITabsContentItem;
    function Initialize(tabsContentItemId: string): OSFramework.OSUI.Patterns.TabsContentItem.ITabsContentItem;
    function RegisterCallback(tabsContentItemId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
}
declare namespace OutSystems.OSUI.Patterns.TabsHeaderItemAPI {
    function ChangeProperty(tabsHeaderItemId: string, propertyName: string, propertyValue: any): string;
    function Create(tabsHeaderItemId: string, configs: string): OSFramework.OSUI.Patterns.TabsHeaderItem.ITabsHeaderItem;
    function DisableTabItem(tabsHeaderItemId: string): string;
    function Dispose(tabsHeaderItemId: string): string;
    function EnableTabItem(tabsHeaderItemId: string): string;
    function GetAllTabsHeaderItems(): Array<string>;
    function GetTabsHeaderItemById(tabsHeaderItemId: string): OSFramework.OSUI.Patterns.TabsHeaderItem.ITabsHeaderItem;
    function UpdateOnRender(tabsHeaderItemId: string): string;
    function Initialize(tabsHeaderItemId: string): OSFramework.OSUI.Patterns.TabsHeaderItem.ITabsHeaderItem;
    function RegisterCallback(tabsHeaderItemId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
}
declare namespace OutSystems.OSUI.Patterns.TimePickerAPI {
    function ChangeProperty(timePickerId: string, propertyName: string, propertyValue: any): string;
    function Clear(timePickerId: string): string;
    function Close(timePickerId: string): string;
    function Create(timePickerId: string, configs: string, provider: string): OSFramework.OSUI.Patterns.TimePicker.ITimePicker;
    function ToggleNativeBehavior(timePickerId: string, IsNative: boolean): string;
    function Dispose(timePickerId: string): string;
    function GetAllTimePickerItemsMap(): Array<string>;
    function GetTimePickerItemById(timePickerId: string): OSFramework.OSUI.Patterns.TimePicker.ITimePicker;
    function Initialize(timePickerId: string): OSFramework.OSUI.Patterns.TimePicker.ITimePicker;
    function Open(timePickerId: string): string;
    function RegisterCallback(timePickerId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
    function Redraw(timePickerId: string): string;
    function SetLanguage(timePickerId: string, isoCode: string): string;
    function UpdateInitialTime(timePickerId: string, time: string): string;
    function UpdatePrompt(timePickerId: string, promptMessage: string): string;
    function SetProviderConfigs(timePickerId: string, providerConfigs: TimePickerProviderConfigs): string;
    function SetProviderEvent(timePickerId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.Generic): string;
    function UnsetProviderEvent(timePickerId: string, eventId: string): string;
    function SetEditableInput(timePickerId: string, IsEditable: boolean): string;
}
declare namespace OutSystems.OSUI.Patterns.TooltipAPI {
    function ChangeProperty(tooltipId: string, propertyName: string, propertyValue: any): string;
    function Close(tooltipId: string): string;
    function Create(tooltipId: string, configs: string): OSFramework.OSUI.Patterns.Tooltip.ITooltip;
    function Dispose(tooltipId: string): string;
    function GetAllTooltips(): Array<string>;
    function GetTooltipById(tooltipId: string): OSFramework.OSUI.Patterns.Tooltip.ITooltip;
    function Initialize(tooltipId: string): OSFramework.OSUI.Patterns.Tooltip.ITooltip;
    function Open(tooltipId: string): string;
    function RegisterCallback(tooltipId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
}
declare namespace OutSystems.OSUI.Patterns.TouchEventsAPI {
    function Create(touchEventsId: string, configs: string): OSFramework.OSUI.Patterns.TouchEvents.ITouchEvents;
    function Dispose(touchEventsId: string): void;
    function GetAllTouchEvents(): Array<string>;
    function GetTouchEventsById(touchEventsId: string): OSFramework.OSUI.Patterns.TouchEvents.ITouchEvents;
    function Initialize(touchEventsId: string): OSFramework.OSUI.Patterns.TouchEvents.ITouchEvents;
    function RegisterCallback(touchEventsID: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): void;
}
declare namespace OutSystems.OSUI.Patterns.VideoAPI {
    function ChangeProperty(videoId: string, propertyName: string, propertyValue: unknown): string;
    function Create(videoId: string, configs: string): OSFramework.OSUI.Patterns.Video.IVideo;
    function Dispose(videoId: string): string;
    function GetAllVideos(): Array<string>;
    function GetVideoById(videoId: string): OSFramework.OSUI.Patterns.Video.IVideo;
    function Initialize(videoId: string): OSFramework.OSUI.Patterns.Video.IVideo;
    function RegisterCallback(videoId: string, eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): string;
    function GetState(videoId: string): string;
    function Pause(videoId: string): string;
    function Play(videoId: string): string;
    function JumpToTime(videoId: string, currentTime: number): string;
}
declare namespace OutSystems.OSUI.Utils.Accessibility {
    function SetAccessibilityRole(widgetId: string, role: string): string;
    function SetAriaHidden(widgetId: string, isHidden: boolean): string;
    function SetFocus(widgetId: string): string;
    function SetLang(lang: string): string;
    function SkipToContent(targetId: string): string;
    function ToggleTextSpacing(): string;
    function WCAGMetaTag(): void;
}
declare namespace OutSystems.OSUI.Utils.Application {
    function SetExpandableExceptions(): void;
}
declare namespace OutSystems.OSUI.Utils {
}
declare namespace OutSystems.OSUI.Utils {
    function ChildrenMatches(elem: HTMLElement, selector: string): Element[];
}
declare namespace OutSystems.OSUI.Utils {
    type APIHandler = {
        callback: any;
        errorCode: string;
        hasValue?: boolean;
    };
    export function CreateApiResponse({ callback, errorCode, hasValue }: APIHandler): string;
    export {};
}
declare namespace OutSystems.OSUI.Dates {
    function GetServerDateFormat(): string;
    function SetServerDateFormat(date: string): void;
}
declare namespace OutSystems.OSUI.Utils.DeviceDetection {
    function GetDeviceOrientation(): string;
    function GetDeviceType(): string;
    function IsTouch(): boolean;
    function GetOperatingSystem(UserAgent: string): string;
    function IsDesktop(): boolean;
    function CheckIsLayoutNative(): boolean;
    function CheckIsLayoutSide(): boolean;
    function IsRunningAsPWA(): boolean;
    function IsPhone(): boolean;
    function IsRunningAsNativeApp(): boolean;
    function IsTablet(): boolean;
    function IsWebApp(): boolean;
    function SetDeviceBreakpoints(phoneWidth: number, tabletWidth: number): void;
}
declare namespace OutSystems.OSUI.Utils.InvalidInputs {
    function FocusFirstInvalidInput(elementId: string, isSmooth: boolean, elementParentClass: string): string;
}
declare namespace OutSystems.OSUI.Utils {
    function GenerateUniqueId(): string;
}
declare namespace OutSystems.OSUI.Utils {
    function GetBrowser(useragent?: string): string;
}
declare namespace OutSystems.OSUI.Utils {
    function GetClosest(elem: HTMLElement, selector: string): any;
}
declare namespace OutSystems.OSUI.Utils {
    function GetHasListInside(targetElem: HTMLElement): boolean;
}
declare namespace OutSystems.OSUI.Utils {
    enum APIMethod {
        SetProviderConfigs = "SetProviderConfigs",
        SetProviderEvent = "SetProviderEvent",
        UnsetProviderEvent = "UnsetProviderEvent"
    }
    function GetPickerExtensibilityAPI(widgetId: string, method: APIMethod): OSFramework.OSUI.GlobalCallbacks.Generic;
}
declare namespace OutSystems.OSUI.Utils.HideOnScroll {
    function Init(): void;
}
declare namespace OutSystems.OSUI.Language {
    function Get(): string;
    function GetShort(): string;
    function Set(lang: string): void;
}
declare namespace OutSystems.OSUI.Utils.LayoutPrivate {
    function Dispose(): void;
    function FixInputs(): void;
    function HideHeader(HideHeader: boolean): void;
    function RTLObserver(callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): void;
    function SetDeviceClass(IsWebApp: boolean): void;
    function SetStickyObserver(): void;
}
declare namespace OutSystems.OSUI.Utils.LayoutPrivate {
    abstract class CssBodyVariables {
        private static _setCssVars;
        static Set(): void;
    }
}
declare namespace OutSystems.OSUI.Utils.LayoutPrivate {
    abstract class CloseDeprecatedSubmenu {
        private static _checkMenuLinks;
        private static _closeMenuEvent;
        private static _deprecatedSubmenuItems;
        private static _checkDeprecatedSubmenu;
        private static _closeDeprecatedSubmenu;
        static Set(): void;
        static Unset(): void;
    }
}
declare namespace OutSystems.OSUI.Utils.LayoutPrivate {
    abstract class OnOrientationChange {
        private static _onOrientationChange;
        static Set(): void;
        static Unset(): void;
    }
}
declare namespace OutSystems.OSUI.Utils.LayoutPrivate {
    abstract class SkipContentLink {
        private static _setLink;
        static Set(): void;
    }
}
declare namespace OutSystems.OSUI.Utils {
    function LogMessage(message: string): void;
}
declare namespace OutSystems.OSUI.Utils {
    function HasMasterDetail(): boolean;
    function SetFocusBehaviour(contentId: string, triggerItem: string): string;
}
declare namespace OutSystems.OSUI.Utils.Menu {
    function AddMenuOnOrientationChange(callback: OSFramework.OSUI.GlobalCallbacks.Generic): void;
    function IsMenuDraggable(): string;
    function MenuHide(): string;
    function MenuShow(): string;
    function RemoveMenuOnOrientationChange(): void;
    function SetActiveMenuItems(WidgetId: string, ActiveItem: number, ActiveSubItem: number): string;
    function SetBottomBarActiveElement(ActiveItem?: number): string;
    function SetMenuAttributes(): string;
    function SetMenuIcon(MenuAction: string): string;
    function SetMenuIconListeners(): string;
    function SetMenuListeners(WidgetId: string): string;
    function ToggleSideMenu(): string;
}
declare namespace OutSystems.OSUI.Utils.Network {
    function IsOnline(): boolean;
    function Type(): string;
}
declare namespace OutSystems.OSUI.Utils {
    function AbstractNormalizeProviderConfigs(providerConfigs: ProviderConfigs, htmlElementsProps?: Array<string>): ProviderConfigs;
}
declare namespace OutSystems.OSUI.Utils {
    function ScrollToElement(ElementId: string, IsSmooth?: boolean, OffSet?: number, ElementParentClass?: string, ScrollDelay?: number): string;
}
declare namespace OutSystems.OSUI.Utils {
    function ToggleClass(element: HTMLElement, state: any, className: string): void;
}
declare namespace OutSystems.OSUI.Utils {
    function AddFavicon(URL: string): string;
    function GetIsRTL(): boolean;
    function ListItemAnimate(ListId: string, HasLeftAction: boolean, HasRightAction: boolean, AnimationTime: number): string;
    function MoveElement(ElementId: string, TargetSelector: string, TimeoutVal?: number): string;
    function SetActiveElement(ElementId: string, IsActive: boolean): string;
    function SetSelectedTableRow(TableId: string, RowNumber: number, IsSelected: boolean): string;
    function ShowPassword(WidgetId?: string): string;
}
declare namespace Providers.OSUI.ErrorCodes {
    const FloatingUI: {
        FailCallProvider: string;
        FailSetPosition: string;
    };
}
declare namespace Providers {
}
declare namespace Providers.OSUI.Carousel.Splide.Enum {
    enum CssClass {
        SplideWrapper = "splide",
        SplideTrack = "splide__track",
        SplideList = "splide__list",
        SplideSlide = "splide__slide"
    }
    enum Go {
        Next = ">",
        Previous = "<"
    }
    enum KeyboardOptions {
        Focused = "focused"
    }
    enum SpliderEvents {
        Mounted = "mounted",
        Moved = "moved"
    }
    enum ProviderInfo {
        Name = "Splide",
        Version = "4.1.3"
    }
    enum TypeOptions {
        Loop = "loop",
        Slide = "slide"
    }
}
declare namespace Providers.OSUI.Carousel.Splide {
    class OSUISplide extends OSFramework.OSUI.Patterns.Carousel.AbstractCarousel<Splide, Splide.SplideConfig> implements OSFramework.OSUI.Patterns.Carousel.ICarousel {
        private _blockOnRender;
        private _carouselListWidgetElem;
        private _carouselPlaceholderElem;
        private _carouselProviderElem;
        private _carouselTrackElem;
        private _currentIndex;
        private _eventOnResize;
        private _hasList;
        private _platformEventOnSlideMoved;
        private _splideOptions;
        constructor(uniqueId: string, configs: JSON);
        private _checkListWidget;
        private _initProvider;
        private _prepareCarouselItems;
        private _redefineCarouselWidth;
        private _setCarouselWidth;
        private _setOnInitializedEvent;
        private _setOnSlideMovedEvent;
        private _togglePaginationClass;
        protected prepareConfigs(): void;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected setInitialCssClasses(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        dispose(): void;
        goTo(index: number): void;
        next(): void;
        previous(): void;
        registerCallback(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): void;
        setCarouselDirection(direction: string): void;
        setProviderConfigs(newConfigs: SplideOpts): void;
        toggleDrag(hasDrag: boolean): void;
        toggleOnRender(blockOnRender: boolean): void;
        updateOnRender(): void;
    }
}
declare namespace Providers.OSUI.Carousel.Splide {
    class SplideConfig extends OSFramework.OSUI.Patterns.Carousel.AbstractCarouselConfig {
        private _providerExtendedOptions;
        private _providerOptions;
        private _getArrowConfig;
        private _getDirectionConfig;
        private _getPaginationConfig;
        getProviderConfig(): SplideOpts;
        setExtensibilityConfigs(newConfigs: SplideOpts): void;
    }
}
declare namespace Providers.OSUI.Carousel.Splide.Utils {
    function NormalizeSplideConfigs(splideConfigs: SplideOpts): SplideOpts;
}
declare namespace Providers.OSUI.Datepicker.Flatpickr {
    abstract class AbstractFlatpickr<C extends Flatpickr.AbstractFlatpickrConfig> extends OSFramework.OSUI.Patterns.DatePicker.AbstractDatePicker<Flatpickr, C> implements IFlatpickr {
        private _a11yInfoContainerElem;
        private _bodyScrollCommonBehaviour;
        private _providerFocusSpanTarget;
        private _todayButtonElem;
        private _zindexCommonBehavior;
        protected datePickerPlatformInputElem: HTMLInputElement;
        protected flatpickrInputElem: HTMLInputElement;
        protected flatpickrOpts: FlatpickrOptions;
        protected onSelectedCallbackEvent: OSFramework.OSUI.Patterns.DatePicker.Callbacks.OSOnChangeEvent;
        constructor(uniqueId: string, configs: C);
        private _setAttributes;
        private _setCalendarCssClasses;
        private _setParentMinHeight;
        private _todayButtonKeydown;
        private _unsetParentMinHeight;
        protected addTodayBtn(): void;
        protected createProviderInstance(): void;
        protected jumpIntoToday(): void;
        protected prepareConfigs(): void;
        protected prepareToAndRedraw(): void;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        clear(): void;
        close(): void;
        disableDays(disableDays: string[]): void;
        disableWeekDays(disableWeekDays: number[]): void;
        dispose(): void;
        open(): void;
        registerCallback(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): void;
        setEditableInput(isEditable: boolean): void;
        setLanguage(value: string): void;
        setProviderConfigs(newConfigs: FlatpickrOptions): void;
        toggleNativeBehavior(isNative: boolean): void;
        updatePrompt(promptMessage: string): void;
        protected abstract onDateSelectedEvent(selectedDates: Array<Date>): void;
        protected abstract todayBtnClick(event: MouseEvent): void;
        protected abstract updatePlatformInputAttrs(): void;
        abstract updateInitialDate(start: string, end?: string): void;
    }
}
declare namespace Providers.OSUI.Datepicker.Flatpickr {
    abstract class AbstractFlatpickrConfig extends OSFramework.OSUI.Patterns.DatePicker
        .AbstractDatePickerConfig {
        private _disabledDays;
        private _disabledWeekDays;
        private _isUsingDateTime;
        private _lang;
        private _providerOptions;
        protected providerExtendedOptions: FlatpickrOptions;
        AllowInput: boolean;
        CalendarMode: OSFramework.OSUI.Patterns.DatePicker.Enum.Mode;
        Disable: any[];
        DisableMobile: boolean;
        OnChange: OSFramework.OSUI.GlobalCallbacks.Generic;
        constructor(config: JSON);
        private _checkAltFormat;
        private _checkDisableWeeksDay;
        private _checkLocale;
        private _mapProviderDateFormat;
        private _setDisable;
        private _validateDate;
        getProviderConfig(): FlatpickrOptions;
        setExtensibilityConfigs(newConfigs: FlatpickrOptions): void;
        get Lang(): string;
        set Lang(value: string);
        get ServerDateFormat(): string;
        set DisabledDays(value: string[]);
        set DisabledWeekDays(value: number[]);
    }
}
declare namespace Providers.OSUI.Datepicker.Flatpickr {
    const ErrorCodes: {
        FailSetLocale: string;
    };
}
declare namespace Providers.OSUI.Datepicker.Flatpickr.Enum {
    enum Attribute {
        DefaultAriaLabel = "Select a date."
    }
    enum CssClasses {
        AccessibilityContainerInfo = "osui-datepicker-a11y",
        TodayBtn = "flatpickr-today-button"
    }
    enum CSSSelectors {
        DatepickerNotValid = "osui-datepicker .not-valid + .input"
    }
    enum DisableDate {
        Weekdays = "Weekdays"
    }
}
declare namespace Providers.OSUI.Datepicker.Flatpickr.Factory {
    function NewFlatpickr(datePickerId: string, mode: OSFramework.OSUI.Patterns.DatePicker.Enum.Mode, configs: string): OSFramework.OSUI.Patterns.DatePicker.IDatePicker;
}
declare namespace Providers.OSUI.Datepicker.Flatpickr {
    interface IFlatpickr extends OSFramework.OSUI.Patterns.DatePicker.IDatePicker, OSFramework.OSUI.Interface.IProviderPattern<Flatpickr> {
    }
}
declare namespace Providers.OSUI.Datepicker.Flatpickr.RangeDate.Enum {
    enum Properties {
        InitialEndDate = "InitialEndDate",
        InitialStartDate = "InitialStartDate"
    }
}
declare namespace Providers.OSUI.Datepicker.Flatpickr.RangeDate {
    class OSUIFlatpickrRangeDate extends AbstractFlatpickr<FlatpickrRangeDateConfig> {
        constructor(uniqueId: string, configs: JSON);
        private _onUpdateDateFormat;
        private _updateInitialStartAndEndDates;
        protected onDateSelectedEvent(selectedDates: Array<Date>): void;
        protected todayBtnClick(event: MouseEvent): void;
        protected updatePlatformInputAttrs(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        updateInitialDate(startDate: string, endDate: string): void;
    }
}
declare namespace Providers.OSUI.Datepicker.Flatpickr.RangeDate {
    class FlatpickrRangeDateConfig extends AbstractFlatpickrConfig {
        InitialEndDate: string;
        InitialStartDate: string;
        constructor(config: JSON);
        private _setDefaultDate;
        getProviderConfig(): FlatpickrOptions;
    }
}
declare namespace Providers.OSUI.Datepicker.Flatpickr.SingleDate.Enum {
    enum Properties {
        InitialDate = "InitialDate"
    }
}
declare namespace Providers.OSUI.Datepicker.Flatpickr.SingleDate {
    class OSUIFlatpickrSingleDate extends AbstractFlatpickr<FlatpickrSingleDateConfig> {
        private _isUpdatedInitialDateByClientAction;
        constructor(uniqueId: string, configs: JSON);
        protected onDateSelectedEvent(selectedDates: Array<Date>): void;
        protected prepareToAndRedraw(): void;
        protected todayBtnClick(event: MouseEvent): void;
        protected updatePlatformInputAttrs(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        updateInitialDate(value: string): void;
    }
}
declare namespace Providers.OSUI.Datepicker.Flatpickr.SingleDate {
    class FlatpickrSingleDateConfig extends AbstractFlatpickrConfig {
        InitialDate: string;
        constructor(config: JSON);
        getProviderConfig(): FlatpickrOptions;
    }
}
declare namespace Providers.OSUI.Datepicker.Flatpickr.l10ns {
    const A11yContainerInfo: {
        ar: {
            htmlTex: string;
        };
        at: {
            htmlTex: string;
        };
        az: {
            htmlTex: string;
        };
        be: {
            htmlTex: string;
        };
        bg: {
            htmlTex: string;
        };
        bn: {
            htmlTex: string;
        };
        bs: {
            htmlTex: string;
        };
        ca: {
            htmlTex: string;
        };
        cat: {
            htmlTex: string;
        };
        ckb: {
            htmlTex: string;
        };
        cs: {
            htmlTex: string;
        };
        cy: {
            htmlTex: string;
        };
        da: {
            htmlTex: string;
        };
        de: {
            htmlTex: string;
        };
        en: {
            htmlTex: string;
        };
        eo: {
            htmlTex: string;
        };
        es: {
            htmlTex: string;
        };
        et: {
            htmlTex: string;
        };
        fa: {
            htmlTex: string;
        };
        fi: {
            htmlTex: string;
        };
        fo: {
            htmlTex: string;
        };
        fr: {
            htmlTex: string;
        };
        ga: {
            htmlTex: string;
        };
        gr: {
            htmlTex: string;
        };
        he: {
            htmlTex: string;
        };
        hi: {
            htmlTex: string;
        };
        hr: {
            htmlTex: string;
        };
        hu: {
            htmlTex: string;
        };
        hy: {
            htmlTex: string;
        };
        id: {
            htmlTex: string;
        };
        is: {
            htmlTex: string;
        };
        it: {
            htmlTex: string;
        };
        ja: {
            htmlTex: string;
        };
        ka: {
            htmlTex: string;
        };
        km: {
            htmlTex: string;
        };
        ko: {
            htmlTex: string;
        };
        kz: {
            htmlTex: string;
        };
        lt: {
            htmlTex: string;
        };
        lv: {
            htmlTex: string;
        };
        mk: {
            htmlTex: string;
        };
        mn: {
            htmlTex: string;
        };
        ms: {
            htmlTex: string;
        };
        my: {
            htmlTex: string;
        };
        nl: {
            htmlTex: string;
        };
        nb: {
            htmlTex: string;
        };
        nn: {
            htmlTex: string;
        };
        no: {
            htmlTex: string;
        };
        pa: {
            htmlTex: string;
        };
        pl: {
            htmlTex: string;
        };
        pt: {
            htmlTex: string;
        };
        ro: {
            htmlTex: string;
        };
        ru: {
            htmlTex: string;
        };
        si: {
            htmlTex: string;
        };
        sk: {
            htmlTex: string;
        };
        sl: {
            htmlTex: string;
        };
        sq: {
            htmlTex: string;
        };
        sr: {
            htmlTex: string;
        };
        sv: {
            htmlTex: string;
        };
        th: {
            htmlTex: string;
        };
        tr: {
            htmlTex: string;
        };
        uk: {
            htmlTex: string;
        };
        uz: {
            htmlTex: string;
        };
        vn: {
            htmlTex: string;
        };
        zh: {
            htmlTex: string;
        };
        zh_tw: {
            htmlTex: string;
        };
    };
}
declare namespace Providers.OSUI.Datepicker.Flatpickr.l10ns {
    const TodayBtn: {
        ar: {
            ariaLabel: string;
            title: string;
        };
        at: {
            ariaLabel: string;
            title: string;
        };
        az: {
            ariaLabel: string;
            title: string;
        };
        be: {
            ariaLabel: string;
            title: string;
        };
        bg: {
            ariaLabel: string;
            title: string;
        };
        bn: {
            ariaLabel: string;
            title: string;
        };
        bs: {
            ariaLabel: string;
            title: string;
        };
        ca: {
            ariaLabel: string;
            title: string;
        };
        cat: {
            ariaLabel: string;
            title: string;
        };
        ckb: {
            ariaLabel: string;
            title: string;
        };
        cs: {
            ariaLabel: string;
            title: string;
        };
        cy: {
            ariaLabel: string;
            title: string;
        };
        da: {
            ariaLabel: string;
            title: string;
        };
        de: {
            ariaLabel: string;
            title: string;
        };
        eo: {
            ariaLabel: string;
            title: string;
        };
        es: {
            ariaLabel: string;
            title: string;
        };
        en: {
            ariaLabel: string;
            title: string;
        };
        et: {
            ariaLabel: string;
            title: string;
        };
        fa: {
            ariaLabel: string;
            title: string;
        };
        fi: {
            ariaLabel: string;
            title: string;
        };
        fo: {
            ariaLabel: string;
            title: string;
        };
        fr: {
            ariaLabel: string;
            title: string;
        };
        ga: {
            ariaLabel: string;
            title: string;
        };
        gr: {
            ariaLabel: string;
            title: string;
        };
        he: {
            ariaLabel: string;
            title: string;
        };
        hi: {
            ariaLabel: string;
            title: string;
        };
        hr: {
            ariaLabel: string;
            title: string;
        };
        hu: {
            ariaLabel: string;
            title: string;
        };
        hy: {
            ariaLabel: string;
            title: string;
        };
        id: {
            ariaLabel: string;
            title: string;
        };
        is: {
            ariaLabel: string;
            title: string;
        };
        it: {
            ariaLabel: string;
            title: string;
        };
        ja: {
            ariaLabel: string;
            title: string;
        };
        ka: {
            ariaLabel: string;
            title: string;
        };
        km: {
            ariaLabel: string;
            title: string;
        };
        ko: {
            ariaLabel: string;
            title: string;
        };
        kz: {
            ariaLabel: string;
            title: string;
        };
        lt: {
            ariaLabel: string;
            title: string;
        };
        lv: {
            ariaLabel: string;
            title: string;
        };
        mk: {
            ariaLabel: string;
            title: string;
        };
        mn: {
            ariaLabel: string;
            title: string;
        };
        ms: {
            ariaLabel: string;
            title: string;
        };
        my: {
            ariaLabel: string;
            title: string;
        };
        nl: {
            ariaLabel: string;
            title: string;
        };
        nb: {
            ariaLabel: string;
            title: string;
        };
        nn: {
            ariaLabel: string;
            title: string;
        };
        no: {
            ariaLabel: string;
            title: string;
        };
        pa: {
            ariaLabel: string;
            title: string;
        };
        pl: {
            ariaLabel: string;
            title: string;
        };
        pt: {
            ariaLabel: string;
            title: string;
        };
        ro: {
            ariaLabel: string;
            title: string;
        };
        ru: {
            ariaLabel: string;
            title: string;
        };
        si: {
            ariaLabel: string;
            title: string;
        };
        sk: {
            ariaLabel: string;
            title: string;
        };
        sl: {
            ariaLabel: string;
            title: string;
        };
        sq: {
            ariaLabel: string;
            title: string;
        };
        sr: {
            ariaLabel: string;
            title: string;
        };
        sv: {
            ariaLabel: string;
            title: string;
        };
        th: {
            ariaLabel: string;
            title: string;
        };
        tr: {
            ariaLabel: string;
            title: string;
        };
        uk: {
            ariaLabel: string;
            title: string;
        };
        uz: {
            ariaLabel: string;
            title: string;
        };
        vn: {
            ariaLabel: string;
            title: string;
        };
        zh: {
            ariaLabel: string;
            title: string;
        };
        zh_tw: {
            ariaLabel: string;
            title: string;
        };
    };
}
declare namespace Providers.OSUI.Dropdown.VirtualSelect {
    abstract class AbstractVirtualSelect<C extends Dropdown.VirtualSelect.AbstractVirtualSelectConfig> extends OSFramework.OSUI.Patterns.Dropdown.AbstractDropdown<VirtualSelect, C> implements IVirtualSelect {
        private _eventOnWindowResize;
        private _onMouseUpEvent;
        private _onSelectedOptionEvent;
        private _platformEventSelectedOptCallback;
        protected hiddenInputWrapperAriaLabelVal: string;
        protected virtualselectConfigs: VirtualSelectMethods;
        protected virtualselectOpts: VirtualSelectOpts;
        constructor(uniqueId: string, configs: C);
        private _addErrorMessage;
        private _manageAttributes;
        private _manageDisableStatus;
        private _onMouseUp;
        private _onSelectedOption;
        private _onWindowResize;
        private _setElementId;
        private _setUpEvents;
        private _unsetEvents;
        protected createProviderInstance(): void;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        clear(): void;
        close(): void;
        disable(): void;
        dispose(): void;
        enable(): void;
        getSelectedValues(): string;
        open(): void;
        registerCallback(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): void;
        setHiddenInputWrapperAriaLabelVal(value?: string): void;
        setProviderConfigs(newConfigs: VirtualSelectOpts): void;
        setValue(optionsToSelect: DropDownOption[], silentOnChangedEvent?: boolean): void;
        togglePopup(isEnabled: boolean): void;
        validation(isValid: boolean, validationMessage: string): void;
        protected abstract getSelectedOptionsStructure(): DropDownOption[];
        protected abstract prepareConfigs(): void;
    }
}
declare namespace Providers.OSUI.Dropdown.VirtualSelect {
    abstract class AbstractVirtualSelectConfig extends OSFramework.OSUI.Patterns.Dropdown
        .AbstractDropdownConfig {
        private _groupedOptionsList;
        private _providerOptions;
        protected providerExtendedOptions: VirtualSelectOpts;
        ElementId: string;
        NoOptionsText: string;
        NoResultsText: string;
        OptionsList: DropDownOption[];
        Prompt: string;
        SearchPrompt: string;
        ShowDropboxAsPopup: boolean;
        StartingSelection: DropDownOption[];
        private _checkForFigType;
        private _getGroupedOptionsList;
        private _getOptionIconPrefix;
        private _getOptionImagePrefix;
        private _getOptionInfo;
        private _getOptionsList;
        private _groupOptions;
        getProviderConfig(): VirtualSelectOpts;
        setExtensibilityConfigs(newConfigs: VirtualSelectOpts): void;
        validateDefault(key: string, value: unknown): unknown;
        protected abstract getSelectedValues(): string[];
    }
}
declare namespace Providers.OSUI.Dropdown.VirtualSelect.Enum {
    enum ProviderInfo {
        Name = "VirtualSelect",
        Version = "1.0.40"
    }
    enum CssClass {
        ErrorMessage = "osui-dropdown-error-message",
        NotValid = "osui-dropdown--not-valid",
        OptionItemIcon = "osui-dropdown-option-icon",
        OptionItemImage = "osui-dropdown-option-image"
    }
    enum Events {
        BeforeClose = "beforeClose",
        BeforeOpen = "beforeOpen",
        Change = "change",
        OnSelected = "OnSelected"
    }
    enum Properties {
        NoOptionsText = "NoOptionsText",
        NoResultsText = "NoResultsText",
        OptionsList = "OptionsList",
        Prompt = "Prompt",
        SearchPrompt = "SearchPrompt",
        StartingSelection = "StartingSelection"
    }
    enum PropertiesValues {
        AriaLabelMultipleValue = "Select one or more options",
        AriaLabelSingleValue = "Select an option"
    }
    enum FigureType {
        Icon = "Icon",
        Image = "Image",
        None = "None"
    }
    enum ExtendedConfigs {
        hasOptionDescription = "hasOptionDescription"
    }
}
declare namespace Providers.OSUI.Dropdown.VirtualSelect {
    interface IVirtualSelect extends OSFramework.OSUI.Patterns.Dropdown.IDropdown {
        setValue(selectedValues: DropDownOption[]): void;
        togglePopup(isEnabled: boolean): void;
    }
}
declare namespace Providers.OSUI.Dropdown.VirtualSelect.Utils {
    function NormalizeVirtualSelectConfigs(virtualSelectConfigs: VirtualSelectOpts): VirtualSelectOpts;
}
declare namespace Providers.OSUI.Dropdown.VirtualSelect.Factory {
    function NewVirtualSelect(dropdownId: string, mode: string, configs: JSON): OSFramework.OSUI.Patterns.Dropdown.IDropdown;
}
declare namespace Providers.OSUI.Dropdown.VirtualSelect.Search.Enum {
    enum Properties {
        AllowMultipleSelection = "AllowMultipleSelection"
    }
}
declare namespace Providers.OSUI.Dropdown.VirtualSelect.Search {
    class OSUIVirtualSelectSearch extends AbstractVirtualSelect<VirtualSelectSearchConfig> {
        constructor(uniqueId: string, configs: JSON);
        protected getSelectedOptionsStructure(): DropDownOption[];
        protected prepareConfigs(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
    }
}
declare namespace Providers.OSUI.Dropdown.VirtualSelect.Search {
    class VirtualSelectSearchConfig extends AbstractVirtualSelectConfig {
        AllowMultipleSelection: boolean;
        protected getSelectedValues(): string[];
        getProviderConfig(): VirtualSelectOpts;
        validateDefault(key: string, value: unknown): unknown;
    }
}
declare namespace Providers.OSUI.Dropdown.VirtualSelect.Tags {
    class OSUIVirtualSelectTags extends AbstractVirtualSelect<VirtualSelectTagsConfig> {
        constructor(uniqueId: string, configs: JSON);
        protected getSelectedOptionsStructure(): DropDownOption[];
        protected prepareConfigs(): void;
    }
}
declare namespace Providers.OSUI.Dropdown.VirtualSelect.Tags {
    class VirtualSelectTagsConfig extends AbstractVirtualSelectConfig {
        protected getSelectedValues(): string[];
        getProviderConfig(): VirtualSelectOpts;
    }
}
declare namespace Providers.OSUI.MonthPicker.Flatpickr.Enum {
    enum Attribute {
        DefaultAriaLabel = "Select a month"
    }
    enum CssClasses {
        AccessibilityContainerInfo = "osui-monthpicker-a11y"
    }
}
declare namespace Providers.OSUI.MonthPicker.Flatpickr {
    const ErrorCodes: {
        FailSetLocale: string;
    };
}
declare namespace Providers.OSUI.MonthPicker.Flatpickr {
    class OSUIFlatpickrMonth extends OSFramework.OSUI.Patterns.MonthPicker.AbstractMonthPicker<Flatpickr, FlatpickrMonthConfig> implements IFlatpickrMonth {
        private _a11yInfoContainerElem;
        private _bodyOnClickGlobalEvent;
        private _bodyScrollCommonBehaviour;
        private _flatpickrOpts;
        private _zindexCommonBehavior;
        protected flatpickrInputElem: HTMLInputElement;
        protected monthPickerPlatformInputElem: HTMLInputElement;
        protected onSelectedCallbackEvent: OSFramework.OSUI.Patterns.MonthPicker.Callbacks.OSOnSelectedEvent;
        constructor(uniqueId: string, configs: JSON);
        private _getBodyOnClickGlobalEvent;
        private _setAttributes;
        private _setCalendarCssClasses;
        protected createProviderInstance(): void;
        protected onClose(): void;
        protected onMonthSelectedEvent(selectedMonthYear: Array<Date>): void;
        protected onOpen(): void;
        protected prepareConfigs(): void;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        protected updatePlatformInputAttrs(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        clear(): void;
        close(): void;
        dispose(): void;
        open(): void;
        registerCallback(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): void;
        setEditableInput(isEditable: boolean): void;
        setLanguage(value: string): void;
        setProviderConfigs(newConfigs: FlatpickrOptions): void;
        updateInitialMonth(monthYear: MonthYear): void;
        updatePrompt(promptMessage: string): void;
    }
}
declare namespace Providers.OSUI.MonthPicker.Flatpickr {
    class FlatpickrMonthConfig extends OSFramework.OSUI.Patterns.MonthPicker.AbstractMonthPickerConfig {
        private _lang;
        private _providerOptions;
        protected providerExtendedOptions: FlatpickrOptions;
        AllowInput: boolean;
        DisableMobile: boolean;
        OnChangeEventCallback: OSFramework.OSUI.GlobalCallbacks.Generic;
        OnCloseEventCallback: OSFramework.OSUI.GlobalCallbacks.Generic;
        OnOpenEventCallback: OSFramework.OSUI.GlobalCallbacks.Generic;
        ServerDateFormat: string;
        constructor(config: JSON);
        private _checkDateFormat;
        private _checkLocale;
        private _checkServerDateFormat;
        private _getDateFromMonthYear;
        private _mapProviderDateFormat;
        getProviderConfig(): FlatpickrOptions;
        setExtensibilityConfigs(newConfigs: FlatpickrOptions): void;
        get Lang(): string;
        set Lang(value: string);
    }
}
declare namespace Providers.OSUI.MonthPicker.Flatpickr {
    interface IFlatpickrMonth extends OSFramework.OSUI.Patterns.MonthPicker.IMonthPicker, OSFramework.OSUI.Interface.IProviderPattern<Flatpickr> {
    }
}
declare namespace Providers.OSUI.MonthPicker.Flatpickr.l10ns {
    const A11yContainerInfo: {
        ar: {
            htmlTex: string;
        };
        at: {
            htmlTex: string;
        };
        az: {
            htmlTex: string;
        };
        be: {
            htmlTex: string;
        };
        bg: {
            htmlTex: string;
        };
        bn: {
            htmlTex: string;
        };
        bs: {
            htmlTex: string;
        };
        ca: {
            htmlTex: string;
        };
        cat: {
            htmlTex: string;
        };
        ckb: {
            htmlTex: string;
        };
        cs: {
            htmlTex: string;
        };
        cy: {
            htmlTex: string;
        };
        da: {
            htmlTex: string;
        };
        de: {
            htmlTex: string;
        };
        en: {
            htmlTex: string;
        };
        eo: {
            htmlTex: string;
        };
        es: {
            htmlTex: string;
        };
        et: {
            htmlTex: string;
        };
        fa: {
            htmlTex: string;
        };
        fi: {
            htmlTex: string;
        };
        fo: {
            htmlTex: string;
        };
        fr: {
            htmlTex: string;
        };
        ga: {
            htmlTex: string;
        };
        gr: {
            htmlTex: string;
        };
        he: {
            htmlTex: string;
        };
        hi: {
            htmlTex: string;
        };
        hr: {
            htmlTex: string;
        };
        hu: {
            htmlTex: string;
        };
        hy: {
            htmlTex: string;
        };
        id: {
            htmlTex: string;
        };
        is: {
            htmlTex: string;
        };
        it: {
            htmlTex: string;
        };
        ja: {
            htmlTex: string;
        };
        ka: {
            htmlTex: string;
        };
        km: {
            htmlTex: string;
        };
        ko: {
            htmlTex: string;
        };
        kz: {
            htmlTex: string;
        };
        lt: {
            htmlTex: string;
        };
        lv: {
            htmlTex: string;
        };
        mk: {
            htmlTex: string;
        };
        mn: {
            htmlTex: string;
        };
        ms: {
            htmlTex: string;
        };
        my: {
            htmlTex: string;
        };
        nl: {
            htmlTex: string;
        };
        nb: {
            htmlTex: string;
        };
        nn: {
            htmlTex: string;
        };
        no: {
            htmlTex: string;
        };
        pa: {
            htmlTex: string;
        };
        pl: {
            htmlTex: string;
        };
        pt: {
            htmlTex: string;
        };
        ro: {
            htmlTex: string;
        };
        ru: {
            htmlTex: string;
        };
        si: {
            htmlTex: string;
        };
        sk: {
            htmlTex: string;
        };
        sl: {
            htmlTex: string;
        };
        sq: {
            htmlTex: string;
        };
        sr: {
            htmlTex: string;
        };
        sv: {
            htmlTex: string;
        };
        th: {
            htmlTex: string;
        };
        tr: {
            htmlTex: string;
        };
        uk: {
            htmlTex: string;
        };
        uz: {
            htmlTex: string;
        };
        vn: {
            htmlTex: string;
        };
        zh: {
            htmlTex: string;
        };
        zh_tw: {
            htmlTex: string;
        };
    };
}
declare namespace Providers.OSUI.RangeSlider.NoUISlider {
    abstract class AbstractNoUiSlider<C extends NoUiSlider.AbstractNoUiSliderConfig> extends OSFramework.OSUI.Patterns.RangeSlider.AbstractRangeSlider<NoUiSlider, C> implements INoUiSlider {
        private _isInterval;
        private _rangeSliderProviderElem;
        protected eventProviderValueChanged: OSFramework.OSUI.GlobalCallbacks.Generic;
        protected noUiSliderOpts: NoUiSliderOptions;
        protected platformEventValueChange: OSFramework.OSUI.Patterns.RangeSlider.Callbacks.OSOnValueChangeEvent;
        protected throttleTimeValue: number;
        protected throttleTimer: any;
        constructor(uniqueId: string, configs: C);
        private _setIsDisabled;
        private _setOnValueChangeEvent;
        private _setSize;
        private _updateRangeValues;
        protected createProviderInstance(): void;
        protected setHtmlElements(): void;
        protected setInitialCSSClasses(): void;
        protected setInitialStates(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        disable(): void;
        dispose(): void;
        enable(): void;
        getValue(): number | number[];
        registerCallback(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): void;
        setProviderConfigs(newConfigs: NoUiSliderOptions): void;
        setRangeIntervalChangeOnDragEnd(): void;
        protected abstract prepareConfigs(): void;
    }
}
declare namespace Providers.OSUI.RangeSlider.NoUiSlider {
    abstract class AbstractNoUiSliderConfig extends OSFramework.OSUI.Patterns.RangeSlider
        .AbstractRangeSliderConfig {
        private _providerOptions;
        protected providerExtendedOptions: NoUiSliderOptions;
        rangeSliderMode: OSFramework.OSUI.Patterns.RangeSlider.Enum.Mode;
        getPipsConfig(): NoUiSliderPips;
        getProviderConfig(): NoUiSliderOptions;
        getRangeConfig(): NoUiSliderRange;
        getTooltipFormat(): NoUISliderTooltip;
        setExtensibilityConfigs(newConfigs: NoUiSliderOptions): void;
    }
}
declare namespace Providers.OSUI.RangeSlider.NoUISlider {
    interface INoUiSlider extends OSFramework.OSUI.Patterns.RangeSlider.IRangeSlider, OSFramework.OSUI.Interface.IProviderPattern<NoUiSlider> {
    }
}
declare namespace Providers.OSUI.RangeSlider.NoUiSlider.Enum {
    enum ProviderInfo {
        Name = "noUISlider",
        Version = "15.7.0"
    }
    enum NoUISliderLabels {
        Handle = "handler",
        Lower = "lower-handle",
        Single = "handle",
        Upper = "upper-handle"
    }
    enum NoUISliderEvents {
        Change = "change",
        End = "end",
        Start = "start",
        Slide = "slide"
    }
    enum NoUiSliderConnectOptions {
        Lower = "lower"
    }
    enum NoUiSliderModeOptions {
        Values = "values"
    }
}
declare namespace Providers.OSUI.RangeSlider.NoUiSlider.Factory {
    function NewNoUiSlider(rangeSliderId: string, configs: string, mode: OSFramework.OSUI.Patterns.RangeSlider.Enum.Mode): OSFramework.OSUI.Patterns.RangeSlider.IRangeSlider;
}
declare namespace Providers.OSUI.RangeSlider.NoUISlider.Utils {
    function NormalizeNoUISliderConfigs(noUiSliderConfigs: FlatpickrOptions): FlatpickrOptions;
}
declare namespace Providers.OSUI.RangeSlider.NoUISlider.IntervalSlider {
    class OSUINoUiSliderInterval extends AbstractNoUiSlider<NoUISlider.SliderInterval.NoUiSliderIntervalConfig> {
        constructor(uniqueId: string, configs: JSON);
        private _valueChangeCallback;
        protected prepareConfigs(): void;
        protected redraw(): void;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        resetValue(): void;
        setValue(intervalStart: number, intervalEnd: number): void;
    }
}
declare namespace Providers.OSUI.RangeSlider.NoUISlider.SliderInterval {
    class NoUiSliderIntervalConfig extends Providers.OSUI.RangeSlider.NoUiSlider.AbstractNoUiSliderConfig {
        constructor(config: JSON);
        getProviderConfig(): NoUiSliderOptions;
    }
}
declare namespace Providers.OSUI.RangeSlider.NoUISlider.SingleSlider {
    class OSUINoUiSliderSingle extends AbstractNoUiSlider<NoUISlider.SliderSingle.NoUiSliderSingleConfig> {
        constructor(uniqueId: string, configs: JSON);
        private _valueChangeCallback;
        protected prepareConfigs(): void;
        protected redraw(): void;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        resetValue(): void;
        setValue(value: number): void;
    }
}
declare namespace Providers.OSUI.RangeSlider.NoUISlider.SliderSingle {
    class NoUiSliderSingleConfig extends Providers.OSUI.RangeSlider.NoUiSlider.AbstractNoUiSliderConfig {
        constructor(config: JSON);
        getProviderConfig(): NoUiSliderOptions;
    }
}
declare namespace Providers.OSUI.SharedProviderResources.Flatpickr.Enum {
    enum ProviderInfo {
        Name = "Flatpickr",
        Version = "4.6.13"
    }
}
declare namespace Providers.OSUI.SharedProviderResources.Flatpickr {
    class UpdatePositionOnScroll {
        private _onScreenScrollEvent;
        private _picker;
        private _requestAnimationOnBodyScroll;
        constructor(picker: Datepicker.Flatpickr.IFlatpickr | TimePicker.Flatpickr.IFlatpickrTime | MonthPicker.Flatpickr.IFlatpickrMonth);
        private _onScreenScroll;
        private _setCallbacks;
        private _setUpEvents;
        private _unsetCallbacks;
        private _unsetEvents;
        dispose(): void;
    }
}
declare namespace Providers.OSUI.SharedProviderResources.Flatpickr {
    class UpdateZindex {
        private _patternExceptions;
        private _picker;
        constructor(picker: Datepicker.Flatpickr.IFlatpickr | TimePicker.Flatpickr.IFlatpickrTime | MonthPicker.Flatpickr.IFlatpickrMonth);
        private _updateZindex;
    }
}
declare namespace Providers.OSUI.SharedProviderResources.Flatpickr {
    function NormalizeFlatpickrConfigs(flatpickrConfigs: FlatpickrOptions): FlatpickrOptions;
}
declare namespace Providers.OSUI.TimePicker.Flatpickr.Enum {
    enum Properties {
        InitialTime = "InitialTime"
    }
    enum InputFormats {
        Format12h = "h:i K",
        Format24h = "H:i"
    }
}
declare namespace Providers.OSUI.TimePicker.Flatpickr {
    const ErrorCodes: {
        FailSetLocale: string;
    };
}
declare namespace Providers.OSUI.TimePicker.Flatpickr {
    class OSUIFlatpickrTime extends OSFramework.OSUI.Patterns.TimePicker.AbstractTimePicker<Flatpickr, FlatpickrTimeConfig> implements IFlatpickrTime {
        private _bodyOnClickGlobalEvent;
        private _bodyScrollCommonBehaviour;
        private _flatpickrOpts;
        private _zindexCommonBehavior;
        protected flatpickrInputElem: HTMLInputElement;
        protected onChangeCallbackEvent: OSFramework.OSUI.Patterns.TimePicker.Callbacks.OSOnChangeEvent;
        protected timePickerPlatformInputElem: HTMLInputElement;
        constructor(uniqueId: string, configs: JSON);
        private _getBodyOnClickGlobalEvent;
        private _setAttributes;
        private _setCalendarCssClasses;
        protected createProviderInstance(): void;
        protected onClose(): void;
        protected onOpen(): void;
        protected onTimeSelectedEvent(selectedTime: Array<Date>): void;
        protected prepareConfigs(): void;
        protected setA11YProperties(): void;
        protected setCallbacks(): void;
        protected setHtmlElements(): void;
        protected unsetCallbacks(): void;
        protected unsetHtmlElements(): void;
        protected updatePlatformInputAttrs(): void;
        build(): void;
        changeProperty(propertyName: string, propertyValue: unknown): void;
        clear(): void;
        close(): void;
        dispose(): void;
        open(): void;
        registerCallback(eventName: string, callback: OSFramework.OSUI.GlobalCallbacks.OSGeneric): void;
        setEditableInput(isEditable: boolean): void;
        setLanguage(value: string): void;
        setProviderConfigs(newConfigs: FlatpickrOptions): void;
        toggleNativeBehavior(isNative: boolean): void;
        updateInitialTime(value: string): void;
        updatePrompt(promptMessage: string): void;
    }
}
declare namespace Providers.OSUI.TimePicker.Flatpickr {
    class FlatpickrTimeConfig extends OSFramework.OSUI.Patterns.TimePicker.AbstractTimePickerConfig {
        private _lang;
        private _providerOptions;
        protected providerExtendedOptions: FlatpickrOptions;
        AllowInput: boolean;
        DisableMobile: boolean;
        OnChangeEventCallback: OSFramework.OSUI.GlobalCallbacks.Generic;
        OnCloseEventCallback: OSFramework.OSUI.GlobalCallbacks.Generic;
        OnOpenEventCallback: OSFramework.OSUI.GlobalCallbacks.Generic;
        ServerDateFormat: string;
        constructor(config: JSON);
        private _checkAltFormat;
        protected _checkLocale(): FlatpickrLocale;
        getProviderConfig(): FlatpickrOptions;
        setExtensibilityConfigs(newConfigs: FlatpickrOptions): void;
        get Lang(): string;
        set Lang(value: string);
    }
}
declare namespace Providers.OSUI.TimePicker.Flatpickr {
    interface IFlatpickrTime extends OSFramework.OSUI.Patterns.TimePicker.ITimePicker, OSFramework.OSUI.Interface.IProviderPattern<Flatpickr> {
    }
}
declare namespace Providers.OSUI.Utils.Enum {
    enum ProviderInfo {
        Name = "FloatingUI",
        Version = "1.2.8"
    }
}
declare namespace Providers.OSUI.Utils {
    class FloatingUI extends OSFramework.OSUI.Utils.FloatingPosition.FloatingPosition {
        constructor(options: FloatingUIConfig);
        dispose(): void;
        setFloatingPosition(): void;
        unsetFloatingPosition(): void;
    }
}
declare namespace Providers.OSUI.Utils {
    class FloatingUIConfig extends OSFramework.OSUI.Utils.FloatingPosition.FloatingPositionConfig {
    }
}
