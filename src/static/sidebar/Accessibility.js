var sidebar = document.getElementById($parameters.WidgetId);
var focusableEls = sidebar.querySelectorAll(
	'a[href]:not([disabled]),[tabindex="0"], button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]),input[type="submit"]:not([disabled]), select:not([disabled])'
);
var firstFocusableEl = focusableEls[0];
var lastFocusableEl = focusableEls[focusableEls.length - 1];
var keycodeTab = 9;
var keycodeEscape = 27;

var onSidebarKeypress = function (e) {
	var isTabPressed = e.key === 'Tab' || e.keyCode === keycodeTab;
	var isEscapedPressed = e.key === 'Escape' || e.keyCode === keycodeEscape;

	if (!isTabPressed && !isEscapedPressed) {
		return;
	}

	if (e.keyCode === keycodeEscape && sidebar.classList.contains('sidebar-open')) {
		$actions.OnParametersChanged();
		sidebar.removeEventListener('keydown', onSidebarKeypress);
	}

	if (e.shiftKey) {
		/* shift + tab */ if (document.activeElement === firstFocusableEl) {
			lastFocusableEl.focus();
			e.preventDefault();
		}
	} else if (document.activeElement === lastFocusableEl) {
		firstFocusableEl.focus();
		e.preventDefault();
	}
};

sidebar.addEventListener('keydown', onSidebarKeypress);

focusableEls = [].slice.call(focusableEls);

// Toggle tabindex value if Sidebar is closed or open
if (sidebar.classList.contains('sidebar-open')) {
	// apply tabindex = -1 by default to disable the navigation inside the sidebar when is hidden
	focusableEls.forEach(function (item) {
		item.setAttribute('tabindex', '0');
	});
} else {
	focusableEls.forEach(function (item) {
		item.setAttribute('tabindex', '-1');
	});
}
