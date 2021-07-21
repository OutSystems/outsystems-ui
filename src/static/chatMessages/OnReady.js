var elemId = document.getElementById($parameters.ElemId);
var isExpanded;

var onKeyDownPress = function (e) {
	isExpanded = elemId.getAttribute('aria-expanded');

	//If esc, Close AccordionItem
	if (isExpanded === 'true' && e.keyCode == '27') {
		$actions.ShowStatus();
		e.preventDefault();
		e.stopPropagation();
	}

	//If enter or space use the onAccordionClick to validate
	if (e.keyCode == '32' || e.keyCode == '13') {
		$actions.ShowStatus();
		e.preventDefault();
		e.stopPropagation();
	}
};

elemId.addEventListener('keydown', onKeyDownPress);
