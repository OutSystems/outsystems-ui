//Focus on input inside placeholder only if no value is already there
var input = document.getElementById($parameters.WidgetId).querySelector('input');

if (input && input.value === '') {
	setTimeout(function () {
		input.focus();
	}, 300);
}
