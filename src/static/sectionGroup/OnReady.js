var sectionGroup = document.getElementById($parameters.WidgetId);

if (sectionGroup) {
	var sections = sectionGroup.querySelectorAll('.section-title');
	var isSafari = document.body.classList.contains('safari');
	var viewportUnits = isSafari ? (viewportUnits = '') : (viewportUnits = 'px');

	setTimeout(function () {
		var headerSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-size'));
		var headerContentSize = parseInt(getComputedStyle(document.body).getPropertyValue('--header-size-content'));
		var finalPosition = $parameters.IsWebApp
			? headerSize + $parameters.TopPosition
			: $parameters.IsLayoutNative
			? headerSize + headerContentSize + $parameters.TopPosition
			: $parameters.TopPosition;

		if ($parameters.IsWebApp || $parameters.IsLayoutNative) {
			sectionGroup.style.setProperty('--section-top-position', finalPosition + viewportUnits);
		} else {
			for (var i = 0; i < sections.length; i++) {
				sections[i].style.top = finalPosition + viewportUnits;
			}
		}
	}, 0);
}
