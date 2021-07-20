if ($parameters.IsInterval) {
	$parameters.CalendarObj.setStartRange($parameters.CurrentStartDate);
	$parameters.CalendarObj.setEndRange($parameters.CurrentEndDate);
	$parameters.CalendarObj.draw();
}

if ($parameters.IsInputBounded && !$parameters.disableInputOverride) {
	var field = document.getElementById($parameters.InputWidgetid);
	var defaultFormat = $parameters.ShowTime ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD';
	var isValid = isFormatValid($parameters.Format);
	var fieldType = $parameters.FieldType;

	// Check if Dateformat is used or if input is of type text, otherwise use server format
	var dateFormat =
		$parameters.Format.length === 0 || fieldType !== 'text'
			? isValid
				? $parameters.Format
				: defaultFormat
			: $parameters.Format;

	// If StartEmpty, init date is empty, otherwise use a formatted one
	var formattedStartDate = moment(new Date($parameters.CurrentStartDate)).format(dateFormat);
	var formattedEndDate = moment(new Date($parameters.CurrentEndDate)).format(dateFormat);

	if (field) {
		field.value = $parameters.IsInterval
			? formattedStartDate + ($parameters.IsEndDateNull ? '' : ' - ' + formattedEndDate)
			: formattedStartDate;
	}
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
