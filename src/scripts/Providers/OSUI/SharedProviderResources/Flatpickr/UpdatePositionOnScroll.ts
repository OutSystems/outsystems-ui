// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.SharedProviderResources.Flatpickr {
	export class UpdatePositionOnScroll {
		// Indicates wether the picker is a time picker or other type of picker (Month, Date, DateTime).
		private _isTimePicker: boolean;
		// Event OnScreenScroll
		private _onScrollEvent: OSFramework.OSUI.GlobalCallbacks.Generic;
		// Store the parent Sidebar instance if any
		private _parentSidebar: HTMLElement;
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
			// Set parent Sidebar
			this._parentSidebar = picker.selfElement.closest(
				`${OSFramework.OSUI.Constants.Dot}${OSFramework.OSUI.Patterns.Sidebar.Enum.CssClass.Content}`
			);
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
					/**
					 * This condition checks if the active element is not a child of the calendar container.
					 * This is necessary due to the design of active-screen and content containers in both web
					 * and native mobile app environments, where `overflow-y` is set to `auto`. This setting
					 * allows content to be scrollable even when a picker is open in native apps, which could
					 * lead to unintended scrolling of the entire screen, including the header, when interacting
					 * with the picker. To prevent this, the calendar's position is updated to remain in view
					 * during scroll events.
					 *
					 * However, this behavior is excluded for the timepicker. When the timepicker is triggered
					 * (e.g., by focusing on an input field), the appearance of the keyboard may cause the page
					 * to scroll. In this scenario, we avoid closing the timepicker to maintain user interaction
					 * continuity.
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
						this._requestAnimationOnBodyScroll = requestAnimationFrame(this._onScrollEvent);
					} else if (this._requestAnimationOnBodyScroll !== undefined) {
						cancelAnimationFrame(this._requestAnimationOnBodyScroll);
					}
				}
			}
		}

		// Method used to set callbacks
		private _setCallbacks(): void {
			this._onScrollEvent = this._onScreenScroll.bind(this);
		}

		// Add Events
		private _setUpEvents(): void {
			// Add the BodyScroll callback that will be used to update the balloon coordinates
			OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.addHandler(
				OSFramework.OSUI.Event.DOMEvents.Listeners.Type.ScreenOnScroll,
				this._onScrollEvent
			);
			// If the picker is inside a Sidebar, let's add the method to the Sidebar content as well.
			if (this._parentSidebar) {
				this._parentSidebar.addEventListener(OSFramework.OSUI.GlobalEnum.HTMLEvent.Scroll, this._onScrollEvent);
			}
		}

		// Method used to unset callbacks
		private _unsetCallbacks(): void {
			this._onScrollEvent = undefined;
		}

		// Remove Added Events
		private _unsetEvents(): void {
			OSFramework.OSUI.Event.DOMEvents.Listeners.GlobalListenerManager.Instance.removeHandler(
				OSFramework.OSUI.Event.DOMEvents.Listeners.Type.ScreenOnScroll,
				this._onScrollEvent
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

			this._onScrollEvent = undefined;
			this._requestAnimationOnBodyScroll = undefined;
		}
	}
}
