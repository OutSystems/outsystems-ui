var obj = document.getElementById($parameters.id);

var isLayoutNative = document.querySelector('.layout-native');
var isNativeDesktop = document.querySelector('.desktop .layout-native');

var moveheadertabs = obj.querySelector('.tabs-header');
var tabheaders = obj.querySelectorAll('.tabs-header-tab');
var tabsInsidePopup = document.body.querySelector('.popup-dialog .popup-content .tabs');
var element = tabheaders[$parameters.ActiveTab];
var threshold = 40;
var elementMargin;
var isRTL;

function setRightTab() {
	var el = obj.querySelector('.tabs-content-wrapper');
	var width = -($parameters.ActiveTab * el.offsetWidth);

	if (isRTL) {
		width = $parameters.ActiveTab * el.offsetWidth;
	}

	if (!$parameters.IsWebApp && !tabsInsidePopup) {
		if ($parameters.ActiveTab === 0 && $parameters.StartingTab === 0) {
			el.removeAttribute('style');
		} else {
			el.style.webkitTransform = 'translateX(' + width + 'px) translateZ(0)';
			el.style.transform = 'translateX(' + width + 'px) translateZ(0)';
		}
	}

	if (tabsInsidePopup) {
		element = document.querySelector('.popup-dialog .tabs-header-tab.active');
	}

	if (!$parameters.IsVertical) {
		var boundingRight = Math.round(tabheaders[$parameters.ActiveTab].getBoundingClientRect().right);
		var screenBoundingWidthRight = moveheadertabs.offsetWidth - elementMargin;
		var boundingLeft = Math.round(tabheaders[$parameters.ActiveTab].getBoundingClientRect().left);
		var layoutsReactiveNative =
			document.querySelector('.layout.layout-top .main') ||
			document.querySelector('.layout.layout-side:not(.layout-native) .main') ||
			document.querySelector('.layout.layout-side.layout-native .main');
		var oldLayouts = document.querySelector('.layout');
		var layoutBoundings = 0;
		var tabsScroll;
		var scroollBehavior = 'smooth';
		var waitingTime = 100;

		if (layoutsReactiveNative) {
			layoutBoundings = layoutsReactiveNative.getBoundingClientRect().left;
		} else if (oldLayouts) {
			layoutBoundings = oldLayouts.offsetWidth - oldLayouts.querySelector('.main-content').offsetWidth;
		}

		elementMargin =
			threshold +
			layoutBoundings +
			parseInt(window.getComputedStyle(element).getPropertyValue('margin-left')) +
			parseInt(window.getComputedStyle(element).getPropertyValue('margin-right'));

		if ($parameters.IsFirstTimeLoad) {
			scroollBehavior = 'auto';
			$actions.RemoveTransition();
		}

		if ($parameters.IsRTL) {
			tabsScroll = (element.offsetLeft - (moveheadertabs.offsetWidth / 2 - element.offsetWidth / 2)) * -1;
		} else {
			tabsScroll = element.offsetLeft - (moveheadertabs.offsetWidth / 2 - element.offsetWidth / 2);
		}

		if (!(boundingRight < screenBoundingWidthRight && boundingLeft > elementMargin)) {
			moveheadertabs.scrollTo({
				top: 0,
				left: tabsScroll,
				behavior: scroollBehavior,
			});
		}
	}
}

function setUnderLine() {
	isRTL = document.querySelector('.is-rtl');
	var activeWidth = obj.querySelector('.tabs-header-tab.active').offsetWidth;
	var activeTab = obj.querySelector('.tabs-header-tab.active');
	var position = 0;

	for (var i = 0; i < tabheaders.length; i++) {
		if (!tabheaders[i].classList.contains('active')) {
			position = position + tabheaders[i].offsetWidth;
		} else {
			break;
		}
	}

	if (isRTL) {
		position = -position;
	}
}

setUnderLine();
setRightTab();
