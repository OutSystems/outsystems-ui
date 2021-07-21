var sectionIndex;
var timeoutVar;
var isInsideList;
var list = document.querySelector('.list');
var listChildren = list ? list.children : undefined;

var options = {
	isSmooth: $parameters.IsSmooth,
	isFixed: $parameters.IsFixed,
	topPosition: $parameters.TopPosition,
	isWebApp: $parameters.IsWebApp,
	isLayoutNative: $parameters.IsLayoutNative,
};

var waitListRender = function () {
	var virtualizationDisabled = list.hasAttribute('data-virtualization-disabled');
	// 2 because of the 2 scripts tags inserted by List Widget virtualization. If there's more than 2, it means it's list items.
	var minimunLength = virtualizationDisabled ? 2 : 0;

	// If list doesn't have the virtualization disabled, throws a warning to console
	if (!virtualizationDisabled) {
		console.warn(
			'The list that SectionIndex is watching does not have the virtualization disabled. Please, add disable-virtualization=true through Attributes section on the list widget containing the section patterns'
		);
	}

	if (!list.classList.contains('list-loading') && listChildren.length > minimunLength) {
		sectionIndex = new SectionIndex();
		sectionIndex.init(options, $parameters.IsUpdate);
		$actions.SetObject(sectionIndex);
	} else {
		timeoutVar = setTimeout(waitListRender, 0);
	}
};

if (list) {
	waitListRender();
} else {
	sectionIndex = new SectionIndex();
	sectionIndex.init(options, $parameters.IsUpdate);
	$actions.SetObject(sectionIndex);
}
