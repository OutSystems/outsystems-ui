var flipWrapper = document.getElementById($parameters.WrappperId);
var elemId = document.getElementById($parameters.ElemId);
var isExpanded;

var onKeyDownPress = function (e) {
	isExpanded = elemId.getAttribute('data-flipped');

	//If esc, Close AccordionItem
	if (isExpanded === 'True' && e.keyCode == '27') {
		$actions.ToggleFlip();
		e.preventDefault();
		e.stopPropagation();
	}

	//If enter or space use the onAccordionClick to validate
	if (e.keyCode == '32' || e.keyCode == '13') {
		$actions.ToggleFlip();
		e.preventDefault();
		e.stopPropagation();
	}
};

flipWrapper.addEventListener('keydown', onKeyDownPress);
