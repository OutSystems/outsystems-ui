var currentValue = $parameters.ChoicesObj.getValue();

// Map selected keys to 'Value' and 'tEXT', as expected by OS DropdownItem Structure
selectedList = currentValue.map(function (obj) {
	var value = Object.keys(obj)[0];
	var label = Object.keys(obj)[1];
	return { Value: obj.value, Text: obj.label };
});

$actions.OnChangeListener(JSON.stringify(selectedList));
