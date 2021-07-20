var isRTL = document.querySelector('.is-rtl');
var element = document.getElementById($parameters.Id).parentElement;
var tabOverlay = element.querySelector('.tabs-overlay');
var countTabs = element.querySelectorAll('.tabs-header-tab').length - 1;
var tabsElement = element.querySelectorAll('.tabs-header-tab');
var countEmptyTabs = element.querySelectorAll('.tabs-header-tab.ph');
var isEmpty = 0;

for (i = 0; i < tabsElement.length; i++) {
	if (countEmptyTabs[i].childNodes.length === 0) {
		isEmpty = isEmpty + 1;
	}
}

setTimeout(function () {
	if ($parameters.ActiveTab == countTabs - isEmpty) {
		if (isRTL) {
			if (tabOverlay.classList.contains('left')) {
				tabOverlay.classList.remove('left');
			}
		} else {
			if (tabOverlay.classList.contains('right')) {
				tabOverlay.classList.remove('right');
			}
		}
	} else {
		if (isRTL) {
			if (!tabOverlay.classList.contains('left')) {
				tabOverlay.classList.add('left');
			}
		} else {
			if (!tabOverlay.classList.contains('right')) {
				tabOverlay.classList.add('right');
			}
		}
	}
}, 0);
