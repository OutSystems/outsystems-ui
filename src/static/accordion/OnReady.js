var accordion = document.getElementById($parameters.WidgetId);
var checkAccordionElements = accordion.querySelectorAll('.section-expandable.is--open');

// Close All but first, if user has multipleItems as false, but more than one section-expandable as Expanded
if ($parameters.MultipleItems === false) {
	for (i = 0; i < checkAccordionElements.length; i++) {
		if (i !== 0) {
			checkAccordionElements[i].CollapseItem();
		}
	}
}
