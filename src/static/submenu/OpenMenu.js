var subItems = document.querySelectorAll('.submenu');
var currentSubMenu = document.getElementById($parameters.WidgetId);

var isOpen = function (currentSubItem) {
	if (currentSubItem.classList.contains('open')) {
		return true;
	}

	return false;
};

// On Click close all other open SubMenus
for (var i = 0; i < subItems.length; i++) {
	var subItemMenu = subItems[i];

	if (subItemMenu !== currentSubMenu && isOpen(subItemMenu)) {
		subItemMenu.CloseMenu();
	}
}

currentSubMenu.classList.add('open');
