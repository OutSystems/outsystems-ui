function OnTransitionEnd() {
	Notification.classList.remove('notification--animatable');
	Notification.focus();
	Notification.removeEventListener('transitionend', OnTransitionEnd, false);
}

var Notification = document.getElementById($parameters.Id);

Notification.classList.add('notification--animatable');
Notification.classList.add('notification--visible');

Notification.addEventListener('transitionend', OnTransitionEnd, false);
