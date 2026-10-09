// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Utils.FloatingPosition {
	/**
	 * Abstract FloatingPosition Class to handle the Utils related to positioning elements
	 *
	 * @abstract
	 */
	export abstract class FloatingPosition implements IFloatingPosition {
		// Store the update callback
		protected eventOnUpdateCallback: OSFramework.OSUI.GlobalCallbacks.Generic;
		// Store the FloatingPosition options
		protected floatingConfigs: FloatingPositionConfig;
		// Store if the Util is built
		protected isBuilt: boolean;

		/**
		 * Creates an instance of FloatingPosition.
		 * @param options Positioning configuration of the floating element
		 */
		constructor(options: FloatingPositionConfig) {
			this.floatingConfigs = options;
			this.build();
		}

		// Method to get the offset value expected form FloatingPosition. This will get the value from the CSS Variable, so that if changes are made on CSS
		// the CSS reacts accordingly on the next time it opens the target
		protected getOffsetValue(): number {
			return parseInt(
				getComputedStyle(this.floatingConfigs.AnchorElem).getPropertyValue(Enum.CssCustomProperties.Offset)
			);
		}

		/**
		 * Method to build the Util
		 */
		public build(): void {
			this.setFloatingPosition();
			this.isBuilt = true;
		}

		/**
		 * Method to destroy the util
		 */
		public dispose(): void {
			this.isBuilt = false;
		}

		/**
		 * Method to update the Util
		 *
		 * @param options Positioning configuration of the floating element
		 */
		public update(options: FloatingPositionConfig): void {
			this.floatingConfigs = options;
			this.setFloatingPosition();
		}

		/**
		 * Mandatory impplementation of method to set floating position
		 *
		 * @abstract
		 */
		public abstract setFloatingPosition(): void;

		/**
		 * Mandatory impplementation of method to unset floating position
		 *
		 * @abstract
		 */
		public abstract unsetFloatingPosition(): void;
	}
}
