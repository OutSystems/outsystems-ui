// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.BottomSheet {
	/**
	 *  Class that implements the BottomSheet pattern.
	 *
	 * @export
	 * @class BottomSheet
	 * @extends {AbstractPattern<BottomSheetConfig>}
	 * @implements {IBottomSheet}
	 */
	export class BottomSheet extends AbstractPattern<BottomSheetConfig> implements IBottomSheet {
		private _isOpen: boolean;
		// eslint-disable-next-line @typescript-eslint/member-ordering
		private _bottomSheetOverlayElem: HTMLElement;
		// eslint-disable-next-line @typescript-eslint/member-ordering
		private _bottomSheetContentElem: HTMLElement;
		// eslint-disable-next-line @typescript-eslint/member-ordering
		private _bottomSheetHeaderElem: HTMLElement;
		// eslint-disable-next-line @typescript-eslint/member-ordering
		private _bottomSheetTopBarElem: HTMLElement;
		// eslint-disable-next-line @typescript-eslint/member-ordering
		private _height: number;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new BottomSheetConfig(configs));
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof BottomSheet
		 */
		protected setA11yProperties(): void {
			// TODO (by CreateNewPattern) Update or Remove
		}

		protected setListeners(): void {
			this._bottomSheetContentElem.addEventListener('scroll', () => {
				if (this._bottomSheetContentElem.scrollTop === 0) {
					this._selfElem.classList.remove('osui-bottom-sheet--has-scroll');
				} else {
					this._selfElem.classList.add('osui-bottom-sheet--has-scroll');
				}
			});
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof BottomSheet
		 */
		protected setHtmlElements(): void {
			this._bottomSheetOverlayElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.PatternOverlay);
			this._bottomSheetTopBarElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternTopBar);
			this._bottomSheetContentElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternContent);
			this._bottomSheetHeaderElem = Helper.Dom.ClassSelector(this._selfElem, Enum.CssClass.PatternHeader);
		}

		protected setInitialCssClasses(): void {
			if (this.configs.ShowHandler) {
				Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.HasHandler);
			}
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof BottomSheet
		 */
		protected unsetHtmlElements(): void {
			// TODO (by CreateNewPattern) Update or Remove
		}

		/**
		 *  Builds the BottomSheet.
		 *
		 * @memberof BottomSheet
		 */
		public build(): void {
			super.build();
			this.setHtmlElements();
			this.setInitialCssClasses();
			this.setA11yProperties();
			this._height = this._selfElem.clientHeight;
			this.setListeners();
			this.finishBuild();
		}

		/**
		 * Applies the changes of state/value of the configurations.
		 *
		 * @param {string} propertyName
		 * @param {unknown} propertyValue
		 * @memberof BottomSheet
		 */
		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);
		}

		/**
		 * Disposes the current pattern.
		 *
		 * @memberof BottomSheet
		 */
		public dispose(): void {
			this.unsetHtmlElements();

			//Destroying the base of pattern
			super.dispose();
		}

		public open(): void {
			Helper.Dom.Styles.AddClass(this._selfElem, Enum.CssClass.IsOpen);
			Helper.Dom.Styles.AddClass(this._bottomSheetOverlayElem, Enum.CssClass.IsOpen);
			this._isOpen = true;
		}

		// eslint-disable-next-line @typescript-eslint/member-ordering
		public close(): void {
			Helper.Dom.Styles.RemoveClass(this._selfElem, Enum.CssClass.IsOpen);
			Helper.Dom.Styles.RemoveClass(this._bottomSheetOverlayElem, Enum.CssClass.IsOpen);
			this._isOpen = false;
		}

		public registerCallback(callback: Callbacks.Generic): void {
			console.log(callback);
		}
	}
}
