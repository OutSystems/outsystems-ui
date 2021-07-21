var layout = document.querySelector('.layout');
var elemId = document.getElementById($parameters.ElemId);
var rightPanel = elemId.querySelector('.split-right');
var isPhone = document.body.classList.contains('phone');

var close = function () {
	rightPanel.classList.remove('open');

	if (isPhone) {
		rightPanel.removeEventListener('keydown', $actions.FocusTrap);
		$actions.SetAttributes();
	}

	layout.classList.remove('detail-open');

	if (isPhone && $parameters.ActiveDOMElem) {
		$parameters.ActiveDOMElem.focus();
	}
};

close();
