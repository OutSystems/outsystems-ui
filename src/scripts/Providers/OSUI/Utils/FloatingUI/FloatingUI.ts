// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Utils {
	export type FloatingUIOptions = {
		anchorElem: HTMLElement;
		autoPlacement: boolean;
		autoPlacementOptions: AutoPlacementOptions;
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

		private _getOffsetValue(): number {
			return parseInt(
				getComputedStyle(this._floatingUIOptions.anchorElem).getPropertyValue(
					Utils.Enum.CssCustomProperties.Offset
				)
			);
		}

		private _setFloatingPosition(): void {
			let _eventOnUpdatePosition = undefined;
			const _middlewareArray = [];

			if (this._floatingUIOptions.autoPlacement) {
				if (this._floatingUIOptions.autoPlacementOptions.aligment === '') {
					this._floatingUIOptions.autoPlacementOptions.aligment = null;
				}

				if (this._floatingUIOptions.autoPlacementOptions.allowedPlacements.length <= 0) {
					this._floatingUIOptions.autoPlacementOptions.allowedPlacements.push(
						OSFramework.OSUI.GlobalEnum.FloatingPosition.BottomStart
					);
				}

				_middlewareArray.push(window.FloatingUIDOM.autoPlacement(this._floatingUIOptions.autoPlacementOptions));
			}

			if (this._floatingUIOptions.useShift) {
				_middlewareArray.push(window.FloatingUIDOM.shift());
			}

			_middlewareArray.push(window.FloatingUIDOM.offset(this._getOffsetValue()));

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
						Enum.CssCustomProperties.YPosition,
						OSFramework.OSUI.Helper.GetRoundPixelRatio(y) + OSFramework.OSUI.GlobalEnum.Units.Pixel
					);
					OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
						this._floatingUIOptions.floatingElem,
						Enum.CssCustomProperties.XPosition,
						OSFramework.OSUI.Helper.GetRoundPixelRatio(x) + OSFramework.OSUI.GlobalEnum.Units.Pixel
					);
				});
			};

			_eventOnUpdatePosition();

			if (this._floatingUIOptions.updatePosition) {
				this.eventOnUpdateCallback = window.FloatingUIDOM.autoUpdate(
					this._floatingUIOptions.anchorElem,
					this._floatingUIOptions.floatingElem,
					_eventOnUpdatePosition.bind(this)
				);
			}
		}

		public build(): void {
			this._setFloatingPosition();
		}

		public close(): void {
			this.eventOnUpdateCallback();
			setTimeout(() => {
				OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
					this._floatingUIOptions.floatingElem,
					Enum.CssCustomProperties.YPosition,
					0
				);
				OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
					this._floatingUIOptions.floatingElem,
					Enum.CssCustomProperties.XPosition,
					0
				);
			}, 50);
		}

		public dispose(): void {
			if (this._floatingUIOptions.updatePosition) {
				this.eventOnUpdateCallback();
			}
		}

		public update(options: FloatingUIOptions): void {
			this._floatingUIOptions = options;
			this.build();
		}
	}
}
