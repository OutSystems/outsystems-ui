//roll back the opacity of second element
if ($parameters.CurrentPosition + 1 < $parameters.MaxElements) {
	$parameters.ListElNodesObj[$parameters.CurrentPosition + 1].style.opacity = '.8';
}
