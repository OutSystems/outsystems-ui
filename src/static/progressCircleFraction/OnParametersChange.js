var circle = $parameters.CircleObject;

// animate progress and pogress color
circle.animate($parameters.Progress, {
	duration: 300,
	step: function (state, circle) {
		circle.path.setAttribute('stroke', state.color);
	},
	from: { color: $parameters.PreviousProgressColor },
	to: { color: $parameters.ProgressColor },
});
