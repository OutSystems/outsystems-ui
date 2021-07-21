requestAnimationFrame(function () {
	var element = $parameters.ElementObj;

	var elTrans;

	// Function to generate rotate value
	function RotateRegulator(value) {
		if (value / 10 > 15) {
			return 15;
		} else if (value / 10 < -15) {
			return -15;
		}
		return value / 10;
	}

	if ($parameters.Rotate) {
		rotateElement = RotateRegulator($parameters.MoveX);
	} else {
		rotateElement = 0;
	}

	if ($parameters.StackedOptions === 'Top') {
		elTrans = $parameters.ElementsMargin * ($parameters.Items - 1);
		if (element) {
			element.style.webkitTransform =
				'translateX(' +
				$parameters.MoveX +
				'px) translateY(' +
				($parameters.MoveY + elTrans) +
				'px) translateZ(0) rotate(' +
				rotateElement +
				'deg)';
			element.style.transform =
				'translateX(' +
				$parameters.MoveX +
				'px) translateY(' +
				($parameters.MoveY + elTrans) +
				'px) translateZ(0) rotate(' +
				rotateElement +
				'deg)';
			element.style.opacity = $parameters.Opacity;
		}
	} else if ($parameters.StackedOptions === 'Bottom' || $parameters.StackedOptions === 'None') {
		if (element) {
			element.style.webkitTransform =
				'translateX(' +
				$parameters.MoveX +
				'px) translateY(' +
				$parameters.MoveY +
				'px) translateZ(0) rotate(' +
				rotateElement +
				'deg)';
			element.style.transform =
				'translateX(' +
				$parameters.MoveX +
				'px) translateY(' +
				$parameters.MoveY +
				'px) translateZ(0) rotate(' +
				rotateElement +
				'deg)';
			element.style.opacity = $parameters.Opacity;
		}
	}
});
