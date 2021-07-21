var subMenu = document.getElementById($parameters.WidgetId);
var subMenuHeader = document.getElementById($parameters.HeaderId);
var subMenuItem = subMenuHeader.querySelector('.submenu-item');
var items = subMenu.querySelector('.submenu-items');
var SubMenuLinks = subMenu.getElementsByTagName('a');
var subMenuItems = items.getElementsByTagName('a');
var isDesktop = document.body.classList.contains('desktop');
var triggerElement = subMenuItem.firstChild;
var isTriggerLink = triggerElement.tagName === 'A';
$parameters.HasItems = subMenuItems.length > 0;

// add accessibility - - - - - - - - - - - - - - - - - - - - -
subMenu.addEventListener('keydown', function (e) {
	if (!subMenu.classList.contains('open')) {
		return;
	}
	if (e.keyCode === 27 || e.key === 'Escape') {
		e.preventDefault();
		e.stopPropagation();
		subMenuHeader.focus();
		$actions.CloseMenu();
	}
});
// add accessibility - - - - - - - - - - - - - - - - - - - - -

// Check if subItem has links. If true, means it's a dropdown
if (items.childElementCount > 0) {
	subMenu.classList.add('is--dropdown');

	// add accessibility - - - - - - - - - - - - - - - - - - - - -
	if (isTriggerLink) {
		triggerElement.setAttribute('tabindex', '-1');
	}

	subMenuHeader.addEventListener('keyup', function (e) {
		if (e.keyCode === 13 || e.keyCode === 32) {
			e.preventDefault();
			e.stopPropagation();
			$actions.OnMenuClick();
		}
	});
	// add accessibility - - - - - - - - - - - - - - - - - - - - -

	// Add Click Action here, to be able to use stopPropagation
	subMenuHeader.addEventListener('click', function (e) {
		e.preventDefault();
		e.stopPropagation();
		$actions.OnMenuClick();
	});
}

// Add active class to SubMenu, if there's a link with active class
for (var i = 0; i < SubMenuLinks.length; i++) {
	if (SubMenuLinks[i].classList.contains('active')) {
		subMenu.classList.add('active');
	}
}
