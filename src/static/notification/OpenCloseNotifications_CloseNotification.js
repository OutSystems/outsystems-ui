function OnTransitionEnd() {
	Notification.classList.remove('notification--animatable');
	Notification.removeEventListener('transitionend', OnTransitionEnd, false);
}

var Notification = document.getElementById($parameters.Id);

Notification.classList.add('notification--animatable');
Notification.classList.remove('notification--visible');

Notification.addEventListener('transitionend', OnTransitionEnd, false);
