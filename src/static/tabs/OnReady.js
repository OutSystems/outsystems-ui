window.addEventListener('orientationchange', $actions.OnOrientationChange);
var tab = document.getElementById($parameters.Id);
var list = tab.querySelector('.tabs-header .list');

var init = function () {
	var headerTabs = tab.querySelector('.tabs-header');
	var contentTabs = tab.querySelector('.tabs-content');
	var tabsWithSectionGroup = tab.querySelector('.tabs-content .section-group.is--sticky');
	var tabNumber = 0;

	//Check if Tabs contains SectionGroup inside TabsContent
	if (tabsWithSectionGroup) {
		tab.classList.add('tabs-section-group');
	}

	//Check the tabs wrapper has the context content of the actual tab
	var tabsHeaderItems = Array.prototype.filter.call(tab.querySelectorAll('.tabs-header-tab'), function (el) {
		return el.closest('.tabs') === tab;
	});

	var tabsContentItems = Array.prototype.filter.call(tab.querySelectorAll('.tabs-content-tab'), function (el) {
		return el.closest('.tabs') === tab;
	});

	for (var i = 0; i < tabsHeaderItems.length; i++) {
		tabNumber = i;

		tabsHeaderItems[i].setAttribute('data-tab', tabNumber);
		tabsHeaderItems[i].setAttribute(
			'aria-label',
			'tab ' + (tabNumber + 1) + ', ' + (tabNumber + 1) + ' of ' + tabsHeaderItems.length
		);

		if (tabsContentItems[i] !== undefined) {
			tabsContentItems[i].setAttribute('data-tab', tabNumber);
			tabsContentItems[i].setAttribute('aria-labelledby', tabsHeaderItems[i].getAttribute('id'));
		}

		tabsHeaderItems[i].addEventListener('click', function (e) {
			$actions.TabsOnClick(parseFloat(e.currentTarget.dataset.tab));
		});
	}

	// add the event for the keydown
	headerTabs.addEventListener('keydown', onTabsKeypress);

	// Set startingTab of the closest tabs wrapper
	var startingHeader = Array.prototype.filter.call(
		headerTabs.querySelectorAll("[data-tab = '" + $parameters.ActiveTab + "']"),
		function (el) {
			return el.closest('.tabs') === tab;
		}
	);
	var staringContent = Array.prototype.filter.call(
		contentTabs.querySelectorAll("[data-tab = '" + $parameters.ActiveTab + "']"),
		function (el) {
			return el.closest('.tabs') === tab;
		}
	);

	startingHeader[0].classList.add('active');
	startingHeader[0].setAttribute('aria-selected', 'true');
	startingHeader[0].setAttribute('tabindex', '0');

	staringContent[0].classList.add('open');
	staringContent[0].setAttribute('tabindex', '0');

	//Global Action
	var element = document.getElementById($parameters.Id).parentElement;
	element.changeTab = function (i) {
		$actions.TabsOnClick(i);
	};

	var isRTL = document.querySelector('.is-rtl');

	if (isRTL) {
		$parameters.IsRTL = true;
	}

	if (!$parameters.IsWebApp) {
		addOverlay();
	}

	function addOverlay() {
		//Add Overlay
		var tabHeaderWidth = tab.querySelector('.tabs-header');
		var tabheaders = tab.querySelectorAll('.tabs-header-tab');
		var tabOverlay = element.querySelector('.tabs-overlay');
		var tabWidth = 0;

		if (tabOverlay) {
			for (i = 0; i < tabheaders.length; i++) {
				tabWidth = tabWidth + tabheaders[i].offsetWidth;

				if (tabWidth > tabHeaderWidth.offsetWidth + 10) {
					if (tabOverlay.classList.contains('ph')) {
						tabOverlay.classList.remove('ph');
					}

					if ($parameters.IsRTL) {
						tabOverlay.classList.add('left');
					} else {
						tabOverlay.classList.add('right');
					}
					break;
				} else {
					if (!tabOverlay.classList.contains('ph')) {
						tabOverlay.classList.add('ph');
					}
				}
			}
		}
	}

	// keyborad navigation
	function onTabsKeypress(e) {
		var nextTabItem = document.activeElement; // set active as default
		var tabsHeaderItems = headerTabs.children;
		tabsHeaderItems = [].slice.call(tabsHeaderItems);
		var items = tabsHeaderItems.length;

		if (tab.classList.contains('tabs-horizontal')) {
			// Arrow Right
			if (e.keyCode == '39') {
				nextTabItem = document.activeElement.parentElement.nextElementSibling;
				if (!nextTabItem) {
					nextTabItem = tabsHeaderItems[0];
					nextTabItem.children[0].focus();
					nextTabItem.children[0].click();
				} else {
					nextTabItem.children[0].focus();
					nextTabItem.children[0].click();
				}
			}
			// Arrow Left
			if (e.keyCode == '37') {
				nextTabItem = document.activeElement.parentElement.previousElementSibling;
				if (!nextTabItem) {
					nextTabItem = tabsHeaderItems[items - 1];
					nextTabItem.children[0].focus();
					nextTabItem.children[0].click();
				} else {
					nextTabItem.children[0].focus();
					nextTabItem.children[0].click();
				}
			}
		}

		if (tab.classList.contains('tabs-vertical')) {
			// Arrow Down - Act as Right
			if (e.keyCode == '40') {
				nextTabItem = document.activeElement.parentElement.nextElementSibling;
				if (!nextTabItem) {
					nextTabItem = tabsHeaderItems[0];
					nextTabItem.children[0].focus();
					nextTabItem.children[0].click();
				} else {
					nextTabItem.children[0].focus();
					nextTabItem.children[0].click();
				}
				e.preventDefault();
			}
			// Arrow Up - Act as Left
			if (e.keyCode == '38') {
				nextTabItem = document.activeElement.parentElement.previousElementSibling;
				if (!nextTabItem) {
					nextTabItem = tabsHeaderItems[items - 1];
					nextTabItem.children[0].focus();
					nextTabItem.children[0].click();
				} else {
					nextTabItem.children[0].focus();
					nextTabItem.children[0].click();
				}
				e.preventDefault();
			}
		}
		// If pressing Space key
		if (e.keyCode == '32') {
			nextTabItem.click();
		}
	}

	setTimeout(function () {
		$actions.SetTabs();
	}, 0);
};

// Validate if there's a List inside the Tabs
if (list) {
	var virtualizationDisabled = list.hasAttribute('data-virtualization-disabled');
	// 2 because of the 2 scripts tags inserted by List Widget virtualization. If there's more than 2, it means it's list items.
	var minimunLength = virtualizationDisabled ? 2 : 0;

	// setInterval to wait for List Data to Render
	var waitForList = setInterval(function () {
		var listLength = list.children.length;

		if (listLength > minimunLength) {
			clearInterval(waitForList);
			init();
		}
	}, 10);
} else {
	init();
}
