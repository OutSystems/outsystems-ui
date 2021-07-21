// This is a fix to use with some existing patterns on e.g.: FlipContent
var stackedEle = document.getElementById($parameters.WidgetId);

if (stackedEle) {
	var element = document.getElementById($parameters.WidgetId).querySelector('.stackedcards-container .flip-content');

	if (element) {
		$parameters.LeftObj.style.zIndex = null;
		$parameters.RightObj.style.zIndex = null;
		$parameters.TopObj.style.zIndex = null;
	}
}
