// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Utils {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function _bodyClick(eventName: string, event: PointerEvent) {
		const target = event.target as HTMLElement;
		if (target.classList.contains('btn')) {
			_buttonEffect(target);
			return;
		}

		const foundElement =
			_hasSomeParentTheClass(target, 'list-item') || _hasSomeParentTheClass(target, 'bottom-bar-item');

		if (foundElement) {
			_clickEffect(foundElement);
		}
	}

	function _clickEffect(el: HTMLElement) {
		const spanEl: HTMLElement = document.createElement(OSFramework.OSUI.GlobalEnum.HTMLElement.Span);
		spanEl.classList.add('scale-animation');

		el.appendChild(spanEl);

		el.addEventListener(OSFramework.OSUI.GlobalEnum.HTMLEvent.AnimationEnd, OnTransitionEnd, false);
		el.addEventListener('webkitAnimationEnd', OnTransitionEnd, false);

		function OnTransitionEnd() {
			if (spanEl && this === el && this === spanEl.parentNode) {
				this.removeChild(spanEl);
				el.removeEventListener(OSFramework.OSUI.GlobalEnum.HTMLEvent.AnimationEnd, OnTransitionEnd, false);
				el.removeEventListener('webkitAnimationEnd', OnTransitionEnd, false);
				el = undefined;
			}
		}
	}

	function _buttonEffect(el: HTMLElement) {
		const spanEl: HTMLElement = document.createElement(OSFramework.OSUI.GlobalEnum.HTMLElement.Span);
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
				!element.classList.contains('main-content') &&
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

	OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
		OSFramework.OSUI.Event.DOMEvents.Listeners.Type.BodyOnClick,
		_bodyClick
	);
}
