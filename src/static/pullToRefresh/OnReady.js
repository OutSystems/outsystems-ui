var loadingFunction = function () {
	return new Promise(function (resolve, reject) {
		setTimeout(function () {
			$actions.TriggerOnContentPull();
		}, 1000);
		resolve();
	});
};

WebPullToRefresh.init({
	// Pointer to function that does the loading and returns a promise
	loadingFunction: loadingFunction,

	// Element holding dragable content area
	contentEl: document.querySelector('.content'),

	// Element holding pull to refresh loading area
	ptrEl: document.getElementById($parameters.PullToRefreshContainerId),

	// Element that contains the scroll bar; leave null if no container with overflow exists
	scrollEl: document.querySelector('.content'),

	// Number of pixels of panning until refresh
	distanceToRefresh: 40,

	// Dragging resistance level
	resistance: 2.5,
});
