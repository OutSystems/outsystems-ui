if ($parameters.ListElNodesObj[$parameters.CurrentPosition]) {
	$parameters.ListElNodesObj[$parameters.CurrentPosition].classList.add('no-transition');
	$actions.SetZindex(6);

	if ($parameters.UseOverlays) {
		$parameters.LeftObj.classList.add('no-transition');
		$parameters.RightObj.classList.add('no-transition');
		$parameters.TopObj.classList.add('no-transition');
	}

	if ($parameters.CurrentPosition + 1 < $parameters.MaxElements) {
		$parameters.ListElNodesObj[$parameters.CurrentPosition + 1].style.opacity = '1';
	}

	$parameters.GetElementHeight = $parameters.ListElNodesObj[$parameters.CurrentPosition].offsetHeight / 3;
}
