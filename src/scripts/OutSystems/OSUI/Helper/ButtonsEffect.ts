// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function bodyClick(event: any) {
		if (event.target.classList.contains('btn')) {
			buttonEffect(event.target);
			return;
		}

		const found =
			hasSomeParentTheClass(event.target, 'list-item') || hasSomeParentTheClass(event.target, 'bottom-bar-item');

		if (found) {
			clickEffect(found);
		}
	}

	function clickEffect(el: HTMLElement) {
		const spanEl: HTMLElement = document.createElement('span');
		spanEl.classList.add('scale-animation');

		el.appendChild(spanEl);

		el.addEventListener('animationend', OnTransitionEnd, false);
		el.addEventListener('webkitAnimationEnd', OnTransitionEnd, false);

		function OnTransitionEnd() {
			if (spanEl && this === el && this === spanEl.parentNode) {
				this.removeChild(spanEl);
			}
		}
	}

	function buttonEffect(el: HTMLElement) {
		const spanEl: HTMLElement = document.createElement('span');
		spanEl.classList.add('btn-animation');
		el.appendChild(spanEl);

		setTimeout(function () {
			el.removeChild(spanEl);
		}, 1800);
	}

	function hasSomeParentTheClass(element: HTMLElement, classname: string) {
		if (element) {
			// only if it has a class, only if it's beneath 'main-content' and doesn't pass it, if it's not a chart
			if (
				typeof element.className !== 'undefined' &&
				!element.classList.contains('.main-content') &&
				!(element instanceof SVGElement)
			) {
				if (element.className.split(' ').indexOf(classname) >= 0) {
					return element;
				} else {
					return hasSomeParentTheClass(element.parentElement, classname);
				}
			}
		}

		return undefined;
	}

	// Init Events
	document.body.addEventListener('click', bodyClick);
}
