if ($parameters.UseOverlays) {
	$parameters.LeftObj.classList.remove('no-transition');
	$parameters.RightObj.classList.remove('no-transition');
	$parameters.TopObj.classList.remove('no-transition');
	$parameters.TopObj.style.zIndex = '8';
}

setTimeout(function () {
	$actions.OnSwipeTop();
	$actions.ResetOverlays();
}, 300);
