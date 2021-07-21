var Notification = document.querySelector('.notification');

Notification.addEventListener('keydown', function (e) {
	if (e.keyCode == '27' && document.activeElement === Notification) {
		$actions.OpenCloseNotification();
	}
});
