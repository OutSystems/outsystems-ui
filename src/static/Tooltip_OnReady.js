var content = document.getElementById($parameters.ContentId);
var wrapper = document.getElementById($parameters.TooltipWrapperId);
var tooltip = document.getElementById($parameters.TooltipId) ? document.getElementById($parameters.TooltipId) : '';
var tooltipBackground = document.getElementById($parameters.TooltipBackgroundId)
	? document.getElementById($parameters.TooltipBackgroundId)
	: '';
var isActive = false;
var isExpanded;

function tooltipBgClick(e) {
	e.preventDefault();
	e.stopPropagation();

	$actions.ToggleTooltip(false);
	tooltipBackground.removeEventListener('click', tooltipBgClick, true);
	tooltip.removeEventListener('click', toolTipContent, true);
}

function toolTipContent(e) {
	e.preventDefault();
	e.stopPropagation();
}

if ($parameters.IsHover) {
	content.addEventListener('focus', function () {
		$actions.ToggleTooltip(true);
	});
	wrapper.addEventListener('mouseover', function (e) {
		$actions.ToggleTooltip(true);
		// To enable Esc listener on mouseover
		e.target.focus();
	});
	wrapper.addEventListener('mouseleave', function () {
		$actions.ToggleTooltip(false);

		if (tooltipBackground !== '') {
			tooltipBackground.addEventListener('click', tooltipBgClick, true);
		}

		if (tooltip !== '') {
			tooltip.addEventListener('click', toolTipContent, true);
		}
	});
	wrapper.addEventListener('click', function (e) {
		e.preventDefault();
		e.stopPropagation();

		tooltipBackground = document.getElementById($parameters.TooltipBackgroundId)
			? document.getElementById($parameters.TooltipBackgroundId)
			: '';
		tooltipBackground.addEventListener('click', tooltipBgClick, true);

		tooltip = document.getElementById($parameters.TooltipId) ? document.getElementById($parameters.TooltipId) : '';
		tooltip.addEventListener('click', toolTipContent, true);
	});
} else {
	if (tooltipBackground !== '') {
		tooltipBackground.addEventListener('click', tooltipBgClick, true);
	}

	if (tooltip !== '') {
		tooltip.addEventListener('click', toolTipContent, true);
	}

	content.addEventListener(
		'click',
		function (e) {
			e.preventDefault();
			e.stopPropagation();

			$actions.ToggleTooltip(true);

			setTimeout(function () {
				tooltipBackground = document.getElementById($parameters.TooltipBackgroundId)
					? document.getElementById($parameters.TooltipBackgroundId)
					: '';
				tooltipBackground.removeEventListener('click', tooltipBgClick, true);
				tooltipBackground.addEventListener('click', tooltipBgClick, true);

				tooltip = document.getElementById($parameters.TooltipId)
					? document.getElementById($parameters.TooltipId)
					: '';
				tooltip.removeEventListener('click', toolTipContent, true);
				tooltip.addEventListener('click', toolTipContent, true);
			}, 0);
		},
		true
	);
	isActive = true;
}

var onKeyDownPress = function (e) {
	isExpanded = content.getAttribute('aria-expanded');

	//If esc or Tab, Close Tooltip
	if ((isExpanded === 'true' && e.keyCode == '27') || (document.activeElement === tooltip && e.keyCode == '9')) {
		$actions.ToggleTooltip(!isExpanded);
		isActive = !isExpanded;
		e.preventDefault();
		e.stopPropagation();
	}

	//If enter or space use the tooltip to validate
	if (e.keyCode == '13') {
		$actions.ToggleTooltip(true);
		isActive = true;
		e.preventDefault();
		e.stopPropagation();
	}
};

wrapper.addEventListener('keydown', onKeyDownPress);
