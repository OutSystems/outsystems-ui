var Notification = document.querySelector('.notification');
var layout = document.querySelector('.layout');

if (layout) {
	var nativeLayout = layout.classList.contains('layout-native');

	if (nativeLayout) {
		// new native layouts
		$actions.MoveElement($parameters.WidgetId, '.active-screen .main');
	} else {
		// Old native layouts
		$actions.MoveElement($parameters.WidgetId, '.active-screen .screen');
	}
}

if ($parameters.IsOpen) {
	Notification.classList.add('notification--visible');
	Notification.focus();
} else {
	Notification.classList.remove('notification--visible');
}
