var choices;
var listItemsList;
var selectedList;
var listItemsListParam = JSON.parse($parameters.ListItemsList);
var elementId = document.getElementById($parameters.WidgetId);
var str = String($parameters.AdvancedFormat);
var isRTL = $parameters.IsRTL;
var selected =
	$parameters.SelectedList.length > 0 ? JSON.parse($parameters.SelectedList) : $parameters.SelectedPosition;

// Main function to init choices
var init = function () {
	// Map list keys to 'value' and 'label', as expected by the library
	listItemsList = listItemsListParam.map(function (obj) {
		var Value = Object.keys(obj)[0];
		var Label = Object.keys(obj)[1];
		return { value: obj.Value, label: obj.Text };
	});

	if (selected !== -1) {
		if (selected !== $parameters.SelectedPosition) {
			for (var i = 0; i < selected.length; i++) {
				if (selected[i] !== '-1') {
					listItemsList[selected[i]].selected = true;
				}
			}
		} else {
			listItemsList[$parameters.SelectedPosition].selected = true;
		}
	}

	// Set options
	var options = {
		choices: listItemsList,
		removeItemButton: $parameters.IsRemoveItems,
		itemSelectText: '',
		placeholderValue: $parameters.EmptyValue,
		noResultsText: $parameters.noResultsText,
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

	choices = new Choices(elementId, options);
	$parameters.ChoicesObj = choices;

	// Add title do inputs
	choices.input.element.setAttribute('title', $parameters.EmptyValue);
	elementId.setAttribute('title', 'Select Item');

	// Set Disabled status
	if ($parameters.IsDisabled) {
		choices.disable();
	} else if (!$parameters.IsDisabled && $parameters.IsUpdate) {
		choices.enable();
	}

	// Set rtl attributes
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

	// Creates div around search input
	createEl('.choices__input--cloned', 'div', 'search--wrapper');

	$parameters.ChoicesObj.passedElement.element.addEventListener('change', $actions.GetCurrentList);
};

var getCurrentList = function () {
	hasEvent = true;
	var currentValue = $parameters.ChoicesObj.getValue();

	// Map selected keys to 'Value' and 'tEXT', as expected by OS DropdownItem Structure
	selectedList = currentValue.map(function (obj) {
		var value = Object.keys(obj)[0];
		var label = Object.keys(obj)[1];
		return { Value: obj.value, Text: obj.label };
	});

	$actions.OnChangeListener(JSON.stringify(selectedList));
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

var isEmpty = function (str) {
	return !str || 0 === str.length;
};

// Function to create div around search input (necessary for css search icon)
var createEl = function (query, tag, className, innerHTML) {
	var queryList = document.querySelectorAll(query);

	for (var i = 0; i < queryList.length; i++) {
		var elem = queryList[i];
		var wrapper = document.createElement(tag);
		if (!isEmpty(innerHTML)) {
			wrapper.innerHTML = innerHTML;
		}

		if (!closestFn(elem, className)) {
			elem.parentElement.insertBefore(wrapper, elem);
			wrapper.appendChild(elem);
			wrapper.classList.add(className);
		}
	}
};

// AdvancedFormat function
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
