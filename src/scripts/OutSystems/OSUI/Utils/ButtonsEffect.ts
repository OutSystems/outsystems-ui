// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function _bodyClick(event: any) {
		if (event.target.classList.contains('btn')) {
			_buttonEffect(event.target);
			return;
		}

		const found =
			_hasSomeParentTheClass(event.target, 'list-item') ||
			_hasSomeParentTheClass(event.target, 'bottom-bar-item');

		if (found) {
			_clickEffect(found);
		}
	}

	function _clickEffect(el: HTMLElement) {
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

	function _buttonEffect(el: HTMLElement) {
		const spanEl: HTMLElement = document.createElement('span');
		spanEl.classList.add('btn-animation');
		el.appendChild(spanEl);

		setTimeout(function () {
			el.removeChild(spanEl);
		}, 1800);
	}

	function _hasSomeParentTheClass(element: HTMLElement, classname: string) {
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
					return _hasSomeParentTheClass(element.parentElement, classname);
				}
			}
		}

		return undefined;
	}

	// Init Events
	document.body.addEventListener('click', _bodyClick);
}
