var activeScreen = document.querySelector('.screen-container.active-screen');
var rating =
	activeScreen.querySelector('#' + $parameters.WidgetId) || document.querySelector('#' + $parameters.WidgetId);
var fieldset = rating.querySelector('#' + $parameters.FieldsetId);
var iconStates =
	activeScreen.querySelector('#' + $parameters.IconStatesId) ||
	document.querySelector('#' + $parameters.IconStatesId);
var ratingScale = $parameters.RatingScale;
var ratingItems;
var clonedElement;
var index = 0;
var inputId;
var inputName = $parameters.WidgetId + '-rating';
var isEdit = $parameters.IsEdit ? null : 'disabled';

// Disable fieldset according to IsEdit parameter
$actions.ToggleFieldsetDisabled();

// Handle placeholders HTML kept on ClonedPlaceholders variable
if (!$parameters.IsUpdate) {
	$parameters.ClonedPlaceholders = iconStates.innerHTML;
	iconStates.remove();
} else {
	$parameters.ClonedPlaceholders = $parameters.OriginalClonedPlaceholders;
}

// Function to clone items
var createItems = function (index) {
	var htmlToClone =
		'<input ' +
		isEdit +
		' type="radio" class="rating-input wcag-hide-text" id="' +
		inputId +
		'" name="' +
		inputName +
		'" value="' +
		index +
		'" /><label class="' +
		(index === 0 ? 'rating-item wcag-hide-text' : 'rating-item') +
		'" for="' +
		inputId +
		'"><span class="wcag-hide-text">Rating ' +
		index +
		'</span>' +
		(index !== 0 ? $parameters.ClonedPlaceholders : '') +
		'</label>';
	fieldset.innerHTML += htmlToClone;
};

// Create items according to RatingScale
for (i = 0; i <= ratingScale; i++) {
	index = i;
	inputId = $parameters.WidgetId + '-rating-' + index;
	createItems(index);
}

//Add eventListener
if ($parameters.IsEdit) {
	rating.addEventListener('click', $actions.OnClick);
}

// Set initial rating
$actions.SetRatingValue();
