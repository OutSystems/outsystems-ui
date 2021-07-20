var element = document.getElementById($parameters.WidgetId);
element = element.querySelector('.carousel-container-content');
var isRTL = $actions.IsRTL() === true;

// Add actions
element.next = function () {
	isRTL ? $actions.Previous() : $actions.Next();
};
element.previous = function () {
	isRTL ? $actions.Next() : $actions.Previous();
};
element.goto = function (i) {
	$actions.GoTo(i);
};
element.updateCarousel = function () {
	$actions.Update();
};
