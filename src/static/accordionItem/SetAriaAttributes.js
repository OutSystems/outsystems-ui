var currentAccordionItem = document.getElementById($parameters.ElementId);

// Set visibility through ARIA states - Accessibility
var setAriaExpanded = function (currentAccordionItem, status, ariaHidden) {
	if (currentAccordionItem) {
		currentAccordionItem.setAttribute('aria-expanded', status);
		currentAccordionItem.querySelector('.section-expandable-title').setAttribute('aria-expanded', status);
		currentAccordionItem.querySelector('.section-expandable-content').setAttribute('aria-hidden', ariaHidden);
	}
};

if ($parameters.IsExpand) {
	setAriaExpanded(currentAccordionItem, 'true', 'false');
} else {
	setAriaExpanded(currentAccordionItem, 'false', 'true');
}
