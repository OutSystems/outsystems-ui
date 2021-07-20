var accordion = $parameters.AccordionObj;
var accordionItems = accordion.querySelectorAll('.section-expandable');
var thisElem = document.getElementById($parameters.WidgetId);

var isClosed = function (currentAccordionItem) {
	if (currentAccordionItem.classList.contains('is--closed')) {
		return true;
	}

	return false;
};

currAccordionItem = thisElem;

for (var i = 0; i < accordionItems.length; i++) {
	var accordionItem = accordionItems[i];
	if (accordionItem !== currAccordionItem && !isClosed(accordionItem)) {
		accordionItem.CollapseItem();
	}
}
