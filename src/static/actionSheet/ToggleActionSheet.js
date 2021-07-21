var actionSheetAnimatableClass = 'action-sheet-container--animatable';
var actionSheet = document.getElementById($parameters.WidgetId);
actionSheet.classList.add(actionSheetAnimatableClass);
var firstButton = actionSheet.getElementsByTagName('BUTTON');

function OnTransitionEnd() {
	actionSheet.classList.remove(actionSheetAnimatableClass);

	if ($parameters.IsOpen) {
		firstButton[0].focus();
	}

	actionSheet.removeEventListener('transitionend', OnTransitionEnd, false);
}

if ($parameters.IsOpen) {
	$parameters.ActiveDOMElem = document.activeElement;
	actionSheet.classList.add('action-sheet-container--visible');
	actionSheet.addEventListener('keydown', $actions.FocusTrap);
} else {
	actionSheet.classList.remove('action-sheet-container--visible');
	actionSheet.removeEventListener('keydown', $actions.FocusTrap);
}

actionSheet.addEventListener('transitionend', OnTransitionEnd, false);
