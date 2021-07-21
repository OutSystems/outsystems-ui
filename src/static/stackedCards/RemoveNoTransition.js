if ($parameters.ListElNodesObj[$parameters.CurrentPosition]) {
	if ($parameters.UseOverlays) {
		$parameters.LeftObj.classList.remove('no-transition');
		$parameters.RightObj.classList.remove('no-transition');
		$parameters.TopObj.classList.remove('no-transition');
	}

	$parameters.ListElNodesObj[$parameters.CurrentPosition].classList.remove('no-transition');
	$parameters.ListElNodesObj[$parameters.CurrentPosition].style.zIndex = 6;
}
