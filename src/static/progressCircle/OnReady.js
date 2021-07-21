var element = document.getElementById($parameters.ContainerId);
var isRTL = document.querySelector('.is-rtl');
var animation = $parameters.Progress / 100;

var circle = new ProgressBar.Circle(element, {
	duration: $parameters.AnimationDuration,
	color: $parameters.PrimaryColorHex,
	trailColor: $parameters.SecondaryColorHex,
	strokeWidth: $parameters.StrokeWidth,
});

circle.setText($parameters.Text);
circle.text.style.color = $parameters.TextColor;

if (isRTL) {
	animation = -($parameters.Progress / 100);
}

if ($parameters.AnimationDuration > 0) {
	circle.animate(animation);
} else {
	circle.set(animation);
}

$parameters.CircleObject = circle;

element.parentElement.offsetHeight;

$parameters.ContainerWidth = element.parentElement.offsetWidth;
