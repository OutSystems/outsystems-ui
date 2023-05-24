// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.OverflowMenu {
	export class OverflowMenu extends AbstractPattern<OverflowMenuConfig> implements IOverflowMenu {
		private _eventOnClick: GlobalCallbacks.Generic;
		private _triggerElem: HTMLElement;
		private _balloonElem: HTMLElement;
		public balloonFeature: Feature.Balloon.IBalloon;
		public balloonOptions: Feature.Balloon.BalloonOptions;
		public isOpen = false;

		constructor(uniqueId: string, configs: JSON) {
			super(uniqueId, new OverflowMenuConfig(configs));
		}

		private _onClickCallback(): void {
			if (this.balloonFeature.isOpen) {
				this.close();
			} else {
				this.open();
			}
		}

		protected removeEventListeners(): void {
			this._triggerElem.removeEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
		}

		/**
		 * Add the Accessibility Attributes values
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected setA11YProperties(): void {
			if (this.isBuilt === false) {
				Helper.A11Y.AriaHasPopupTrue(this.selfElement);
				//Helper.A11Y.AriaControls(this._triggerElem, this.balloonElem.widgetId);
			}

			Helper.A11Y.AriaExpanded(this.selfElement, this.isOpen.toString());
		}

		/**
		 * Set the callbacks
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected setCallbacks(): void {
			this._eventOnClick = this._onClickCallback.bind(this);
		}

		protected setEventListeners(): void {
			this._triggerElem.addEventListener(GlobalEnum.HTMLEvent.Click, this._eventOnClick);
		}

		/**
		 * Update info based on htmlContent
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected setHtmlElements(): void {
			this._triggerElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.Trigger);
			this._balloonElem = Helper.Dom.ClassSelector(this.selfElement, Enum.CssClass.Balloon);

			this.balloonOptions = {
				alignment: 'start',
				allowedPlacements: [
					GlobalEnum.FloatingPosition.BottomStart,
					GlobalEnum.FloatingPosition.BottomEnd,
					GlobalEnum.FloatingPosition.TopStart,
					GlobalEnum.FloatingPosition.TopEnd,
				],
				anchorElem: this._triggerElem,
				balloonElem: this._balloonElem,
				position: this.configs.Position,
				shape: this.configs.Shape,
			};

			this.balloonFeature = new OSFramework.OSUI.Feature.Balloon.Balloon(this.balloonOptions);
		}

		/**
		 * Removes the listeners that were added in the code and unsets the callbacks.
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected unsetCallbacks(): void {
			this._eventOnClick = undefined;
		}

		/**
		 * Removes the local value of the variables pointing to HTML elements;
		 *
		 * @protected
		 * @memberof OSFramework.Patterns.OverflowMenu.OverflowMenu
		 */
		protected unsetHtmlElements(): void {
			this._triggerElem = undefined;
			this.balloonFeature = undefined;
		}

		public build(): void {
			super.build();
			this.setHtmlElements();
			this.setCallbacks();
			this.setA11YProperties();
			this.setEventListeners();
			this.finishBuild();
		}

		public changeProperty(propertyName: string, propertyValue: unknown): void {
			super.changeProperty(propertyName, propertyValue);
		}

		public close(): void {
			if (this.balloonFeature.isOpen) {
				this.balloonFeature.close();
				Helper.Dom.Styles.RemoveClass(this.selfElement, Enum.CssClass.Open);
				this.isOpen = false;
				this.setA11YProperties();
			}
		}

		public dispose(): void {
			this.removeEventListeners();
			this.unsetCallbacks();
			this.unsetHtmlElements();
			super.dispose();
		}

		public open(): void {
			if (this.balloonFeature.isOpen === false) {
				this.balloonFeature.open();
				Helper.Dom.Styles.AddClass(this.selfElement, Enum.CssClass.Open);
				this.isOpen = true;
				this.setA11YProperties();
			}
		}
	}
}
