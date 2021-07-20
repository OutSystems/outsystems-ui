$parameters.AutoplayObj = setInterval(function () {
	if ($parameters.IsRTL) {
		$actions.Previous();
	} else {
		$actions.Next();
	}
}, $parameters.Autoplay);
