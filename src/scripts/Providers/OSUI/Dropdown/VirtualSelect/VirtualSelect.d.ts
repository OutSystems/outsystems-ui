// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Dropdown.VirtualSelect {
	// DropDown => Option type
	export type DropDownOption = {
		image_url_or_class: string;
		group_name?: string;
		description?: string;
		customData?: Any;
		label: string;
		value: string;
	};

	// DropDown => Grouped options type
	export type GroupDropDownOption = {
		label: string;
		options: DropDownOption[];
		index: number;
	};

	// VirtualSelect => Option Item, options type
	export type VirtualSelectOptionInfo = {
		alias: string;
		index: number;
		isGroupTitle: boolean;
		isGroupOption: boolean;
		groupIndex: number;
		isNew: boolean;
		isSelected: boolean;
		isVisible: boolean;
		label: string;
		value: string;
		visibleIndex: number;
	};

	// VirtualSelect => Library Methods type
	export type VirtualSelectMethods = {
		addOption: Function;
		close: Function;
		destroy: Function;
		getDisplayValue: Function;
		getNewValue: Function;
		getSelectedOptions: Function;
		setSelectedOptions: Function;
		hide: Function;
		isAllSelected: Function;
		open: Function;
		reset: Function;
		setDisabledOptions: Function;
		setOptions: Function;
		setValue: Function;
		show: Function;
		toggleSelectAll: Function;
	};

	// VirtualSelect => Library Options type
	export type VirtualSelectOpts = {
		additionalClasses?: string;
		aliasKey?: string;
		allOptionsSelectedText?: string;
		allowNewOption?: boolean;
		alwaysShowSelectedOptionsCount?: boolean;
		ariaLabelText?: string;
		autofocus?: boolean;
		autoSelectFirstOption?: boolean;
		clearButtonText?: string;
		descriptionKey?: string;
		disableAllOptionsSelectedText?: boolean;
		disabled?: boolean;
		disabledOptions?: [];
		disableOptionGroupCheckbox?: boolean;
		disableSelectAll?: boolean;
		dropboxWidth?: string;
		dropboxWrapper?: string;
		ele?: string | HTMLElement;
		enableSecureText?: boolean;
		hasOptionDescription?: boolean;
		hideClearButton?: boolean;
		hideValueTooltipOnSelectAll?: boolean;
		keepAlwaysOpen?: boolean;
		labelKey?: string;
		labelRenderer?: Function;
		markSearchResults?: boolean;
		maxValues?: number;
		moreText?: string;
		multiple?: boolean;
		name?: string;
		noOfDisplayValues?: number;
		noOptionsText?: string;
		noSearchResultsText?: string;
		onServerSearch?: Function;
		optionHeight?: string;
		options?: [];
		optionsCount?: number;
		optionSelectedText?: string;
		optionsSelectedText?: string;
		placeholder?: string;
		popupDropboxBreakpoint?: string;
		position?: string;
		search?: boolean;
		searchNormalize?: boolean;
		searchPlaceholderText?: string;
		selectAllOnlyVisible?: boolean;
		selectAllText?: string;
		selectedValue?: string | [];
		setValueAsArray?: boolean;
		showDropboxAsPopup?: boolean;
		showOptionsOnlyOnSearch?: boolean;
		showSelectedOptionsFirst?: boolean;
		showValueAsTags?: boolean;
		silentInitialValueSet?: boolean;
		textDirection?: string;
		tooltipAlignment?: string;
		tooltipFontSize?: string;
		tooltipMaxWidth?: string;
		updatePositionThrottle?: number;
		useGroupValue?: boolean;
		valueKey?: string;
		zIndex?: number;
	};
}
