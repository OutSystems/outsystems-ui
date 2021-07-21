$parameters.SliderObject = document.getElementById($parameters.SliderContainerId);
var orientation = $parameters.IsVertical ? 'vertical' : 'horizontal';

var options = {
	direction: $parameters.Direction,
	start: [$parameters.Initial],
	step: $parameters.Step,
	connect: 'lower',
	orientation: orientation,
	range: {
		min: $parameters.Min,
		max: $parameters.Max,
	},
};

if ($parameters.ShowPips) {
	var mode = 'count';

	// Limit the number of pips to prevent memory issues
	var pipsValues = parseFloat($parameters.PipsStep);

	if (pipsValues > 10) {
		// when there are too many pips steps to be shown
		mode = 'range';
	}

	if (pipsValues <= 1) {
		// steps, when they exist, can't be less than 2 (library restraint)
		pipsValues = 2;
	}

	var pipsDensity = (pipsValues - 1) * 100; // -1 to compensate the first position: 0;

	// Create the pips
	options.pips = {
		mode: mode,
		values: pipsValues,
		density: pipsDensity,
		stepped: true,
	};
}

var str = $parameters.AdvancedFormat;

if (str.length > 0) {
	var json = eval('(' + str + ')');
	options = mergeJSON(options, json);
}

noUiSlider.create($parameters.SliderObject, options);

if ($parameters.ChangeEventDuringSlide) {
	// trigger events while sliding
	$parameters.SliderObject.noUiSlider.on('update', throttle($actions.ValuesChange, 200));
	$parameters.SliderObject.noUiSlider.on('start', $actions.ToggleSlidingStatus);
	$parameters.SliderObject.noUiSlider.on('end', $actions.ToggleSlidingStatus);
} else {
	// only trigger events on release or tap
	$parameters.SliderObject.noUiSlider.on('set', $actions.ValuesChange);
}

function mergeJSON(target, add) {
	function isObject(obj) {
		if (typeof obj == 'object') {
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					return true; // search for first object prop
				}
			}
		}
		return false;
	}
	for (var key in add) {
		if (add.hasOwnProperty(key)) {
			if (target[key] && isObject(target[key]) && isObject(add[key])) {
				mergeJSON(target[key], add[key]);
			} else {
				target[key] = add[key];
			}
		}
	}
	return target;
}

function throttle(func, limit) {
	var lastFunc;
	var lastRan;

	return function () {
		var context = this;
		var args = arguments;

		if (!lastRan) {
			func.apply(context, args);
			lastRan = Date.now();
		} else {
			clearTimeout(lastFunc);
			lastFunc = setTimeout(function () {
				if (Date.now() - lastRan >= limit) {
					func.apply(context, args);
					lastRan = Date.now();
				}
			}, limit - (Date.now() - lastRan));
		}
	};
}
