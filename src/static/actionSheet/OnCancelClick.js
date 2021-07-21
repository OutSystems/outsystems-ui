var actionSheet = document.querySelector('.action-sheet');

function OnTransitionEnd() {
	$parameters.ActiveDOMElem.focus();
	actionSheet.removeEventListener('transitionend', OnTransitionEnd, false);
}

if ($parameters.ActiveDOMElem) {
	actionSheet.addEventListener('transitionend', OnTransitionEnd, false);
}
