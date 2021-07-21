var el = document.querySelector('.app-menu-content');

el.style.transform = '';
el.style.webkitTransform = '';

var menu = document.querySelector('.layout');

menu.classList.add('menu-visible');

var menuOverlay = document.querySelector('.app-menu-overlay');
if (menuOverlay) {
	menuOverlay.style.opacity = '';
}
