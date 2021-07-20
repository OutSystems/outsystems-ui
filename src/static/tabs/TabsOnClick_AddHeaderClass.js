var tab = document.getElementById($parameters.TabsId);
var headerTabs = tab.querySelector('.tabs-header');

//Check the tabs wrapper has the context content of the actual tab
var newTabHeader = Array.prototype.filter.call(
	headerTabs.querySelectorAll("[data-tab = '" + $parameters.TabNumber + "']"),
	function (el) {
		return el.closest('.tabs') === tab;
	}
);

newTabHeader[0].classList.add('active');
