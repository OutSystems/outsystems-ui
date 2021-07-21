var Notification = document.querySelector('.notification');

$actions.MoveElement($parameters.WidgetId, '.active-screen .content-top');

if ($parameters.IsOpen) {
	Notification.classList.add('notification--visible');
	Notification.focus();
} else {
	Notification.classList.remove('notification--visible');
}
