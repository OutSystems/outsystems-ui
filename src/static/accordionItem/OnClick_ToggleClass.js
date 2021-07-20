var currentAccordionItem = document.getElementById($parameters.WidgetId);
var currentAccordionItemContent = currentAccordionItem.querySelector('.section-expandable-content');

// Toggle is--closed/is--open class from current accordion item
if ($parameters.IsExpanded) {
	currentAccordionItem.classList.add('is--closed');
	currentAccordionItem.classList.remove('is--open');
	$parameters.IsOpen = false;
} else {
	currentAccordionItem.classList.add('is--open');
	currentAccordionItem.classList.remove('is--closed');
	$parameters.IsOpen = true;
}
