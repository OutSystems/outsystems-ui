var sectionItem = document.getElementById($parameters.Id);
var sectionTitle = document.getElementById($parameters.TitleId);
var sectionContent = document.getElementById($parameters.ContentId);
var contentPlaceholder = document.getElementById($parameters.ContentPlaceholderId);
var accordion;
var isExpanded;
$parameters.HasContent = contentPlaceholder.innerHTML !== '';

accordion = sectionItem.closest('.accordion');

// If accordion selector with closest returns null, change to work with parent nodes
if (accordion === null) {
	accordion = sectionItem.parentNode.parentNode;
}

var multipleItemsData = accordion.getAttribute('data-multiple-items');

// Check if is inside Accordion
if (accordion.classList.contains('accordion')) {
	$parameters.HasWrapper = true;
}

// Check if MultipleItems is False
if (multipleItemsData === 'True') {
	$parameters.IsMultipleItems = true;
}

// Add classes if expanded set as true. Doing here, instead of using Platform If on div, to avoid conflict with FLIP animation
if ($parameters.IsParameterChange) {
	if ($parameters.IsExpanded) {
		$actions.Expand(false);
	} else {
		$actions.Collapse(false);
	}
} else if ($parameters.IsExpanded) {
	sectionContent.classList.remove('is--collapsed');
	sectionContent.classList.add('is--expanded');
}

var onKeyDownPress = function (e) {
	isExpanded = sectionTitle.getAttribute('aria-expanded');

	//If esc, Close AccordionItem
	if (isExpanded === 'true' && e.keyCode == '27') {
		$actions.OnClick($parameters.Id, true);
		e.preventDefault();
		e.stopPropagation();
	}

	//If enter or space use the onAccordionClick to validate
	if (e.keyCode == '32' || e.keyCode == '13') {
		$actions.OnClick($parameters.Id, true);
		e.preventDefault();
		e.stopPropagation();
	}
};

if ($parameters.HasContent) {
	sectionTitle.addEventListener('keydown', onKeyDownPress);
}

$parameters.AccordionObj = accordion;
