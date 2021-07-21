var elemId = document.getElementById($parameters.ElemId);
var leftPanel = elemId.querySelector('.split-left');
var layout = document.querySelector('.layout');
var isPhone = document.body.classList.contains('phone');
$parameters.IsPhone = isPhone;
var elemHeight;

if ($parameters.IsWebApp || ($parameters.IsLayoutNative && !isPhone)) {
	if ($parameters.Height === '') {
		var contentMiddle = document.querySelector('.content-middle');
		var footer = document.querySelector('.footer');
		var elDistanceToTop = window.pageYOffset + contentMiddle.getBoundingClientRect().top;
		var padding = $parameters.IsLayoutNative
			? 0
			: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--space-m'));

		if (footer) {
			var footerHeight = footer.getBoundingClientRect().height;
			elemHeight = elDistanceToTop + padding * 2 + footerHeight + 'px';
		} else {
			elemHeight = elDistanceToTop + padding * 2 + 'px';
		}
	} else {
		elemHeight = $parameters.Height;
	}

	elemId.style.setProperty('--master-detail-height', elemHeight);
}

// Set 50% for each, in case parameters are not correctly set
if ($parameters.LeftPercentage < 0 || $parameters.LeftPercentage > 100) {
	$parameters.LeftPercentage = 50;
}

elemId.style.setProperty('--left-percentage', $parameters.LeftPercentage + '%');

// fix for arrow on phone
if (layout) {
	var nativeLayout = layout.classList.contains('layout-native');

	if (!nativeLayout) {
		// old native layouts
		$actions.MoveElement($parameters.RightClose, '.active-screen .screen');
	}
}

if (!isPhone) {
	// Set tab navigation behaviour based on focus event
	var focusSpanTop = elemId.querySelector('span.focus-item.top'),
		focusSpanBottom = elemId.querySelector('span.focus-item.bottom');

	focusSpanTop.removeEventListener('focus', $actions.FocusOnSpan);
	focusSpanTop.addEventListener('focus', $actions.FocusOnSpan);

	focusSpanBottom.removeEventListener('focus', $actions.FocusOnSpan);
	focusSpanBottom.addEventListener('focus', $actions.FocusOnSpan);
}
