var element = document.getElementById($parameters.WidgetId);

// Add actions
element.CollapseItem = function () {
	$actions.Collapse();
};

element.ExpandItem = function () {
	$actions.Expand();
};

element.updateAccordion = function (i) {
	$actions.OnUpdate(i);
};
