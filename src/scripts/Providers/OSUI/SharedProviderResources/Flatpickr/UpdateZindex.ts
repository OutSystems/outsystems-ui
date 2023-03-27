// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.OSUI.SharedProviderResources.Flatpickr {
	export class UpdateZindex {
		// Store the pattern exceptions properties
		private _patternExceptions = [
			{ name: 'BottomSheet', class: { get: 'osui-bottom-sheet', set: 'inside-bottom-sheet' } },
			{ name: 'Notification', class: { get: 'osui-notification', set: 'inside-notification' } },
			{ name: 'Popup', class: { get: 'popup-backdrop', set: 'inside-popup' } },
			{ name: 'Sidebar', class: { get: 'osui-sidebar', set: 'inside-sidebar' } },
		];
		// Store the picker instance
		private _picker:
			| Datepicker.Flatpickr.IFlatpickr
			| TimePicker.Flatpickr.IFlatpickrTime
			| MonthPicker.Flatpickr.IFlatpickrMonth;

		constructor(
			picker:
				| Datepicker.Flatpickr.IFlatpickr
				| TimePicker.Flatpickr.IFlatpickrTime
				| MonthPicker.Flatpickr.IFlatpickrMonth
		) {
			// Set picker object
			this._picker = picker;

			// Validate the zindex position
			this._updateZindex();
		}

		// Update the calendar position
		private _updateZindex(): void {
			// Check if pickers are inside of list of exceptions
			for (const pattern of this._patternExceptions) {
				if (this._picker.selfElement.closest(OSFramework.OSUI.Constants.Dot + pattern.class.get)) {
					// Add the inside classes to pickers elements
					OSFramework.OSUI.Helper.Dom.Styles.AddClass(this._picker.selfElement, pattern.class.set);
					OSFramework.OSUI.Helper.Dom.Styles.AddClass(
						this._picker.provider.calendarContainer,
						pattern.class.set
					);
					break;
				}
			}
		}
	}
}
