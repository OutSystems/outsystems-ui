// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Utils {
	export type FloatingUIOptions = {
		anchorElem: HTMLElement;
		autoPlacement: boolean;
		floatingElem: HTMLElement;
		position: string;
		updatePosition: boolean;
		useShift: boolean;
	};

	// eslint-disable-next-line @typescript-eslint/naming-convention
	export abstract class FloatingUI {
		public static setFloatingPosition(options: FloatingUIOptions): void | OSFramework.OSUI.GlobalCallbacks.Generic {
			let _eventOnUpdatePosition = undefined;
			const _middlewareArray = [];

			if (options.autoPlacement) {
				_middlewareArray.push(window.FloatingUIDOM.autoPlacement());
			}

			if (options.useShift) {
				_middlewareArray.push(window.FloatingUIDOM.shift());
			}

			_eventOnUpdatePosition = () => {
				window.FloatingUIDOM.computePosition(options.anchorElem, options.floatingElem, {
					placement: options.position,
					middleware: _middlewareArray,
				}).then(({ x, y }) => {
					OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
						options.floatingElem,
						'--floating-position-y',
						OSFramework.OSUI.Helper.GetRoundPixelRatio(y) + 'px'
					);
					OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
						options.floatingElem,
						'--floating-position-x',
						OSFramework.OSUI.Helper.GetRoundPixelRatio(x) + 'px'
					);
					// Object.assign(options.floatingElem.style, {
					// 	top: `${y}px`,
					// 	left: `${x}px`,
					// });
				});
			};

			_eventOnUpdatePosition();

			if (options.updatePosition) {
				const _eventOnUpdate = () => {
					window.FloatingUIDOM.autoUpdate(
						options.anchorElem,
						options.floatingElem,
						_eventOnUpdatePosition.bind(this)
					);
				};

				_eventOnUpdate();

				return _eventOnUpdate;
			}
		}
	}
}
