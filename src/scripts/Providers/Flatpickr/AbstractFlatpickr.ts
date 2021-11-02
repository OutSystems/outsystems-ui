// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Providers.Flatpickr {
	export abstract class AbstractFlatpickr<C extends Flatpickr.AbstractFlatpickrConfig>
		extends OSUIFramework.Patterns.DatePicker.AbstractDatePicker<C>
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		implements IFlatpickr, OSUIFramework.Interface.IProviderPattern<Flatpickr>
	{
		// Store the provider target element
		protected _datePickerProviderElem: HTMLElement;
		// Store the provider reference
		protected _flatpickr: Flatpickr;
		// Store the flatpickr html element that will be added by library
		protected _flatpickrInputElem: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: C) {
			super(uniqueId, configs);
		}

		// Method to set the html elements used
		private _setHtmllElements(): void {
			// Set the inputHTML element
			this._datePickerProviderElem = document.getElementById(this._configs.InputWidgetId);
		}

		// Trigger the jumToDate to now
		private _todayBtnClick() {
			this._flatpickr.jumpToDate(this._flatpickr.now);
		}

		// Method used to add the TodayButton at calendar
		protected _addTodayBtn(): void {
			const todayBtn = document.createElement(OSUIFramework.GlobalEnum.HTMLElement.Link);
			todayBtn.innerHTML = Enum.TodayBtn.Text;
			todayBtn.classList.add(Enum.TodayBtn.Selector);
			todayBtn.addEventListener(OSUIFramework.GlobalEnum.HTMLEvent.Click, this._todayBtnClick.bind(this));
			this._flatpickr.calendarContainer.appendChild(todayBtn);
		}

		public build(): void {
			super.build();

			this._setHtmllElements();
		}

		// Method to remove and destroy DatePicker instance
		public dispose(): void {
			// Check if provider is ready
			if (this.isBuilt) {
				this._flatpickr.destroy();
			}

			super.dispose();
		}

		// Provider getter
		// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
		public get provider(): Flatpickr {
			return this._flatpickr;
		}

		public abstract registerProviderCallback(eventName: string, callback: OSUIFramework.Callbacks.OSGeneric): void;
	}
}
