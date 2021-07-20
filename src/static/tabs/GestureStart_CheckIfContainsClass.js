var tabSwipe = document.getElementById($parameters.TabId);

if (tabSwipe.classList.contains('no-swipe')) {
	$parameters.ContainsClass = true;
} else {
	$parameters.ContainsClass = false;
}
