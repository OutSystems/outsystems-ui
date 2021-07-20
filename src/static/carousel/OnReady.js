window.addEventListener('orientationchange', $actions.OnOrientationChange);
$parameters.CarouselObj = new newCarousel();

var previousArrow = document.getElementById($parameters.PreviousArrow);
var nextArrow = document.getElementById($parameters.NextArrow);

previousArrow.addEventListener('click', function (e) {
	e.stopPropagation();
	e.preventDefault();
	$actions.Previous();
});

nextArrow.addEventListener('click', function (e) {
	e.stopPropagation();
	e.preventDefault();
	$actions.Next();
});

var onKeyDownPress = function (e) {
	//If enter or space use
	if (e.keyCode == '32' || e.keyCode == '13') {
		if (e.currentTarget === nextArrow) {
			$actions.Next();
		} else {
			$actions.Previous();
		}
		e.preventDefault();
		e.stopPropagation();
	}
};

previousArrow.addEventListener('keydown', onKeyDownPress);

nextArrow.addEventListener('keydown', onKeyDownPress);

var opts = {
	//OS parameters
	widgetId: $parameters.WidgetId,
	margin: $parameters.Margin,
	initialPosition: $parameters.InitialPosition,
	itemsPhone: $parameters.ItemsPhone,
	itemsTablet: $parameters.ItemsTablet,
	itemsDesktop: $parameters.ItemsDesktop,
	center: $parameters.Center,
	scale: $parameters.Scale,
	loop: $parameters.Loop,
	dots: $parameters.Dots,
	currentDevice: $parameters.currentDevice,
	isRTL: $parameters.IsRTL,

	//OS actions
	initAction: $actions.Init(),
	goToAction: $actions.GoTo,
	setEventsStatus: $actions.SetEventsStatus,
};

$parameters.CarouselObj.init(opts);
