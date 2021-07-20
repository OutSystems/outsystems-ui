var tab = document.getElementById($parameters.Id);
var headerTabs = tab.querySelector('.tabs-header');
var contentTabs = tab.querySelector('.tabs-content');

var tabHeader = Array.prototype.filter.call(
	headerTabs.querySelectorAll("[data-tab = '" + $parameters.activeTab + "']"),
	function (el) {
		return el.closest('.tabs') === tab;
	}
);

var tabContent = Array.prototype.filter.call(
	contentTabs.querySelectorAll("[data-tab = '" + $parameters.activeTab + "']"),
	function (el) {
		return el.closest('.tabs') === tab;
	}
);

if (tabHeader[0]) {
	tabHeader[0].classList.remove('active');
	tabHeader[0].setAttribute('tabindex', '-1');
	tabHeader[0].setAttribute('aria-selected', 'false');
}

if (tabContent[0]) {
	tabContent[0].classList.remove('open');
	tabContent[0].setAttribute('tabindex', '-1');
}
