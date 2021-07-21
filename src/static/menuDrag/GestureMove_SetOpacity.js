var overlay = document.querySelector('.app-menu-overlay');

if (overlay) {
	overlay.classList.add('no-transition');

	var percentageBeforeDif = (Math.abs($parameters.MoveX) * 100) / $parameters.MenuWidth;
	var percentage = 100 - percentageBeforeDif;

	var newOpacity = percentage.toFixed(0) / 100;

	if (overlay.style.opacity !== newOpacity && newOpacity.toFixed % 1 !== 0) {
		overlay.style.opacity = newOpacity;
	}
}
