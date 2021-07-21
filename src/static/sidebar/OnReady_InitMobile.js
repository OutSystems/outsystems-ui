var el = document.getElementById($parameters.WidgetId).parentNode.id;
var layout = document.querySelector('.layout');

if (layout) {
	var nativeLayout = layout.classList.contains('layout-native');

	if (nativeLayout) {
		// new native layouts
		$actions.MoveElement(el, '.active-screen .main');
	} else {
		// Old native layouts
		$actions.MoveElement(el, '.active-screen .screen');
	}
}
