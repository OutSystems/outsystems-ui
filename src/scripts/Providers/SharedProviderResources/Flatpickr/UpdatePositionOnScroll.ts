// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.SharedProviderResources.Flatpickr {
	export class UpdatePositionOnScroll {
		// Event OnBodyScroll
		private _onBodyScrollEvent: OSFramework.GlobalCallbacks.Generic;
		// Store the picker instance
		private _picker:
			| Datepicker.Flatpickr.IFlatpickr
			| Timepicker.Flatpickr.IFlatpickrTime
			| MonthPicker.Flatpickr.IFlatpickrMonth;
		// Store the RequestAnimationFrame that will be triggered at OnBodyScroll
		private _requestAnimationOnBodyScroll: number;

		constructor(
			picker:
				| Datepicker.Flatpickr.IFlatpickr
				| Timepicker.Flatpickr.IFlatpickrTime
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
		private _onBodyScroll(): void {
			if (this._picker.isBuilt) {
				// If the calendar is open!
				if (this._picker.provider.isOpen) {
					// trigger provider update position method
					this._picker.provider._positionCalendar();
					// Update the "position" before the next "repaint"
					this._requestAnimationOnBodyScroll = requestAnimationFrame(this._onBodyScrollEvent);
				} else {
					cancelAnimationFrame(this._requestAnimationOnBodyScroll);
				}
			}
		}

		// Method used to set callbacks
		private _setCallbacks(): void {
			this._onBodyScrollEvent = this._onBodyScroll.bind(this);
		}

		// Add Events
		private _setUpEvents(): void {
			// Add the BodyScroll callback that will be used to update the balloon coodinates
			OSFramework.Event.GlobalEventManager.Instance.addHandler(
				OSFramework.Event.Type.BodyOnScroll,
				this._onBodyScrollEvent
			);
		}

		// Method used to unset callbacks
		private _unsetCallbacks(): void {
			this._onBodyScrollEvent = undefined;
		}

		// Remove Added Events
		private _unsetEvents(): void {
			OSFramework.Event.GlobalEventManager.Instance.removeHandler(
				OSFramework.Event.Type.BodyOnScroll,
				this._onBodyScrollEvent
			);
		}

		/**
		 * Method to remove and destroy instance events and properties!
		 *
		 * @memberof UpdatePositionOnScroll
		 */
		public dispose(): void {
			this._unsetEvents();
			this._unsetCallbacks();

			this._onBodyScrollEvent = undefined;
			this._requestAnimationOnBodyScroll = undefined;
		}
	}
}
