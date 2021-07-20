var TimeoutClear = setTimeout(function () {
	$actions.ChangeIsAnimatingStatus();
	clearTimeout(TimeoutClear);
}, 300);
