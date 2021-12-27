// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Search {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class Search extends AbstractPattern<SearchConfig> implements ISearch {
		// Store the pattern locals
		private _eventSearchGlassClick: Callbacks.Generic;
		private _globalEventBody: Callbacks.Generic;
		private _inputElem: HTMLInputElement;
		private _inputValue: string;
		private _isOpen = false;
		private _platformEventCollapse: Callbacks.OSSearchCollapseEvent;
		private _searchGlass: HTMLElement;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new SearchConfig(configs));
		}

		private _bodyClickCallback(e: MouseEvent): void {
			const _clickedElem: HTMLElement = e.target as HTMLElement;
			const _closestElem: HTMLElement = _clickedElem.closest(Constants.Dot + Enum.CssProperty.Pattern);

			// If the click has occur outside of this tooltip
			if (_closestElem !== this._selfElem && _closestElem !== this._searchGlass) {
				// Close Search
				this.close();
				e.stopPropagation();
			}
		}

		// Check input value on search
		private _checkInputValue(): void {
			this._inputValue = this._inputElem.value;
		}

		// Trigger the search at toggle behaviour
		private _onToggle(e: MouseEvent): void {
			// Check in input has value
			this._checkInputValue();

			// Toggle the search classes
			if (this._isOpen) {
				this.close();
			} else {
				this.open();
			}

			e.stopPropagation();
		}

		private _triggerPlatformEvent(): void {
			Helper.AsyncInvocation(this._platformEventCollapse, this.widgetId);
		}

		protected setA11yProperties(): void {
			Helper.Attribute.Set(
				this._selfElem,
				Constants.A11YAttributes.Role.AttrName,
				Constants.A11YAttributes.Role.Search
			);
		}

		protected setCallbacks(): void {
			this._eventSearchGlassClick = this._onToggle.bind(this);
			this._globalEventBody = this._bodyClickCallback.bind(this);
			// Add events only in Native Applications
			if (Helper.DeviceInfo.IsNative) {
				this._searchGlass.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventSearchGlassClick);

				if (this._isOpen) {
					Event.GlobalEventManager.Instance.addHandler(Event.Type.BodyOnClick, this._globalEventBody);
				}
			}
		}

		protected setHtmlElements(): void {
			this._inputElem = Helper.Dom.TagSelector(this._selfElem, GlobalEnum.HTMLElement.Input) as HTMLInputElement;
			this._searchGlass = Helper.Dom.ClassSelector(this._selfElem, Enum.CssProperty.SearchGlass);
		}
		protected setInitialStates(): void {
			if (Helper.DeviceInfo.IsNative && this._inputValue !== '') {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssProperty.PatternIsOpen);

				this._inputElem.focus();

				this._isOpen = true;
			}
		}

		protected unsetCallbacks(): void {
			// Add events only in Native Applications
			if (Helper.DeviceInfo.IsNative) {
				this._searchGlass.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventSearchGlassClick);

				if (this._isOpen) {
					Event.GlobalEventManager.Instance.removeHandler(Event.Type.BodyOnClick, this._globalEventBody);
				}
			}

			this._eventSearchGlassClick = undefined;
			this._globalEventBody = undefined;
		}

		protected unsetHtmlElements(): void {
			this._inputElem = undefined;
			this._searchGlass = undefined;
		}

		public build(): void {
			super.build();

			this.setHtmlElements();

			this._checkInputValue();

			this.setInitialStates();

			this.setA11yProperties();

			this.setCallbacks();

			this.finishBuild();
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		public changeProperty(propertyName: string, propertyValue: any): void {
			super.changeProperty(propertyName, propertyValue);
		}

		// Close Search
		public close(): void {
			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssProperty.PatternIsOpen);

			Event.GlobalEventManager.Instance.removeHandler(Event.Type.BodyOnClick, this._globalEventBody);

			this._inputElem.blur();

			this._triggerPlatformEvent();

			this._isOpen = false;
		}

		// Destroy the Search
		public dispose(): void {
			this.unsetCallbacks();
			this.unsetHtmlElements();
			//Destroying the base of pattern
			super.dispose();
		}

		// Open Search
		public open(): void {
			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssProperty.PatternIsOpen);

			Event.GlobalEventManager.Instance.addHandler(Event.Type.BodyOnClick, this._globalEventBody);
			this._inputElem.focus();

			this._isOpen = true;
		}

		// Set callbacks for the OnCollapse event
		public registerCallback(callback: Callbacks.OSSearchCollapseEvent): void {
			if (this._platformEventCollapse === undefined) {
				this._platformEventCollapse = callback;
			}
		}
	}
}
