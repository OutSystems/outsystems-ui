var toggleId;
var indexArray = [];
var insideBottomBar;
var bottomBar = document.querySelector('.active-screen .bottom-bar');
var floatingActions = document.getElementById($parameters.FloatingId);
var floatingActionsButton = floatingActions.querySelector('.floating-button');
var floatingActionsItems = floatingActions.querySelector('.floating-items');
var floatingActionsItem = floatingActionsItems.querySelectorAll('.floating-actions-item');
var firstButton = floatingActionsItem[0];
var lastButton = floatingActionsItem[floatingActionsItem.length - 1];

var setFocusTrap = function (e) {
	if (floatingActionsItem.length > 0) {
		var isShiftKey = e.shiftKey;

		// Focus trap to circle all buttons inside
		if (isShiftKey) {
			if (document.activeElement === firstButton) {
				lastButton.focus();
				e.preventDefault();
			}
		} else if (document.activeElement === lastButton) {
			firstButton.focus();
			e.preventDefault();
		}
	}
};

// Check if there are FloatingActionsItems
if (floatingActionsItem.length > 0) {
	// Push every floating-item index into a empty array
	for (var i = 0; i < floatingActionsItem.length; i++) {
		indexArray.push(i);
	}

	// reverse order of array for css animation
	indexArray.reverse();

	// set var --delay on style with each items index, to perform sequential css animation
	for (var i = 0; i < floatingActionsItem.length; i++) {
		floatingActionsItem[i].setAttribute('style', '--delay: ' + (indexArray[i] + 1));
	}
}

// Set keyboard interaction - Accessibility
var onButtonKeypress = function (e) {
	//If esc, Close Items
	if (e.keyCode == '27' && floatingActions.classList.contains('is--open')) {
		$actions.ToggleClick();
	}

	//If enter or space toggle Items
	if (e.keyCode == '32' || e.keyCode == '13') {
		$actions.ToggleClick();
	}

	setFocusTrap(e);
};

if ($parameters.IsHover) {
	if ($parameters.IsExpanded) {
		floatingActions.addEventListener('mouseleave', $actions.ToggleClick);
	} else {
		floatingActionsButton.addEventListener('mouseenter', $actions.ToggleClick);
	}

	floatingActionsButton.addEventListener('focus', $actions.ToggleClick);
} else {
	floatingActionsButton.addEventListener('click', $actions.ToggleClick);
	floatingActionsButton.addEventListener('keydown', onButtonKeypress);
}

// Exception for clicking Esc on items wrapper
floatingActionsItems.addEventListener('keydown', function (e) {
	if (e.keyCode == '27') {
		if ($parameters.IsHover) {
			floatingActionsButton.removeEventListener('focus', $actions.ToggleClick);
		}

		$actions.ToggleClick();

		if ($parameters.IsHover) {
			floatingActionsButton.addEventListener('focus', $actions.ToggleClick);
		}
	}

	setFocusTrap(e);
});

// Inside Bottom Bar and IOS fix
if (bottomBar && floatingActions) {
	insideBottomBar = bottomBar.contains(floatingActions);
}

if (!insideBottomBar && floatingActions) {
	var layout = document.querySelector('.layout');

	if (layout) {
		var nativeLayout = layout.classList.contains('layout-native');

		if (nativeLayout) {
			// new native layouts
			$actions.MoveElement($parameters.FloatingId, '.active-screen .main');
		} else {
			// Old native layouts
			$actions.MoveElement($parameters.FloatingId, '.active-screen .screen');
		}
	}

	if (bottomBar) {
		$parameters.IsInsideBottomBar = true;
	}
}
