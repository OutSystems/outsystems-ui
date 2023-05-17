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
	export class FloatingUI {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _floatingUIOptions: FloatingUIOptions;
		public eventOnUpdateCallback: OSFramework.OSUI.GlobalCallbacks.Generic;

		constructor(options: FloatingUIOptions) {
			this._floatingUIOptions = options;
			this.build();
		}

		private _setFloatingPosition(): void {
			let _eventOnUpdatePosition = undefined;
			const _middlewareArray = [];

			if (this._floatingUIOptions.autoPlacement) {
				_middlewareArray.push(window.FloatingUIDOM.autoPlacement());
			}

			if (this._floatingUIOptions.useShift) {
				_middlewareArray.push(window.FloatingUIDOM.shift());
			}

			_eventOnUpdatePosition = () => {
				window.FloatingUIDOM.computePosition(
					this._floatingUIOptions.anchorElem,
					this._floatingUIOptions.floatingElem,
					{
						placement: this._floatingUIOptions.position,
						middleware: _middlewareArray,
					}
				).then(({ x, y }) => {
					OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
						this._floatingUIOptions.floatingElem,
						'--floating-position-y',
						OSFramework.OSUI.Helper.GetRoundPixelRatio(y) + 'px'
					);
					OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
						this._floatingUIOptions.floatingElem,
						'--floating-position-x',
						OSFramework.OSUI.Helper.GetRoundPixelRatio(x) + 'px'
					);
				});
			};

			_eventOnUpdatePosition();

			if (this._floatingUIOptions.updatePosition) {
				this.eventOnUpdateCallback = () => {
					window.FloatingUIDOM.autoUpdate(
						this._floatingUIOptions.anchorElem,
						this._floatingUIOptions.floatingElem,
						_eventOnUpdatePosition.bind(this)
					);
				};

				this.eventOnUpdateCallback();
			}
		}

		public build(): void {
			this._setFloatingPosition();
		}

		public dispose(): void {
			if (this._floatingUIOptions.updatePosition) {
				this.eventOnUpdateCallback();
			}

			this._floatingUIOptions = undefined;
		}

		public update(options: FloatingUIOptions): void {
			this._floatingUIOptions = options;
			this.build();
		}
	}
}
