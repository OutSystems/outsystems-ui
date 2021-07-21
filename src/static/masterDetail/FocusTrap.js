// Elements
var rightElem = document.getElementById($parameters.RightPanelId);
var closeButton = document.getElementById($parameters.CloseButtonId);
var focusableEls = rightElem.querySelectorAll(
	'a[href]:not([disabled]),[tabindex="0"], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]),input[type="submit"]:not([disabled]), select:not([disabled])'
);
var firstFocusableEl = closeButton;
var lastFocusableEl = focusableEls[focusableEls.length - 1];

// get event from eventListener
var e = $parameters.Event;

// Keycodes
var isTabPressed = e.keyCode == '9';
var isShiftKey = e.shiftKey;
var isEsc = e.keyCode == '27';

var setFocusTrap = (function () {
	// Close on Esc
	if (isEsc) {
		$actions.OnDetailClose();
	}

	if (!isTabPressed) {
		return;
	}

	// Focus trap to circle all buttons inside
	if (isShiftKey) {
		if (document.activeElement === firstFocusableEl) {
			lastFocusableEl.focus();
			e.preventDefault();
		}
	} else if (document.activeElement === lastFocusableEl) {
		firstFocusableEl.focus();
		e.preventDefault();
	}
})();
