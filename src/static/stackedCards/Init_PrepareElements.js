addMargin = $parameters.ElementsMargin * ($parameters.Items - 1) + 'px';

var elTrans;
var element = document.getElementById($parameters.WidgetId);
var arrowLeft = 37;
var arrowRight = 39;
var arrowUp = 38;

// Set accessibility role to list elements
for (i = 0; i < $parameters.MaxElements; i++) {
	$parameters.ListElNodesObj[i].setAttribute('role', 'listitem');
}

if ($parameters.StackedOptions === 'Top') {
	for (i = $parameters.Items; i < $parameters.MaxElements; i++) {
		$parameters.ListElNodesObj[i].classList.add(
			'stackedcards-top',
			'stackedcards--animatable',
			'stackedcards-origin-top'
		);
	}

	elTrans = $parameters.ElementsMargin * 4;

	$parameters.StackedCardsObj.style.marginBottom = addMargin;
} else if ($parameters.StackedOptions === 'Bottom') {
	for (i = $parameters.Items; i < $parameters.MaxElements; i++) {
		$parameters.ListElNodesObj[i].classList.add(
			'stackedcards-bottom',
			'stackedcards--animatable',
			'stackedcards-origin-bottom'
		);
	}

	elTrans = 0;

	$parameters.StackedCardsObj.style.marginBottom = addMargin;
} else if ($parameters.StackedOptions === 'None') {
	for (i = $parameters.Items; i < $parameters.MaxElements; i++) {
		$parameters.ListElNodesObj[i].classList.add('stackedcards-none', 'stackedcards--animatable');
	}

	elTrans = 0;
}

for (i = $parameters.Items; i < $parameters.MaxElements; i++) {
	$parameters.ListElNodesObj[i].style.zIndex = 0;
	$parameters.ListElNodesObj[i].style.opacity = 0;
	$parameters.ListElNodesObj[i].style.webkitTransform =
		'scale(' + (1 - $parameters.Items * 0.04) + ') translateX(0) translateY(' + elTrans + 'px) translateZ(0)';
	$parameters.ListElNodesObj[i].style.transform =
		'scale(' + (1 - $parameters.Items * 0.04) + ') translateX(0) translateY(' + elTrans + 'px) translateZ(0)';
}

if ($parameters.ListElNodesObj[$parameters.CurrentPosition]) {
	$parameters.ListElNodesObj[$parameters.CurrentPosition].classList.add('stackedcards-active');
}

if ($parameters.UseOverlays) {
	$parameters.LeftObj.style.transform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';
	$parameters.LeftObj.style.webkitTransform =
		'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';

	$parameters.RightObj.style.transform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';
	$parameters.RightObj.style.webkitTransform =
		'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';

	$parameters.TopObj.style.transform = 'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';
	$parameters.TopObj.style.webkitTransform =
		'translateX(0px) translateY(' + elTrans + 'px) translateZ(0px) rotate(0deg)';
} else {
	$parameters.LeftObj.className = '';
	$parameters.RightObj.className = '';
	$parameters.TopObj.className = '';

	$parameters.LeftObj.classList.add('stackedcards-overlay-hidden');
	$parameters.RightObj.classList.add('stackedcards-overlay-hidden');
	$parameters.TopObj.classList.add('stackedcards-overlay-hidden');
}

//Remove class init
setTimeout(function () {
	element.classList.remove('init');
}, 150);

// Add keypress events
var onKeydownPress = function (e) {
	switch (true) {
		case e.keyCode === arrowLeft:
			$actions.OnActionLeft();
			break;
		case e.keyCode === arrowRight:
			$actions.OnActionRight();
			break;
		case e.keyCode === arrowUp:
			$actions.OnActionTop();
			break;
	}
};

element.addEventListener('keydown', onKeydownPress);
