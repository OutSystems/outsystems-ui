var buttonWrapper = document.getElementById($parameters.WidgetId);
var button = buttonWrapper.querySelector('button');

var onButtonKeypress = function (e) {
	if ((e.keyCode == '13' || e.keyCode == '32') && $parameters.IsLoading) {
		e.preventDefault();
	} else {
		button.removeEventListener('keydown', onButtonKeypress);
		return true;
	}
};

button.addEventListener('keydown', onButtonKeypress);
