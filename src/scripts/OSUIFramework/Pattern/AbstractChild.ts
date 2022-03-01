/// <reference path="AbstractPattern.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns {
	/**
	 * Defines the Default props and methods for Patterns that will have other Patterns as its childs
	 *
	 * @export
	 * @abstract
	 * @class AbstractChild
	 * @implements {Interface.IChild}
	 * @template {C extends AbstractConfiguration, PT extends Interface.IParent}
	 */
	export abstract class AbstractChild<C extends AbstractConfiguration, PT extends Interface.IParent>
		extends AbstractPattern<C>
		implements Interface.IChild
	{
		/**
		 * Store the Pattern Id.
		 *
		 * @private
		 * @type {string}
		 * @memberof AbstractChild
		 */
		private _parentId: string;

		/**
		 * Store the Parent reference.
		 *
		 * @private
		 * @type {PT}
		 * @memberof AbstractChild
		 */
		private _parentObject: PT;

		/**
		 * Method used to notify parent about the action that was performed
		 *
		 * @param actionType Action Type name (Should be based on an Enum)
		 * @memberof AbstractChild
		 */
		protected notifyParent(actionType: string): void {
			this._parentObject.beNotifiedByChild(this.uniqueId, actionType);
		}

		/**
		 * Method that will Get and Set parent element info.
		 *
		 * @param parentSelector Selector to find for parent Element
		 * @param getPatternByIdAPI API reference method from Parent Pattern that will return the PatternById
		 */
		// eslint-disable-next-line @typescript-eslint/ban-types
		protected setParentInfo(parentSelector: string, getPatternByIdAPI: Function): void {
			try {
				const findedElement = this._selfElem.closest(parentSelector) as HTMLElement;
				// Find for Id at Name or data-uniqueid attribite, data-uniqueid attribute is used at the elements that will be moved outside parent context
				this._parentId = Helper.Dom.Attribute.Get(findedElement, 'name') || findedElement.dataset.uniqueid;

				this._parentObject = getPatternByIdAPI(this._parentId) as PT;
			} catch (e) {
				// Was not able to get Dropdown parent element!
				throw new Error(
					`${ErrorCodes.AbstractChild.DropdownParentNotFound}: ${GlobalEnum.PatternsNames.Dropdown} parent of ${GlobalEnum.PatternsNames.DropdownServerSideItem} id: '${this.widgetId}' was not found!`
				);
			}
		}

		/**
		 * Getter that allows to obtain the parentId.
		 *
		 * @readonly
		 * @type {string}
		 * @memberof AbstractChild
		 */
		public get parentId(): string {
			return this._parentId;
		}

		/**
		 * Getter that allows to obtain the parent reference.
		 *
		 * @readonly
		 * @type {PT}
		 * @memberof AbstractChild
		 */
		public get parentObject(): PT {
			return this._parentObject;
		}
	}
}
