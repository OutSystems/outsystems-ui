var menu = document.querySelector('.layout');

if (!$parameters.IsRTL) {
	if ($parameters.OffsetX < 0 || !$parameters.IsOpen) {
		close();
	}
} else {
	if ($parameters.OffsetX > 0 || !$parameters.IsOpen) {
		close();
	}
}

function close() {
	var appMenu = document.querySelector('.app-menu-content');
	var menuOverlay = document.querySelector('.app-menu-overlay');

	if (menuOverlay) {
		menuOverlay.style.opacity = '';
	}

	appMenu.style.transform = '';
	appMenu.style.webkitTransform = '';

	menu.classList.remove('menu-visible');

	menu.addEventListener('transitionend', OnTransitionEnd, false);
}

function OnTransitionEnd() {
	menu.removeEventListener('transitionend', OnTransitionEnd);
}
