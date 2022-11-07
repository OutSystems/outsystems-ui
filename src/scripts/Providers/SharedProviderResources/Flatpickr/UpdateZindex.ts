// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.SharedProviderResources.Flatpickr {
	export class UpdateZindex {
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
			// Increase the zindex applied on pattern in 1 point
			const increaseZindexPoint = 1;
			let newZindexValue;
			let patternName;
			let updatePickerPosition = false;

			if (this._picker.selfElement.closest(OSFramework.Constants.Dot + Enum.PickersException.BottomSheet)) {
				updatePickerPosition = true;
				patternName = Enum.PatternNameException.BottomSheet;
			} else if (
				this._picker.selfElement.closest(OSFramework.Constants.Dot + Enum.PickersException.Notification)
			) {
				updatePickerPosition = true;
				patternName = Enum.PatternNameException.Notification;
			} else if (this._picker.selfElement.closest(OSFramework.Constants.Dot + Enum.PickersException.Popup)) {
				updatePickerPosition = true;
				patternName = Enum.PatternNameException.Popup;
			} else if (this._picker.selfElement.closest(OSFramework.Constants.Dot + Enum.PickersException.Sidebar)) {
				updatePickerPosition = true;
				patternName = Enum.PatternNameException.Sidebar;
			}

			if (updatePickerPosition) {
				// Set the new z-index to be applied
				newZindexValue =
					parseInt(
						getComputedStyle(document.documentElement).getPropertyValue('--' + patternName + '-zindex')
					) + increaseZindexPoint;

				// Update the CSS variable on picker element
				OSFramework.Helper.Dom.Styles.SetStyleAttribute(
					this._picker.selfElement,
					Enum.CSSVariables.FlatpickrOpenZindex,
					newZindexValue
				);
				OSFramework.Helper.Dom.Styles.SetStyleAttribute(
					this._picker.provider.calendarContainer,
					Enum.CSSVariables.FlatpickrOpenZindex,
					newZindexValue
				);

				// Add the z-index class to pickers elements
				OSFramework.Helper.Dom.Styles.AddClass(this._picker.selfElement, Enum.PickersException.Zindex);
				OSFramework.Helper.Dom.Styles.AddClass(
					this._picker.provider.calendarContainer,
					Enum.PickersException.Zindex
				);

				console.log('here');
			}
		}
	}
}
