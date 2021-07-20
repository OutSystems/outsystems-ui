if ($parameters.FirstTime) {
	if ($parameters.IsRTL) {
		$parameters.interval = -($parameters.X - $parameters.LastX) / ($parameters.TabsNumber * $parameters.TabsWidth);
	} else {
		$parameters.interval = ($parameters.X - $parameters.LastX) / ($parameters.TabsNumber * $parameters.TabsWidth);
	}
} else {
	$parameters.interval = $parameters.X - $parameters.LastX;
}
