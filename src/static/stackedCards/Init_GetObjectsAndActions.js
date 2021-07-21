var obj = document.getElementById($parameters.WidgetId);
$parameters.StackedCardsObj = obj.querySelector('.stackedcards-container');

// Add actions

$parameters.StackedCardsObj.swipeLeft = function () {
	$actions.OnSwipeLeft();
};
$parameters.StackedCardsObj.swipeRight = function () {
	$actions.OnSwipeRight();
};
$parameters.StackedCardsObj.swipeTop = function () {
	$actions.OnSwipeTop();
};
$parameters.StackedCardsObj.updateUi = function () {
	$actions.OnListRemoveUpdate();
};
$parameters.StackedCardsObj.resetOverlays = function () {
	$actions.ResetOverlays();
};
$parameters.StackedCardsObj.leftAction = function () {
	$actions.OnActionLeft();
};
$parameters.StackedCardsObj.rightAction = function () {
	$actions.OnActionRight();
};
$parameters.StackedCardsObj.topAction = function () {
	$actions.OnActionTop();
};

// Get Objects
$parameters.LeftObj = obj.querySelector('.stackedcards-overlay.left');
$parameters.RightObj = obj.querySelector('.stackedcards-overlay.right');
$parameters.TopObj = obj.querySelector('.stackedcards-overlay.top');
$parameters.MessageObj = obj.querySelector('.stackedcards-message');
