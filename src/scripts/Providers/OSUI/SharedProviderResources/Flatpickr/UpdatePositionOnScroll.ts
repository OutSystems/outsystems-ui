// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.SharedProviderResources.Flatpickr {
	export class UpdatePositionOnScroll {
		// Event OnScreenScroll
		private _onScreenScrollEvent: OSFramework.OSUI.GlobalCallbacks.Generic;
		// Store the picker instance
		private _picker:
			| Datepicker.Flatpickr.IFlatpickr
			| TimePicker.Flatpickr.IFlatpickrTime
			| MonthPicker.Flatpickr.IFlatpickrMonth;
		// Store the RequestAnimationFrame that will be triggered at OnBodyScroll
		private _requestAnimationOnBodyScroll: number;

		constructor(
			picker:
				| Datepicker.Flatpickr.IFlatpickr
				| TimePicker.Flatpickr.IFlatpickrTime
				| MonthPicker.Flatpickr.IFlatpickrMonth
		) {
			// Set picker object
			this._picker = picker;
			// Set onBodyScrollEvent callback
			this._setCallbacks();
			// Set the Events
			this._setUpEvents();
		}

		// Update the calendar position
		private _onScreenScroll(): void {
			if (this._picker.isBuilt) {
				// Check if IsPhone
				if (OSFramework.OSUI.Helper.DeviceInfo.IsPhone) {
					// Close it if it's open!
					if (this._picker.provider.isOpen) {
						this._picker.provider.close();
					}
				} else {
					// Since it's at desktop or tablet, update it's position if it's open!
					if (this._picker.provider.isOpen) {
						// trigger provider update position method
						this._picker.provider._positionCalendar();
						// Update the "position" before the next "repaint"
						this._requestAnimationOnBodyScroll = requestAnimationFrame(this._onScreenScrollEvent);
					} else {
						cancelAnimationFrame(this._requestAnimationOnBodyScroll);
					}
				}
			}
		}

		// Method used to set callbacks
		private _setCallbacks(): void {
			this._onScreenScrollEvent = this._onScreenScroll.bind(this);
		}

		// Add Events
		private _setUpEvents(): void {
			// Add the BodyScroll callback that will be used to update the balloon coodinates
			OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
				OSFramework.OSUI.Event.DOMEvents.Listeners.Type.ScreenOnScroll,
				this._onScreenScrollEvent
			);
		}

		// Method used to unset callbacks
		private _unsetCallbacks(): void {
			this._onScreenScrollEvent = undefined;
		}

		// Remove Added Events
		private _unsetEvents(): void {
			OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				OSFramework.OSUI.Event.DOMEvents.Listeners.Type.ScreenOnScroll,
				this._onScreenScrollEvent
			);
		}

		/**
		 * Method to remove and destroy instance events and properties!
		 *
		 * @memberof Providers.OSUI.SharedProviderResources.Flatpickr.UpdatePositionOnScroll
		 */
		public dispose(): void {
			this._unsetEvents();
			this._unsetCallbacks();

			this._onScreenScrollEvent = undefined;
			this._requestAnimationOnBodyScroll = undefined;
		}
	}
}
