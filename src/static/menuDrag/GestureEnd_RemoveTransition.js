var menu = document.querySelector('.layout');
var appMenu = document.querySelector('.app-menu-content');
var menuBackground = document.querySelector('.app-menu-overlay');

menu.classList.remove('no-transition');
appMenu.classList.remove('no-transition');

if (menuBackground) {
	menuBackground.classList.remove('no-transition');
}
