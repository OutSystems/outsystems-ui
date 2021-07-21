setTimeout(function () {
	var elTrans;

	if ($parameters.StackedOptions === 'Top') {
		elTrans = $parameters.ElementsMargin * ($parameters.Items - 1);
	} else if ($parameters.StackedOptions === 'Bottom' || $parameters.StackedOptions === 'None') {
		elTrans = 0;
	}

	if (!$parameters.IsFirstTime) {
		$parameters.LeftObj.classList.add('no-transition');
		$parameters.TopObj.classList.add('no-transition');
	}

	requestAnimationFrame(function () {
		$parameters.LeftObj.style.transform = 'translateX(0) translateY(' + elTrans + 'px) translateZ(0)';
		$parameters.LeftObj.style.webkitTransform = 'translateX(0) translateY(' + elTrans + 'px) translateZ(0)';
		$parameters.LeftObj.style.opacity = '0';

		$parameters.TopObj.style.transform = 'translateX(0) translateY(' + elTrans + 'px) translateZ(0)';
		$parameters.TopObj.style.webkitTransform = 'translateX(0) translateY(' + elTrans + 'px) translateZ(0)';
		$parameters.TopObj.style.opacity = '0';
	});
}, 300);
