var currentSubMenu = document.getElementById($parameters.SubmenuId);
currentSubMenu
	.querySelector('.submenu-header')
	.setAttribute('aria-expanded', $parameters.IsOpen === true ? 'true' : 'false');

// change the aria-hidden attrubute on the submenu-items content
var submenu_items = currentSubMenu.querySelector('.submenu-items');
submenu_items.setAttribute('aria-hidden', $parameters.IsOpen === true ? 'false' : 'true');
submenu_items.setAttribute('tabindex', $parameters.IsOpen === true ? '0' : '-1');

// change the tabindex value
var submenu_items_link = submenu_items.querySelectorAll('a');
submenu_items_link = [].slice.call(submenu_items_link);
submenu_items_link.forEach(function (item) {
	item.setAttribute('tabindex', $parameters.IsOpen === true ? '0' : '-1');
});
