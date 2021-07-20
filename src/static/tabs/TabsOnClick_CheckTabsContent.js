var tab = document.getElementById($parameters.TabsId);
var contentTabs = tab.querySelector('.tabs-content');
var tabsInsidePopup = document.body.querySelector('.popup-dialog .popup-content .tabs');

//Check the tabs wrapper has the context content of the actual tab
var newTabContent = Array.prototype.filter.call(
	contentTabs.querySelectorAll("[data-tab = '" + $parameters.TabNumber + "']"),
	function (el) {
		return el.closest('.tabs') === tab;
	}
);

if (newTabContent[0]) {
	$parameters.HasContentTab = true;
}

// Check if tabs are inside a popup
if (tabsInsidePopup) {
	$parameters.TabsInsidePopup = true;
} else {
	$parameters.TabsInsidePopup = false;
}
