var activeScreen = document.querySelector('.screen-container.active-screen');
var rating = activeScreen.querySelector('#' + $parameters.WidgetId);

if (rating) {
	var fieldset = rating.querySelector('#' + $parameters.FieldsetId);

	rating.removeEventListener('click', $actions.OnClick);

	if ($parameters.IsUpdate) {
		fieldset.innerHTML = '';
	}
}
