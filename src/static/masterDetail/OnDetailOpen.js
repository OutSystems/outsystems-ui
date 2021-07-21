var layout = document.querySelector('.layout');
var elemId = document.getElementById($parameters.ElemId);
var rightPanel = elemId.querySelector('.split-right');
var isPhone = document.body.classList.contains('phone');

var open = function () {
	if (!layout.classList.contains('detail-open')) {
		$actions.GetActiveElement(document.activeElement);
	}

	rightPanel.classList.add('open');

	if (isPhone) {
		rightPanel.addEventListener('keydown', $actions.FocusTrap);
		$actions.SetAttributes();
	}

	layout.classList.add('detail-open');
};

open();
