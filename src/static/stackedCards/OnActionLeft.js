if ($parameters.UseOverlays) {
	$parameters.LeftObj.classList.remove('no-transition');
	$parameters.TopObj.classList.remove('no-transition');
	$parameters.LeftObj.style.zIndex = '8';
}

setTimeout(function () {
	$actions.OnSwipeLeft();
	$actions.ResetOverlayLeft();
}, 300);
