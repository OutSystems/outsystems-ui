var currentAccordionItem = document.getElementById($parameters.WidgetId);

var currentAccordionItemContent = currentAccordionItem.querySelector('.section-expandable-content');
var currentAccordionItemHeader = currentAccordionItem.querySelector('.section-expandable-title');

// Gets initial height value
var collapsedHeight = currentAccordionItemContent.getBoundingClientRect().height;

// Toggle is--closed/is--open class from current accordion item
currentAccordionItem.classList.remove('is--closed');
currentAccordionItem.classList.add('is--open');

// Prevents multiple clicks on Accordion when it's animating
currentAccordionItemHeader.style.pointerEvents = 'none';

// Toggle is--collapsed/is--expanded class from current accordion item
currentAccordionItemContent.classList.remove('is--collapsed');
currentAccordionItemContent.classList.add('is--expanded');

currentAccordionItemContent.removeAttribute('style');

// Gets final height value
var expandedHeight = currentAccordionItemContent.getBoundingClientRect().height;

// Removes is--expanded class from current accordion item content to animate
currentAccordionItemContent.classList.remove('is--expanded');

currentAccordionItemContent.style.height = collapsedHeight + 'px';

// This setTimeout (0ms) will ensure that the DOM received the height 0 before actually starts the transition
var waitDomIterateTimeout = setTimeout(function () {
	// Adds is--animating class to current accordion item content to obtain the final height value
	currentAccordionItemContent.classList.add('is--animating');

	currentAccordionItemContent.style.height = expandedHeight + 'px';

	// Adds event listener to transition end
	currentAccordionItemContent.addEventListener('transitionend', transitionEndHandler);

	// Adds is--expanded class to current accordion item content
	currentAccordionItemContent.classList.add('is--expanded');

	// Clear timeout
	clearTimeout(waitDomIterateTimeout);
}, 100);

var transitionEndHandler = function () {
	var currentElement = currentAccordionItemContent;
	var currentElementHeader = currentAccordionItemHeader;

	if (currentElement) {
		// Removes is--animating class
		currentElement.classList.remove('is--animating');

		// Remove height and pointer events inline style
		currentElement.style.height = '';
		currentElementHeader.style.pointerEvents = '';

		// Verify if the currentElement has inline-styles and remove attribute if are empty
		if (currentElement.style.cssText.length === 0) {
			currentElement.removeAttribute('style');
		}

		if ($parameters.IsKeypress) {
			// Add focus for Accessibility
			currentElement.focus();
		}

		// Set visibility through ARIA states - Accessibility
		$actions.SetAriaAttributes(true, $parameters.WidgetId);

		// Removes transitionend event listener
		currentElement.removeEventListener('transitionend', transitionEndHandler, false);
	}
};
