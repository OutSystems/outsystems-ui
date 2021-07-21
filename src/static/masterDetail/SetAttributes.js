// Elements
var rightElem = document.getElementById($parameters.RightPanelId);
var isOpenedOnPhone = $parameters.IsOpenedOnPhone;

if (isOpenedOnPhone) {
	rightElem.setAttribute('aria-hidden', false);
	rightElem.setAttribute('aria-expanded', true);
} else {
	rightElem.setAttribute('aria-hidden', true);
	rightElem.setAttribute('aria-expanded', false);
}
