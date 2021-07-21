var clickedItem = $parameters.event.target;

if (clickedItem.getAttribute('focusItemId')) {
	document.getElementById(clickedItem.getAttribute('focusItemId')).focus();
}
