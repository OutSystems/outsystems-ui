// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Sidebar {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Sidebar extends AbstractPattern<SidebarConfig> implements ISidebar {
		// Store the Sidebar direction
		private _direction: string;
		// Store if the Sidebar has Overlay
		private _hasOverlay: boolean;
		// Store if the Sidebar is Open
		private _isOpen: boolean;
		// Store if the Sidebar is Open
		private _onToggle: Callbacks.OSSidebarToggleEvent;
		// Store the Sidebar Aside element
		private _sidebarAsideElem: HTMLElement;
		// Store the Sidebar Content element
		private _sidebarContentElem: HTMLElement;
		// Store the Sidebar Header element
		private _sidebarHeaderElem: HTMLElement;
		// Store the Sidebar Overlay element
		private _sidebarOverlayElem: HTMLElement;
		// Store the Sidebar width
		private _width: string;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new SidebarConfig(configs));

			this._isOpen = this._configs.IsOpen;
			this._direction = this._configs.Direction;
			this._hasOverlay = this._configs.HasOverlay;
			this._width = this._configs.Width;
		}

		private _setAccessibilityProps(isOpen: boolean): void {
			Helper.Attribute.Set(this._sidebarAsideElem, 'role', 'complementary');
			Helper.Attribute.Set(this._sidebarAsideElem, 'aria-haspopup', 'true');
			Helper.Attribute.Set(this._sidebarAsideElem, 'tabindex', isOpen ? '0' : '-1');
			Helper.Attribute.Set(this._sidebarAsideElem, 'aria-hidden', isOpen ? 'false' : 'true');
		}

		// Set the html references that will be used to manage the cssClasses and atribute properties
		private _setHtmlElements(): void {
			this._sidebarAsideElem = this._selfElem.querySelector('.' + Enum.SidebarCssClass.Aside);
			this._sidebarHeaderElem = this._selfElem.querySelector('.' + Enum.SidebarCssClass.Header);
			this._sidebarContentElem = this._selfElem.querySelector('.' + Enum.SidebarCssClass.Content);
			this._sidebarOverlayElem = this._selfElem.querySelector('.' + Enum.SidebarCssClass.Overlay);
		}

		// Set the cssClasses that should be assigned to the element on it's initialization
		private _setInitialCssClasses(): void {
			// Set IsOpen class
			if (this._isOpen) {
				Helper.Style.AddClass(this._selfElem, Enum.SidebarCssClass.IsOpen);
			}

			// Set the direction class
			if (this._direction !== '') {
				Helper.Style.AddClass(this._selfElem, Enum.SidebarCssClass.Direction + this._configs.Direction);
			}

			if (this._width !== '') {
				Helper.Style.SetStyleAttribute(this._selfElem, Enum.CssProperty.Width, this._configs.Width);
			}

			// Set the overlay class
			if (this._hasOverlay) {
				Helper.Style.AddClass(this._selfElem, Enum.SidebarCssClass.HasOverlay);
			}

			// Set default ExtendedClass values
			if (this._configs.ExtendedClass !== '') {
				this.updateExtendedClass(this._configs.ExtendedClass, this._configs.ExtendedClass);
			}
		}

		// Method that triggers the OnToggle event
		private _triggerOnToggleEvent(isOpen: boolean): void {
			if (this._onToggle !== undefined) {
				setTimeout(() => {
					this._onToggle(this.widgetId, isOpen);
				}, 0);
			}
		}

		public build(): void {
			super.build();

			this._setHtmlElements();

			this._setInitialCssClasses();

			this._setAccessibilityProps(this._isOpen);

			this.setWidth(this._width);

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			if (Enum.Properties[propertyName] && this._configs.hasOwnProperty(propertyName)) {
				// Check which property changed and call respective method to update it
				switch (propertyName) {
					case Enum.Properties.IsOpen:
						this.toggleSidebar(propertyValue);

						this._configs.IsOpen = propertyValue;
						break;
					case Enum.Properties.Direction:
						this.setDirection(propertyValue);

						this._configs.Direction = propertyValue;
						break;
					case Enum.Properties.Width:
						this.setWidth(propertyValue);

						this._configs.Width = propertyValue;
						break;
					case Enum.Properties.HasOverlay:
						this.setHasOverlay(propertyValue);

						this._hasOverlay = propertyValue;
						break;
					case Enum.Properties.ExtendedClass:
						this.updateExtendedClass(this._configs.ExtendedClass, propertyValue);

						this._configs.ExtendedClass = propertyValue;
						break;
				}
			} else {
				throw new Error(`changeProperty - Property '${propertyName}' can't be changed.`);
			}
		}

		// Set callbacks for the onToggle event
		public registerCallback(callback: Callbacks.OSSidebarToggleEvent): void {
			this._onToggle = callback;
		}

		public setDirection(direction: string): void {
			if (this._direction !== '') {
				Helper.Style.RemoveClass(this._selfElem, Enum.SidebarCssClass.Direction + this._configs.Direction);
			}

			Helper.Style.AddClass(this._selfElem, Enum.SidebarCssClass.Direction + direction);
			this._direction = direction;
		}

		public setHasOverlay(hasOverlay: boolean): void {
			const alreadyHasOverlayClass = Helper.Style.ContainsClass(this._selfElem, Enum.SidebarCssClass.HasOverlay);

			if (hasOverlay && !alreadyHasOverlayClass) {
				Helper.Style.AddClass(this._selfElem, Enum.SidebarCssClass.HasOverlay);
			} else {
				Helper.Style.RemoveClass(this._selfElem, Enum.SidebarCssClass.HasOverlay);
			}

			this._hasOverlay = hasOverlay;
		}

		public setWidth(width: string): void {
			Helper.Style.SetStyleAttribute(this._selfElem, Enum.CssProperty.Width, width);
			this._width = width;
		}

		public toggleSidebar(isOpen: boolean): void {
			// Toggle event listeners missing
			isOpen
				? Helper.Style.AddClass(this._selfElem, Enum.SidebarCssClass.IsOpen)
				: Helper.Style.RemoveClass(this._selfElem, Enum.SidebarCssClass.IsOpen);

			this._isOpen = isOpen;
			this._setAccessibilityProps(isOpen);
			this._triggerOnToggleEvent(isOpen);
		}
	}
}
