var value = $parameters.Value;
var totalPages = $parameters.TotalPages;
var keyPressed = 13; // enter-key

var checkValue = function () {
	if (value > 0 && value <= totalPages) {
		// Go to Selected Page
		value = (value - 1) * $parameters.MaxRecords;
	} else if (value > totalPages) {
		// Go to Last Page
		value = totalPages * $parameters.MaxRecords;
	} else {
		// Go to First page
		value = 0;
	}
};

var inputOnKeypress = function (e) {
	if (e.keyCode === keyPressed) {
		value = $parameters.Value;
		checkValue();
		$actions.GoTo(value);
		return value;
	}
};

if (!$parameters.IsBlur) {
	this.addEventListener('keydown', inputOnKeypress);
} else {
	checkValue();
	$actions.GoTo(value);
	return value;
}

$parameters.GotoValue = value;
