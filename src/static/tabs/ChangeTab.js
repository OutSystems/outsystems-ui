var tab = document.getElementById($parameters.id);
var headerTabs = tab.querySelector('.tabs-header');
var contentTabs = tab.querySelector('.tabs-content');

//Check the tabs wrapper has the context content of the actual tab
var newTabHeader = Array.prototype.filter.call(
	headerTabs.querySelectorAll("[data-tab = '" + $parameters.ActiveTab + "']"),
	function (el) {
		return el.closest('.tabs') === tab;
	}
);

var newTabContent = Array.prototype.filter.call(
	contentTabs.querySelectorAll("[data-tab = '" + $parameters.ActiveTab + "']"),
	function (el) {
		return el.closest('.tabs') === tab;
	}
);

newTabHeader[0].classList.add('active');
newTabHeader[0].setAttribute('tabindex', '0');
newTabHeader[0].setAttribute('aria-selected', 'true');

if (newTabContent) {
	newTabContent[0].classList.add('open');
	newTabContent[0].setAttribute('tabindex', '0');
}
