var currentAccordionItem = document.getElementById($parameters.WidgetId);

var currentAccordionItemContent = currentAccordionItem.querySelector('.section-expandable-content');

currentAccordionItemContent.removeAttribute('style');

// Gets initial height value
var expandedHeight = currentAccordionItemContent.getBoundingClientRect().height;

// Toggle is--closed/is--open class from current accordion item
currentAccordionItem.classList.add('is--closed');
currentAccordionItem.classList.remove('is--open');

// Removes expanded class and adds the collapsed class to obtain the collapsed height value
currentAccordionItemContent.classList.remove('is--expanded');
currentAccordionItemContent.classList.add('is--collapsed');

var collapsedHeight = currentAccordionItemContent.getBoundingClientRect().height;

currentAccordionItemContent.style.height = expandedHeight + 'px';

// Removes collapsed class and adds the expanded class to animate
currentAccordionItemContent.classList.add('is--expanded');
currentAccordionItemContent.classList.remove('is--collapsed');

// This setTimeout (0ms) will ensure that the DOM received the height 0 before actually starts the transition
var waitDomIterateTimeout = setTimeout(function () {
	// Adds is--animating class to current accordion item content to obtain the final height value
	currentAccordionItemContent.classList.add('is--animating');

	// Removes is--expanded class from current accordion item content
	currentAccordionItemContent.classList.remove('is--expanded');

	currentAccordionItemContent.style.height = collapsedHeight + 'px';

	// Adds event listener to transition end
	currentAccordionItemContent.addEventListener('transitionend', transitionEndHandler);

	// Adds is--collapsed class to current accordion item content
	currentAccordionItemContent.classList.add('is--collapsed');

	// Clear timeout
	clearTimeout(waitDomIterateTimeout);
}, 100);

var transitionEndHandler = function () {
	var currentElement = currentAccordionItemContent;
	var currentElementHeader = currentAccordionItem.querySelector('.section-expandable-title');

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
			currentElementHeader.focus();
		}

		// Set visibility through ARIA states - Accessibility
		$actions.SetAriaAttributes(false, $parameters.WidgetId);

		// Removes transitionend event listener
		currentElement.removeEventListener('transitionend', transitionEndHandler, false);
	}
};
