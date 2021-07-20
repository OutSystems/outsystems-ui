$parameters.HasValue = false;

// Check if there is any input inside the placeholder and if so, checks if it is has value
var input = document.getElementById($parameters.WidgetId).querySelector('input');

if (input) {
	$parameters.HasValue = input.value !== '';
}
