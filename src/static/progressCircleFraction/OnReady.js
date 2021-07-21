var element = document.getElementById($parameters.ContainerId);
var isRTL = document.querySelector('.is-rtl');

var circle = new ProgressBar.Circle(element, {
	duration: $parameters.AnimationDuration,
	color: $parameters.ProgressColor,
	trailColor: $parameters.TrailColor,
	strokeWidth: $parameters.StrokeWidth,
});

var progress = $parameters.Progress;
if (isRTL) {
	progress = -progress;
}

if ($parameters.AnimationDuration > 0) {
	circle.animate(progress);
} else {
	circle.set(progress);
	circle.path.setAttribute('stroke', $parameters.ProgressColor);
}

$parameters.CircleObject = circle;

$parameters.ContainerWidth = element.parentElement.offsetWidth;
