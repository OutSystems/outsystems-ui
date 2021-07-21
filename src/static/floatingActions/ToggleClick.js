var floatingActions = document.getElementById($parameters.FloatingId);
var floatingActionsButton = floatingActions.querySelector('.floating-button');
var floatingActionsItems = floatingActions.querySelector('.floating-items');
var firstItem;

// Accessibility SetTabIndex values
var setTabIndex = function (value) {
	var tabIndexItems = floatingActionsItems.querySelectorAll('.floating-actions-item');
	tabIndexItems = [].slice.call(tabIndexItems);
	tabIndexItems.forEach(function (item) {
		item.setAttribute('tabindex', value);
	});
};

// Toggle Attributes and focus
if ($parameters.IsOpen) {
	setTabIndex('0');
	firstItem = floatingActionsItems.querySelector('.floating-actions-item');

	if (firstItem) {
		firstItem.focus();
	}
} else {
	floatingActionsButton.focus();
	setTabIndex('-1');
}

if ($parameters.IsHover) {
	floatingActionsButton.removeEventListener('focus', $actions.ToggleClick);

	//Handle event listeners
	if ($parameters.IsOpen) {
		floatingActionsButton.removeEventListener('mouseenter', $actions.ToggleClick);
		floatingActions.addEventListener('mouseleave', $actions.ToggleClick);
	} else {
		floatingActionsButton.addEventListener('mouseenter', $actions.ToggleClick);
		floatingActions.removeEventListener('mouseleave', $actions.ToggleClick);
		floatingActionsButton.addEventListener('focus', $actions.ToggleClick);
	}
}
