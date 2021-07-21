// Elements
var actionSheet = document.getElementById($parameters.WidgetId);
var cancelButton = document.getElementById($parameters.CancelButtonId);
var buttons = actionSheet.getElementsByTagName('BUTTON');
var firstButton = buttons[0];

// get event from eventListener
var e = $parameters.Event;

// Keycodes
var isTabPressed = e.keyCode == '9';
var isShiftKey = e.shiftKey;
var isEsc = e.keyCode == '27';

var setFocusTrap = (function () {
	// Close on Esc
	if (isEsc) {
		$actions.OnCancelClick();
	}

	if (!isTabPressed) {
		return;
	}

	// Focus trap to circle all buttons inside
	if (isShiftKey) {
		if (document.activeElement === firstButton) {
			cancelButton.focus();
			e.preventDefault();
		}
	} else if (document.activeElement === cancelButton) {
		firstButton.focus();
		e.preventDefault();
	}
})();
