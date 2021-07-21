var layoutOpen = document.querySelector('.layout.menu-visible');
var menu = document.querySelector('.layout');
var appMenu = document.querySelector('.app-menu-content');
var isTablet = document.querySelector('body.tablet.landscape');
var isRTL = document.querySelector('.is-rtl');

var burgerIcon = document.querySelector('.app-menu-icon .menu-icon');
var backIcon = document.querySelector('.app-menu-icon.back .menu-back');

if (menu && appMenu) {
	if (!$parameters.BackExists) {
		appMenu.classList.add('no-transition');
	}

	if (layoutOpen !== null) {
		$parameters.IsOpen = true;
	}

	$parameters.MenuWidth = document.querySelector('.app-menu-content').offsetWidth;

	if (burgerIcon !== null && backIcon === null) {
		$parameters.isBurgerIconVisible = true;
	} else if (backIcon !== null) {
		$parameters.isBackIconVisible = true;
	} else if (burgerIcon === null && backIcon === null) {
		$parameters.IsMenuHidden = true;
	}

	if (isRTL) {
		$parameters.isRTL = true;
	}
}
