// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Utils {
	// FloatingUI options type
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
		// Store the update callback
		private _eventOnUpdateCallback: OSFramework.OSUI.GlobalCallbacks.Generic;
		// Store the FloatingUI options
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private _floatingUIOptions: FloatingUIOptions;

		constructor(options: FloatingUIOptions) {
			this._floatingUIOptions = options;
			this.build();
		}

		// Method to get the offset value expected form FloatingUI. This will get the value from the CSS Variable, so that if changes are made on CSS
		// the CSS reacts accordingly on the next time it opens the Balloon
		private _getOffsetValue(): number {
			return parseInt(
				getComputedStyle(this._floatingUIOptions.anchorElem).getPropertyValue(
					Utils.Enum.CssCustomProperties.Offset
				)
			);
		}

		// Method to init the FloatingUI provider
		private _setFloatingPosition(): void {
			// Store the middleware to be added on the FloatingUI
			const _middlewareArray = [];

			// If autoPlacement is true, add it to middleware
			if (this._floatingUIOptions.autoPlacement) {
				// Check if alignment is not empty, otherwise set it to null
				if (this._floatingUIOptions.autoPlacementOptions.alignment === '') {
					this._floatingUIOptions.autoPlacementOptions.alignment = null;
				}

				// Check if allowedPlacements is empty. If it is, then add a default placement, as it is mandatory
				if (this._floatingUIOptions.autoPlacementOptions.allowedPlacements.length <= 0) {
					this._floatingUIOptions.autoPlacementOptions.allowedPlacements.push(
						OSFramework.OSUI.GlobalEnum.FloatingPosition.BottomStart
					);
				}

				_middlewareArray.push(window.FloatingUIDOM.autoPlacement(this._floatingUIOptions.autoPlacementOptions));
			}

			// If useShift is true, add it to middleware
			if (this._floatingUIOptions.useShift) {
				_middlewareArray.push(window.FloatingUIDOM.shift());
			}

			// Add offset value to middleware
			_middlewareArray.push(window.FloatingUIDOM.offset(this._getOffsetValue()));

			// Set the computePosition method. This is the main provider method to set the balloon position
			const _eventOnUpdatePosition = () => {
				window.FloatingUIDOM.computePosition(
					this._floatingUIOptions.anchorElem,
					this._floatingUIOptions.floatingElem,
					{
						placement: this._floatingUIOptions.position,
						middleware: _middlewareArray,
					}
				).then(({ x, y }) => {
					// Update the Balloon CSS Variables with the returned optimal x & y for position
					OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
						this._floatingUIOptions.floatingElem,
						Enum.CssCustomProperties.YPosition,
						y + OSFramework.OSUI.GlobalEnum.Units.Pixel
					);
					OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
						this._floatingUIOptions.floatingElem,
						Enum.CssCustomProperties.XPosition,
						x + OSFramework.OSUI.GlobalEnum.Units.Pixel
					);
				});
			};

			// Set the position
			_eventOnUpdatePosition();

			// If updatePosition is used, set a callback to run autoUpdate method. This is also used to then clean-up on destroy
			if (this._floatingUIOptions.updatePosition) {
				this._eventOnUpdateCallback = window.FloatingUIDOM.autoUpdate(
					this._floatingUIOptions.anchorElem,
					this._floatingUIOptions.floatingElem,
					_eventOnUpdatePosition.bind(this)
				);
			}
		}

		/**
		 * Method to build the FloatingUI
		 *
		 * @memberof FloatingUI
		 */
		public build(): void {
			this._setFloatingPosition();
		}

		/**
		 * Method to run when the Ballon closes. This will clean listeners on the provider side and stop observing the target
		 *
		 * @memberof FloatingUI
		 */
		public close(): void {
			this._eventOnUpdateCallback();
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

		/**
		 * Method to destroy the FloatingUI
		 *
		 * @memberof FloatingUI
		 */
		public dispose(): void {
			if (this._floatingUIOptions.updatePosition) {
				this._eventOnUpdateCallback();
			}
		}

		/**
		 * Method to update the FloatingUI
		 *
		 * @param {FloatingUIOptions} options
		 * @memberof FloatingUI
		 */
		public update(options: FloatingUIOptions): void {
			this._floatingUIOptions = options;
			this.build();
		}
	}
}
