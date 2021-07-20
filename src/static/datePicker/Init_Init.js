var field = document.getElementById($parameters.InputWidgetid);
var str = String($parameters.AdvancedFormat);
var isValid = isFormatValid($parameters.Format);
var fieldType = $parameters.FieldType;
var initialDate = $parameters.InitialDate;
var defaultFormat = $parameters.ShowTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD';
var layout = document.querySelector('.layout');
var isRTL = document.querySelector('.is-rtl');
var hasAccessibility;

// Check if layout has accessibilty class
if (layout) {
	hasAccessibility = layout.classList.contains('has-accessible-features');
}

// Check if Dateformat is used or if input is of type text, otherwise use server format
var dateFormat =
	$parameters.Format.length === 0 || fieldType !== 'text'
		? isValid
			? $parameters.Format
			: defaultFormat
		: $parameters.Format;

if (field && fieldType !== 'text') {
	field.type = 'text';
}

// Convert the parameters to an array of strings
$parameters.TranslateMonths = $parameters.TranslateMonths.split(',');
$parameters.TranslateWeekdays = $parameters.TranslateWeekdays.split(',');
$parameters.TranslateWeekdaysShort = $parameters.TranslateWeekdaysShort.split(',');
$parameters.TranslateShortcutsDialog = $parameters.TranslateShortcutsDialog.split(',');

// Set Library options
var options = {
	field: document.getElementById($parameters.InputWidgetid),

	trigger: document.getElementById($parameters.ButtonWidgetId),

	container: document.getElementById($parameters.CalendarId),

	bound: $parameters.IsBound,

	format: dateFormat,

	events: $parameters.Events,

	minDate: $parameters.MinDate,

	maxDate: $parameters.MaxDate,

	defaultDate: initialDate,

	setDefaultDate: true,

	showDaysInNextAndPreviousMonths: true,

	showWeekNumber: $parameters.ShowWeekNumbers,

	firstDay: $parameters.FirstDay,

	showTime: $parameters.ShowTime,

	use24hour: $parameters.Show24HourFormat,

	showTodayButton: $parameters.showTodayButton,

	isInterval: $parameters.selectInterval,

	// Apply RTL by default on Datepicker, if class is-rtl are applied
	hasRTL: isRTL ? true : false,

	calendarPosition: isRTL ? 'bottom right' : 'bottom left',

	// i18n translations
	translationsPreviousMonth: $parameters.TranslatePreviousMonth,

	translationsNextMonth: $parameters.TranslateNextMonth,

	translationsMonths: $parameters.TranslateMonths,

	translationsWeekdays: $parameters.TranslateWeekdays,

	translationsWeekdaysShort: $parameters.TranslateWeekdaysShort,

	translationsMidnight: $parameters.TranslateMidnight,

	translationsNoon: $parameters.TranslateNoon,

	translationsTodayButton: $parameters.TranslateTodayButton,

	// i18n Accessibility translations
	translationsCalendar: $parameters.TranslateCalendar,

	translationsCalendarDates: $parameters.TranslateCalendarDates,

	translationsCloseCalendar: $parameters.TranslateCloseCalendar,

	translationsDateSelected: $parameters.TranslateDateSelected,

	translationsDaySelected: $parameters.TranslateDaySelected,

	translationsDaysInRange: $parameters.TranslateDaysInRange,

	translationsDialogButton: $parameters.TranslateDialogButton,

	translationsEndRange: $parameters.TranslateEndRange,

	translationsEnterCalendar: $parameters.TranslateEnterCalendar,

	translationsGoToToday: $parameters.TranslateGoToToday,

	translationseHasEvent: $parameters.TranslateHasEvent,

	translationsIsDisabled: $parameters.TranslateIsDisabled,

	translationsIsToday: $parameters.TranslateIsToday,

	translationsKeyboardShortcuts: $parameters.TranslateKeyboardShortcuts,

	translationsMonth: $parameters.TranslateMonth,

	translationsNavigation: $parameters.TranslateNavigation,

	translationsMonthNext: $parameters.TranslateMonthNext,

	translationsMonthPrevious: $parameters.TranslateMonthPrevious,

	translationsOpenCalendar: $parameters.TranslateOpenCalendar,

	translationsStartRange: $parameters.TranslateStartRange,

	translationsYear: $parameters.TranslateYear,

	translationsShortcutsDialog: $parameters.TranslateShortcutsDialog,

	disableDayFn: function (d) {
		disabledDay = $parameters.DisabledDates.indexOf(d.toDateString()) !== -1 ? true : false;
		disabledWeekDay = $parameters.DisabledWeekDays.indexOf(d.getDay()) !== -1 ? true : false;

		if (disabledDay || disabledWeekDay) {
			return true;
		}
	},

	onSelect: function (d) {
		$actions.SelectDate(d);
	},
};

// Set AdvancedFomrmat
if (str.length > 0) {
	var json = JSON.stringify(eval('(' + str + ')'));
	options = mergeJSON(options, JSON.parse(json));

	// Check if container is defined
	if (options.hasOwnProperty('container')) {
		options.container = eval(options.container);
	}
}

if (options.disableInputOverride === true) {
	$parameters.disableInputOverride = true;
}

$parameters.CalendarObj = new Pikaday(options);

if ($parameters.IsBound && hasAccessibility) {
	$parameters.CalendarObj.el.classList.add('has-accessible-features');
}

if (field) {
	field.clearDate = function () {
		$parameters.CalendarObj.clear();
	};

	field.addEventListener('input', $actions.CheckFieldValue);

	field.value = $parameters.StartEmpty ? '' : moment(new Date(initialDate)).format(dateFormat);

	// Check for not-valid class after form validation to make sure the current value and dateFormat is maintained
	var observer = new MutationObserver(function (event) {
		$actions.CheckValueOnFormValidation(dateFormat);
	});

	observer.observe(field, {
		attributes: true,
		attributeFilter: ['class'],
		childList: false,
		characterData: false,
	});
}

function mergeJSON(target, add) {
	function isObject(obj) {
		if (typeof obj == 'object') {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					return true; // search for first object prop
				}
			}
		}
		return false;
	}
	for (var key in add) {
		if (add.hasOwnProperty(key)) {
			if (target[key] && isObject(target[key]) && isObject(add[key])) {
				mergeJSON(target[key], add[key]);
			} else {
				target[key] = add[key];
			}
		}
	}
	return target;
}

function isFormatValid(format) {
	var isFormatValid;
	switch (format) {
		case 'YYYY-MM-DDTHH:mm:ss.sssZ':
		case 'YYYY-MM-DD HH:mm:ss':
		case 'YYYY/MM/DD HH:mm:ss':
		case 'YYYY.MM.DD HH:mm:ss':
		case 'YYYY.MM.DD':
		case 'YYYY/MM/DD':
		case 'YYYY-MM-DD':
			isFormatValid = true;
			break;
		default:
			isFormatValid = false;
	}

	return isFormatValid;
}
