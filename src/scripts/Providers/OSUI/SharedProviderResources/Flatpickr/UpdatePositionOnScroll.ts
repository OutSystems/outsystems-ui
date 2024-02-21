// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.SharedProviderResources.Flatpickr {
	export class UpdatePositionOnScroll {
		// Indicates wether the picker is a time picker or other type of picker (Month, Date, DateTime).
		private _isTimePicker: boolean;
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
			// Set if the picker is a time picker
			this._isTimePicker = this._picker instanceof TimePicker.Flatpickr.OSUIFlatpickrTime;
			// Set onBodyScrollEvent callback
			this._setCallbacks();
			// Set the Events
			this._setUpEvents();
		}

		// Update the calendar position
		private _onScreenScroll(): void {
			if (this._picker.isBuilt) {
				// Check if IsPhone
				if (this._picker.provider.isOpen && OSFramework.OSUI.Helper.DeviceInfo.IsPhone) {
					//
					/**
					 * Check if the picker is a timepicker, if so, the picker will be closed.
					 * - There this need (to check if the active element is not a child of the calendar) due the way
					 * we've now the active-screen and content containers, since once at native mobile apps both of this
					 * containers will have the overflow-y as auto, with ends on the ability to scroll the content even when
					 * at the content (native apps) is the one blocked for the picker if it's open... When scroll occurs on top
					 * of picker the entire screen (header included) will do have scroll. This approach will make calendar
					 * update it's position accordingly.
					 *
					 * Also if not a timepicker, then will check if active element is a child of the calendar container
					 */
					if (
						this._isTimePicker ||
						document.activeElement.closest(
							`${OSFramework.OSUI.Constants.Dot}${Enum.CssClasses.CalendarContainer}`
						) === this._picker.provider.calendarContainer
					) {
						// Prevents the calendar from closing and updates its position to stay in view.
						this._picker.provider._positionCalendar();
					} else {
						// Closes the calendar if the active element is outside the calendar container.
						this._picker.provider.close();
					}
				}

				// Ensure app is not running as a phone
				if (OSFramework.OSUI.Helper.DeviceInfo.IsPhone === false) {
					// Since it's at desktop or tablet, update it's position if it's open!
					if (this._picker.provider.isOpen) {
						// trigger provider update position method
						this._picker.provider._positionCalendar();
						// Update the "position" before the next "repaint"
						this._requestAnimationOnBodyScroll = requestAnimationFrame(this._onScreenScrollEvent);
					} else if (this._requestAnimationOnBodyScroll !== undefined) {
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
