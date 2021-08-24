// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Sidebar {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Sidebar extends AbstractPattern<SidebarConfig> implements ISidebar {
		// Store if the Siebar is Open
		private _isOpen: boolean;
		// Store the Sidebar Content element
		private _sidebarContentElem: HTMLElement;
		// Store the Sidebar Header element
		private _sidebarHeaderElem: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new SidebarConfig(configs));

			this._isOpen = this._configs.IsOpen;
		}

		// Set the html references that will be used to manage the cssClasses and atribute properties
		private _setHtmlElements(): void {
			this._sidebarHeaderElem = this._selfElem.querySelector('.' + Enum.SidebarCssClass.Header);
			this._sidebarContentElem = this._selfElem.querySelector('.' + Enum.SidebarCssClass.Content);
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set IsOpen class
			if (this._isOpen) {
				Helper.Style.AddClass(this._selfElem, Enum.SidebarCssClass.IsOpen);
			}

			// Set default ExtendedClass values
			if (this._configs.ExtendedClass !== '') {
				this.updateExtendedClass(this._configs.ExtendedClass, this._configs.ExtendedClass);
			}
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setInitialCssClasses();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			if (Enum.Properties[propertyName] && this._configs.hasOwnProperty(propertyName)) {
				// Check which property changed and call respective method to update it
				switch (propertyName) {
					case Enum.Properties.ExtendedClass:
				}
			} else {
				throw new Error(`changeProperty - Property '${propertyName}' can't be changed.`);
			}
		}

		// Set callbacks for the onSelect click event
		public registerCallback(callback: Callbacks.OSRatingSelectEvent): void {
			//this._onSelect = callback;
		}
	}
}
