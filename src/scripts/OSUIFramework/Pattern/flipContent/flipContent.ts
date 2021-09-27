// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.FlipContent {
	/**
	 * Defines the interface for OutSystemsUI Patterns
	 */
	export class FlipContent extends AbstractPattern<FlipContentConfig> implements IFlipContent {
		private _isExpanded: string;
		private _flipElement: HTMLElement;
		//let flipWrapper = document.getElementById($parameters.WrappperId); //this._selfElem
		//let elemId = document.getElementById($parameters.ElemId);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
		constructor(uniqueId: string, configs: any) {
			super(uniqueId, new FlipContentConfig(configs));
		}

		private _onKeyDownPress(e): void {
			this._isExpanded = this._selfElem.getAttribute(Enum.CssClass.DataFlipped);

			//If esc, Close AccordionItem
			if (this._isExpanded === 'True' && e.keyCode === '27') {
				//$actions.ToggleFlip();
				e.preventDefault();
				e.stopPropagation();
			}

			//If enter or space use the onAccordionClick to validate
			if (e.keyCode == '32' || e.keyCode === '13') {
				//$actions.ToggleFlip();
				e.preventDefault();
			}
		}

		private _toggleClick(): void {}

		registerCallback(callback: Callbacks.OSGeneric): void {
			throw new Error('Method not implemented.');
		}
	}
}
