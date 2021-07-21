var obj = document.getElementById($parameters.WidgetId);
var listEl = obj.querySelector('.stackedcards-container .list');
var timeoutVar;

var waitListRender = function () {
	if (!listEl.classList.contains('list-loading')) {
		listElNodes = listEl.childNodes;
		$actions.Init(listElNodes);
	} else {
		timeoutVar = setTimeout(waitListRender, 100);
	}
};

if (!listEl) {
	listEl = obj.querySelector('.stackedcards-container');
	listElNodes = listEl.childNodes;
	$actions.Init(listElNodes);
} else {
	waitListRender();
}
