var str = String($parameters.AdvancedFormat);
var paramList = JSON.parse($parameters.ItemList);
var elementId = document.getElementById($parameters.WidgetId);
var isRTL = $parameters.IsRTL;
var isDisabled = $parameters.IsDisabled;
var showEmptySelected = true;
var choices;
var itemList = [];

// Map paramList to a new one, as the library only supports 'value' and 'label'
for (var i = 0; i < paramList.length; i++) {
	itemList.push({ value: paramList[i].Value, label: paramList[i].Text });
}

// Function to set the options and parameters and init the Choices
var init = function () {
	// Validate if SelectedItem is set
	if ($parameters.SelectedPosition >= 0) {
		itemList[$parameters.SelectedPosition].selected = true;
		showEmptySelected = false;
	}

	// Set default options
	var options = {
		choices: itemList,
		itemSelectText: '',
		noResultsText: $parameters.noResultsText,
		searchPlaceholderValue: $parameters.searchPlaceholderValue,
		classNames: { containerOuter: 'choices ' + $parameters.ExtendedClass },
		fuseOptions: {
			includeMatches: true,
			threshold: 0.2,
			location: 0,
			distance: 100,
			maxPatternLength: 32,
			minMatchCharLength: 1,
		},
	};

	if (str.length > 0) {
		var json = JSON.stringify(eval('(' + str + ')'));
		options = mergeJSON(options, JSON.parse(json));
	}

	// Create choices
	choices = new Choices(elementId, options);

	// Add placeholder only if not using selectedItem and EmptyValue isn't empty
	if ($parameters.EmptyValue !== '') {
		choices.setChoices(
			[
				{
					value: $parameters.NullValue,
					label: $parameters.EmptyValue,
					selected: showEmptySelected,
					disabled: false,
					placeholder: true,
				},
			],
			'value',
			'label',
			false
		);
	}

	// Assign choices object to output, to be able to destroy it OnDestroy
	$parameters.ChoicesObj = choices;

	// Creates div around search input
	createEl('.choices__input--cloned', 'div', 'search--wrapper');

	// Add title do inputs
	choices.input.element.setAttribute('title', $parameters.searchPlaceholderValue);
	elementId.setAttribute('title', 'Select options');

	// Set Disabled status
	if (isDisabled) {
		choices.disable();
	} else {
		choices.enable();
	}

	// Set rtl attributes
	if (isRTL) {
		choices.direction = 'rtl';
		choices.containerOuter.element.setAttribute('dir', 'rtl');
		choices.choiceList.element.setAttribute('dir', 'rtl');
	} else {
		choices.direction = 'ltr';
		choices.containerOuter.element.setAttribute('dir', 'ltr');
		choices.choiceList.element.setAttribute('dir', 'ltr');
	}

	// Add change listener on opening Dropdown, to pass set IsSelecting to true
	choices.passedElement.element.addEventListener('showDropdown', function (event) {
		$actions.OnShowDropdown();
	});

	// Add change listener on closing Dropdown, to pass set IsSelecting to false
	choices.passedElement.element.addEventListener('hideDropdown', function (event) {
		$actions.OnHideDropdown();
	});

	// Add change listener on input, to pass currentValue to event
	choices.passedElement.element.addEventListener('choice', $actions.GetValueOnSelect);
};

// Recursive Function for closest()
var closestFn = function (element, classToSearch) {
	if (element && element.classList.contains(classToSearch)) {
		return element;
	} else if (!element || (element && element.classList.contains('layout'))) {
		return false;
	} else {
		return closestFn(element.parentElement, classToSearch);
	}
};

// Function to create div around search input (necessary for css search icon)
var createEl = function (query, tag, className) {
	var queryList = document.querySelectorAll(query);

	for (var i = 0; i < queryList.length; i++) {
		var elem = queryList[i];
		var wrapper = document.createElement(tag);

		if (!closestFn(elem, className)) {
			elem.parentElement.insertBefore(wrapper, elem);
			wrapper.appendChild(elem);
			wrapper.classList.add(className);
		}
	}
};

// AdvancedFormat
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

// Call init
init();
