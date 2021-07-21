var buttonWrapper = document.getElementById($parameters.Buttons);
var buttons = buttonWrapper.querySelectorAll('.action-sheet-actions');

for (var i = 0; i < buttons.length; i++) {
	var buttonsChildren = buttons[i].children;

	for (var a = 0; a < buttonsChildren.length; a++) {
		if ($parameters.IsOpen) {
			buttonsChildren[a].setAttribute('tabindex', '0');
		} else {
			buttonsChildren[a].setAttribute('tabindex', '-1');
		}
	}
}
