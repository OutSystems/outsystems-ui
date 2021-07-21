var circle = $parameters.CircleObject;

circle.animate($parameters.Progress / 100, {
	duration: 300,
	step: function (state, circle) {
		circle.path.setAttribute('stroke', state.color);
	},
	from: { color: $parameters.PreviousProgressColor },
	to: { color: $parameters.ProgressColor },
});

circle.setText($parameters.Text);
circle.text.style.color = $parameters.TextColor;
