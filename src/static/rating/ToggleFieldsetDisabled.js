var activeScreen = document.querySelector('.screen-container.active-screen');
var rating =
	activeScreen.querySelector('#' + $parameters.WidgetId) || document.querySelector('#' + $parameters.WidgetId);
var fieldset = rating.querySelector('#' + $parameters.FieldsetId);

if (!$parameters.IsEdit) {
	fieldset.setAttribute('disabled', true);
} else if ($parameters.IsEdit && fieldset.disabled === true) {
	fieldset.removeAttribute('disabled');
}
