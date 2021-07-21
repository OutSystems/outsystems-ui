var widget = document.getElementById($parameters.WidgetId);

var checkIfIsInteger = function (value) {
	var x;
	if (isNaN(value)) {
		return false;
	}
	x = parseFloat(value);
	return (x | 0) === x;
};

// If is integer we will add 'px' to the variable
var height = checkIfIsInteger($parameters.Height) ? $parameters.Height + 'px' : $parameters.Height;
var width = checkIfIsInteger($parameters.Width) ? $parameters.Width + 'px' : $parameters.Width;

/* Set classes */
if ($parameters.Width !== '' || typeof $parameters.Width != 'undefined') {
	widget.style.setProperty('--scrollable-area-width', width);
}

if ($parameters.Height !== '' || typeof $parameters.Height != 'undefined') {
	widget.style.setProperty('--scrollable-area-height', height);
}
