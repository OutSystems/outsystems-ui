var floatingActions = document.getElementById($parameters.WidgetId);
var floatingActionsButton = floatingActions.querySelector('.floating-button');

if ($parameters.IsHover) {
	floatingActionsButton.removeEventListener('mouseleave', $actions.ToggleClick);
	floatingActions.removeEventListener('mouseleave', $actions.ToggleClick);
} else {
	floatingActionsButton.removeEventListener('click', $actions.ToggleClick);
}
