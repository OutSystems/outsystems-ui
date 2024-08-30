// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.ErrorCodes {
	/**
	 * OutSystemsUI API Error Messages
	 */

	export const Success = {
		code: '200',
		message: 'Success',
	};

	export const Dropdown = {
		FailChangeProperty: 'OSUI-API-01001',
		FailClear: 'OSUI-API-01002',
		FailClose: 'OSUI-API-010014',
		FailDisable: 'OSUI-API-01003',
		FailDispose: 'OSUI-API-01004',
		FailEnable: 'OSUI-API-01005',
		FailGetSelectedValues: 'OSUI-API-01006',
		FailOpen: 'OSUI-API-010015',
		FailRegisterCallback: 'OSUI-API-01007',
		FailRegisterProviderConfig: 'OSUI-API-01009',
		FailRegisterProviderEvent: 'OSUI-API-060010',
		FailRemoveProviderEvent: 'OSUI-API-06011',
		FailSetValidation: 'OSUI-API-01008',
		FailSetValues: 'OSUI-API-06012',
		FailTogglePopup: 'OSUI-API-01013',
	};

	export const Notification = {
		FailChangeProperty: 'OSUI-API-02001',
		FailDispose: 'OSUI-API-02002',
		FailHide: 'OSUI-API-02003',
		FailRegisterCallback: 'OSUI-API-02004',
		FailShow: 'OSUI-API-02005',
	};

	export const SectionIndex = {
		FailChangeProperty: 'OSUI-API-03001',
		FailDisable: 'OSUI-API-03002',
		FailDispose: 'OSUI-API-03003',
		FailEnable: 'OSUI-API-03004',
		FailRegisterCallback: 'OSUI-API-03005',
	};

	export const Accordion = {
		FailChangeProperty: 'OSUI-API-04001',
		FailCollapseAll: 'OSUI-API-04002',
		FailDispose: 'OSUI-API-04003',
		FailExpandAll: 'OSUI-API-04004',
		FailRegisterCallback: 'OSUI-API-04005',
	};

	export const AccordionItem = {
		FailAllowTitleEvents: 'OSUI-API-05001',
		FailChangeProperty: 'OSUI-API-05002',
		FailCollapseItem: 'OSUI-API-05003',
		FailDispose: 'OSUI-API-05004',
		FailExpandItem: 'OSUI-API-05005',
		FailRegisterCallback: 'OSUI-API-05006',
	};

	export const Carousel = {
		FailChangeProperty: 'OSUI-API-06001',
		FailDispose: 'OSUI-API-06002',
		FailDirection: 'OSUI-API-06003',
		FailGoTo: 'OSUI-API-06004',
		FailNext: 'OSUI-API-06005',
		FailPrevious: 'OSUI-API-06006',
		FailRegisterCallback: 'OSUI-API-06007',
		FailToggleDrag: 'OSUI-API-06008',
		FailUpdate: 'OSUI-API-06009',
		FailRegisterProviderConfig: 'OSUI-API-06010',
		FailRegisterProviderEvent: 'OSUI-API-06011',
		FailRemoveProviderEvent: 'OSUI-API-06012',
		FailEnableOnRender: 'OSUI-API-06013',
		FailDisableOnRender: 'OSUI-API-06014',
	};

	export const DatePicker = {
		FailChangeProperty: 'OSUI-API-07001',
		FailClear: 'OSUI-API-07002',
		FailClose: 'OSUI-API-07003',
		FailDisableDays: 'OSUI-API-07011',
		FailDisableWeekDays: 'OSUI-API-07012',
		FailDispose: 'OSUI-API-07004',
		FailOpen: 'OSUI-API-07005',
		FailRedraw: 'OSUI-API-07006',
		FailRegisterCallback: 'OSUI-API-07007',
		FailRegisterProviderConfig: 'OSUI-API-07008',
		FailRegisterProviderEvent: 'OSUI-API-07009',
		FailRemoveProviderEvent: 'OSUI-API-07010',
		FailSetEditableInput: 'OSUI-API-07013',
		FailSetLanguage: 'OSUI-API-07014',
		FailToggleNativeBehavior: 'OSUI-API-07015',
		FailUpdateInitialDate: 'OSUI-API-07016',
		FailUpdatePrompt: 'OSUI-API-07017',
		FailOnRender: 'OSUI-API-07018',
	};

	export const FlipContent = {
		FailChangeProperty: 'OSUI-API-08001',
		FailDispose: 'OSUI-API-08002',
		FailRegisterCallback: 'OSUI-API-08003',
		FailShowBack: 'OSUI-API-08004',
		FailShowFront: 'OSUI-API-08005',
		FailToggle: 'OSUI-API-08006',
	};

	export const Progress = {
		FailChangeProperty: 'OSUI-API-09001',
		FailDispose: 'OSUI-API-09002',
		FailProgressValue: 'OSUI-API-09003',
		FailProgressReset: 'OSUI-API-09004',
		FailtProgressGradient: 'OSUI-API-09005',
		FailRegisterCallback: 'OSUI-API-09006',
	};

	export const RangeSlider = {
		FailChangeProperty: 'OSUI-API-10001',
		FailDispose: 'OSUI-API-10002',
		FailOnDragEnd: 'OSUI-API-10003',
		FailRegisterCallback: 'OSUI-API-10004',
		FailSetValues: 'OSUI-API-10005',
		FailResetValues: 'OSUI-API-10006',
		FailRegisterProviderConfig: 'OSUI-API-10007',
		FailRegisterProviderEvent: 'OSUI-API-10008',
		FailRemoveProviderEvent: 'OSUI-API-10009',
		FailEnable: 'OSUI-API-10010',
		FailDisable: 'OSUI-API-10011',
	};

	export const Sidebar = {
		FailChangeProperty: 'OSUI-API-11001',
		FailClose: 'OSUI-API-11002',
		FailDispose: 'OSUI-API-11003',
		FailOpen: 'OSUI-API-11004',
		FailRegisterCallback: 'OSUI-API-11005',
		FailToggleSwipe: 'OSUI-API-11006',
		FailClickOutsideToClose: 'OSUI-API-11007',
	};

	export const Submenu = {
		FailChangeProperty: 'OSUI-API-12001',
		FailClose: 'OSUI-API-12002',
		FailDispose: 'OSUI-API-12003',
		FailOpen: 'OSUI-API-12004',
		FailOpenOnHover: 'OSUI-API-12005',
		FailRegisterCallback: 'OSUI-API-12006',
		FailUpdate: 'OSUI-API-12007',
		FailClickOutsideToClose: 'OSUI-API-12008',
	};

	export const Tooltip = {
		FailChangeProperty: 'OSUI-API-13001',
		FailClose: 'OSUI-API-13002',
		FailDispose: 'OSUI-API-13003',
		FailOpen: 'OSUI-API-13004',
		FailRegisterCallback: 'OSUI-GEN-13005',
	};

	export const AnimatedLabel = {
		FailChangeProperty: 'OSUI-API-14001',
		FailDispose: 'OSUI-API-14002',
		FailRegisterCallback: 'OSUI-API-14004',
		FailUpdate: 'OSUI-API-14003',
	};

	export const ButtonLoading = {
		FailChangeProperty: 'OSUI-API-15001',
		FailDispose: 'OSUI-API-15002',
		FailRegisterCallback: 'OSUI-API-15003',
	};

	export const DropdownServerSideItem = {
		FailChangeProperty: 'OSUI-API-16001',
		FailDispose: 'OSUI-API-16002',
		FailRegisterCallback: 'OSUI-API-16003',
	};

	export const FloatingActions = {
		FailChangeProperty: 'OSUI-API-17001',
		FailDispose: 'OSUI-API-17002',
		FailRegisterCallback: 'OSUI-API-17003',
	};

	export const Gallery = {
		FailChangeProperty: 'OSUI-API-18001',
		FailDispose: 'OSUI-API-18002',
		FailRegisterCallback: 'OSUI-API-18003',
	};

	export const Rating = {
		FailChangeProperty: 'OSUI-API-19001',
		FailDispose: 'OSUI-API-19002',
		FailRegisterCallback: 'OSUI-API-19003',
		FailEnable: 'OSUI-API-19004',
		FailDisable: 'OSUI-API-19005',
	};

	export const Search = {
		FailChangeProperty: 'OSUI-API-20001',
		FailDispose: 'OSUI-API-20002',
		FailRegisterCallback: 'OSUI-API-20003',
	};

	export const SectionIndexItem = {
		FailChangeProperty: 'OSUI-API-21001',
		FailDispose: 'OSUI-API-21002',
		FailRegisterCallback: 'OSUI-API-21003',
	};

	export const Tabs = {
		FailChangeProperty: 'OSUI-API-22001',
		FailDispose: 'OSUI-API-22002',
		FailRegisterCallback: 'OSUI-API-22003',
		FailSetActive: 'OSUI-API-22004',
		FailToggleSwipe: 'OSUI-API-22005',
	};

	export const TabsContentItem = {
		FailChangeProperty: 'OSUI-API-23001',
		FailDispose: 'OSUI-API-23002',
		FailRegisterCallback: 'OSUI-API-23003',
	};

	export const TabsHeaderItem = {
		FailChangeProperty: 'OSUI-API-24001',
		FailDisableTabHeader: 'OSUI-API-24002',
		FailDispose: 'OSUI-API-24003',
		FailEnableTabHeader: 'OSUI-API-24004',
		FailRegisterCallback: 'OSUI-API-24006',
		FailUpdate: 'OSUI-API-24005',
	};

	export const BottomSheet = {
		FailChangeProperty: 'OSUI-API-25001',
		FailDispose: 'OSUI-API-25002',
		FailRegisterCallback: 'OSUI-API-25003',
		FailOpen: 'OSUI-API-25004',
		FailClose: 'OSUI-API-25005',
	};

	export const TimePicker = {
		FailChangeProperty: 'OSUI-API-26001',
		FailClear: 'OSUI-API-26002',
		FailClose: 'OSUI-API-26003',
		FailDispose: 'OSUI-API-26004',
		FailOpen: 'OSUI-API-26005',
		FailRedraw: 'OSUI-API-26006',
		FailRegisterCallback: 'OSUI-API-26007',
		FailRegisterProviderConfig: 'OSUI-API-26008',
		FailRegisterProviderEvent: 'OSUI-API-26009',
		FailRemoveProviderEvent: 'OSUI-API-26010',
		FailToggleNativeBehavior: 'OSUI-API-26011',
		FailSetLanguage: 'OSUI-API-26012',
		FailUpdateInitialTime: 'OSUI-API-26013',
		FailSetEditableInput: 'OSUI-API-26014',
		FailUpdatePrompt: 'OSUI-API-26015',
		FailOnRender: 'OSUI-API-26016',
	};

	export const MonthPicker = {
		FailChangeProperty: 'OSUI-API-27001',
		FailClear: 'OSUI-API-27002',
		FailClose: 'OSUI-API-27003',
		FailDispose: 'OSUI-API-27004',
		FailOpen: 'OSUI-API-27005',
		FailRedraw: 'OSUI-API-27006',
		FailRegisterCallback: 'OSUI-API-27007',
		FailRegisterProviderConfig: 'OSUI-API-27008',
		FailRegisterProviderEvent: 'OSUI-API-27009',
		FailRemoveProviderEvent: 'OSUI-API-27010',
		FailSetEditableInput: 'OSUI-API-27011',
		FailSetLanguage: 'OSUI-API-27012',
		FailUpdateInitialMonth: 'OSUI-API-27013',
		FailUpdatePrompt: 'OSUI-API-27014',
		FailOnRender: 'OSUI-API-27015',
	};

	//Error codes used on the context of the Utilities client actions
	export const Utilities = {
		FailGetInvalidInput: 'OSUI-API-28001',
		FailScrollToElement: 'OSUI-API-28002',
		FailSetFocus: 'OSUI-API-28003',
		FailAddFavicon: 'OSUI-API-28004',
		FailMoveElement: 'OSUI-API-28005',
		FailSetActiveElement: 'OSUI-API-28006',
		FailSetSelectedRow: 'OSUI-API-28007',
		FailShowPassword: 'OSUI-API-28008',
		FailMasterDetailSetContentFocus: 'OSUI-API-28009',
		FailSetAccessibilityRole: 'OSUI-API-28010',
		FailSetAriaHidden: 'OSUI-API-28011',
		FailSetLang: 'OSUI-API-28012',
		FailSkipToContent: 'OSUI-API-28013',
		FailToggleTextSpacing: 'OSUI-API-28014',
		FailSetActiveMenuItems: 'OSUI-API-28015',
		FailSetBottomBarActiveElement: 'OSUI-API-28016',
		FailSetMenuAttributes: 'OSUI-API-28017',
		FailSetMenuIcon: 'OSUI-API-28018',
		FailSetMenuIconListeners: 'OSUI-API-28019',
		FailSetMenuListeners: 'OSUI-API-28020',
		FailToggleSideMenu: 'OSUI-API-28021',
		FailListItemAnimate: 'OSUI-API-28022',
		FailCheckIsMenuDraggable: 'OSUI-API-28023',
		FailSetExtendedMenuHide: 'OSUI-API-28024',
		FailSetExtendedMenuShow: 'OSUI-API-28025',
		FailCheckIsRTL: 'OSUI-API-28026',
	};

	export const InlineSvg = {
		FailChangeProperty: 'OSUI-API-29001',
		FailDispose: 'OSUI-API-29002',
		FailRegisterCallback: 'OSUI-API-29003',
	};

	export const OverflowMenu = {
		FailChangeProperty: 'OSUI-API-30001',
		FailDispose: 'OSUI-API-30002',
		FailRegisterCallback: 'OSUI-API-30003',
		FailOpen: 'OSUI-API-30004',
		FailClose: 'OSUI-API-30005',
		FailEnable: 'OSUI-API-30006',
		FailDisable: 'OSUI-API-30007',
	};

	export const Video = {
		FailChangeProperty: 'OSUI-API-31001',
		FailDispose: 'OSUI-API-31002',
		FailRegisterCallback: 'OSUI-API-31003',
		FailGetState: 'OSUI-API-31004',
		FailPause: 'OSUI-API-31005',
		FailPlay: 'OSUI-API-31006',
		FailSetTime: 'OSUI-API-31007',
	};

	// Error Codes used in Legacy Client Action
	export const Legacy = {
		FailAddFavicon_Legacy: 'OSUI-LEG-000001',
		MoveElement_Legacy: 'OSUI-LEG-000002',
		MasterDetailSetContentFocus_Legacy: 'OSUI-LEG-000003',
		SetAccessibilityRole_Legacy: 'OSUI-LEG-000004',
		SetAriaHidden_Legacy: 'OSUI-LEG-000005',
		SetFocus_Legacy: 'OSUI-LEG-000006',
		SetLang_Legacy: 'OSUI-LEG-000007',
		SkipToContent_Legacy: 'OSUI-LEG-000008',
		ToggleTextSpacing_Legacy: 'OSUI-LEG-000009',
	};
}
