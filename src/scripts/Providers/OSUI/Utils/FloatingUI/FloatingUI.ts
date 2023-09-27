// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.Utils {
	/**
	 * Floating UI Class to handle the Floating UI provider utils
	 *
	 * @export
	 * @class FloatingUI
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class FloatingUI extends OSFramework.OSUI.Utils.FloatingPosition.FloatingPosition {
		/**
		 * Creates an instance of FloatingUI.
		 * @param {FloatingUIConfig} options
		 * @memberof FloatingUI
		 */
		constructor(options: FloatingUIConfig) {
			super(options);
		}

		/**
		 * Method to destroy the FloatingUI
		 *
		 * @memberof FloatingUI
		 */
		public dispose(): void {
			if (this.floatingConfigs.UpdatePosition) {
				this.eventOnUpdateCallback();
			}

			super.dispose();
		}

		/**
		 * Method to call the FloatingUI provider
		 *
		 * @memberof FloatingUI
		 */
		public setFloatingPosition(): void {
			// Store the middleware to be added on the FloatingUI
			const _middlewareArray = [];

			// If autoPlacement is true, add it to middleware
			if (this.floatingConfigs.AutoPlacement) {
				// Check if alignment is not empty, otherwise set it to null
				if (this.floatingConfigs.AutoPlacementOptions.alignment === OSFramework.OSUI.Constants.EmptyString) {
					this.floatingConfigs.AutoPlacementOptions.alignment = null;
				}

				// Check if allowedPlacements is empty. If it is, then add a default placement, as it is mandatory
				if (this.floatingConfigs.AutoPlacementOptions.allowedPlacements.length <= 0) {
					this.floatingConfigs.AutoPlacementOptions.allowedPlacements.push(
						OSFramework.OSUI.GlobalEnum.FloatingPosition.BottomStart
					);
				}

				_middlewareArray.push(window.FloatingUIDOM.autoPlacement(this.floatingConfigs.AutoPlacementOptions));
				// Make sure to also use shift for better auto behaviour
				_middlewareArray.push(window.FloatingUIDOM.shift());
			}

			// Add offset value to middleware
			if (this.floatingConfigs.Position !== OSFramework.OSUI.GlobalEnum.FloatingPosition.Center) {
				_middlewareArray.push(window.FloatingUIDOM.offset(this.getOffsetValue()));
			}

			// Set the computePosition method. This is the main provider method to set the balloon position
			const _eventOnUpdatePosition = () => {
				window.FloatingUIDOM.computePosition(
					this.floatingConfigs.AnchorElem,
					this.floatingConfigs.FloatingElem,
					{
						placement: this.floatingConfigs.Position,
						middleware: _middlewareArray,
					}
				).then(({ x, y }) => {
					// Update the Balloon CSS Variables with the returned optimal x & y for position
					OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
						this.floatingConfigs.FloatingElem,
						OSFramework.OSUI.Utils.FloatingPosition.Enum.CssCustomProperties.YPosition,
						y + OSFramework.OSUI.GlobalEnum.Units.Pixel
					);
					OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
						this.floatingConfigs.FloatingElem,
						OSFramework.OSUI.Utils.FloatingPosition.Enum.CssCustomProperties.XPosition,
						x + OSFramework.OSUI.GlobalEnum.Units.Pixel
					);
				});
			};

			// Set the position
			_eventOnUpdatePosition();

			// If updatePosition is used, set a callback to run autoUpdate method. This is also used to then clean-up on destroy
			if (this.floatingConfigs.UpdatePosition) {
				this.eventOnUpdateCallback = window.FloatingUIDOM.autoUpdate(
					this.floatingConfigs.AnchorElem,
					this.floatingConfigs.FloatingElem,
					_eventOnUpdatePosition.bind(this)
				);
			}
		}

		/**
		 * Method to run when the target closes. This will clean listeners on the provider side and stop observing the target
		 *
		 * @memberof FloatingUI
		 */
		public unsetFloatingPosition(): void {
			this.eventOnUpdateCallback();
			// SetTimeout used to make sure we reset the variables, after the floatingUI finsishes cleaning it up
			OSFramework.OSUI.Helper.ApplySetTimeOut(() => {
				OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
					this.floatingConfigs.FloatingElem,
					OSFramework.OSUI.Utils.FloatingPosition.Enum.CssCustomProperties.YPosition,
					0
				);
				OSFramework.OSUI.Helper.Dom.Styles.SetStyleAttribute(
					this.floatingConfigs.FloatingElem,
					OSFramework.OSUI.Utils.FloatingPosition.Enum.CssCustomProperties.XPosition,
					0
				);
			}, 50);
		}
	}
}
