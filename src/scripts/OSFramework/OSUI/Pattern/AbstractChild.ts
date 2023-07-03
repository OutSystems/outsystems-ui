/// <reference path="AbstractPattern.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/AbstractChild.ts
namespace OSFramework.Patterns {
========
namespace OSFramework.OSUI.Patterns {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/AbstractChild.ts
	/**
	 * Defines the Default props and methods for Patterns that will be added into other Patterns as its childs
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
		// Store if it's the First Child
		private _isFirstChild = false;

		// Store if it's the Last Child
		private _isLastChild = false;

		// Store the Pattern Id.
		private _parentId: string;

		// Store the Parent reference.
		private _parentObject: PT;

		/**
		 * Method used to notify parent about the action that was performed
		 *
		 * @param actionType Action Type name (Should be based on an Enum)
		 * @memberof OSFramework.Patterns.AbstractChild
		 */
		protected notifyParent(actionType: string): void {
			this._parentObject.beNotifiedByChild(this, actionType);
		}

		/**
		 * Method that will Get and Set parent element info.
		 *
		 * @protected
		 * @param {string} parentSelector Selector to find for parent Element
		 * @param {Function} getPatternByIdAPI API reference method from Parent Pattern that will return the PatternById
		 * @param {boolean} [canBeOrphan] option for patterns that can work without a parent
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/AbstractChild.ts
		 * @memberof AbstractChild
========
		 * @memberof OSFramework.Patterns.AbstractChild
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/AbstractChild.ts
		 */
		// eslint-disable-next-line @typescript-eslint/ban-types
		protected setParentInfo(parentSelector: string, getPatternByIdAPI: Function, canBeOrphan?: boolean): void {
			try {
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/AbstractChild.ts
				const findedElement = this._selfElem.closest(parentSelector) as HTMLElement;
========
				const findedElement = this.selfElement.closest(parentSelector) as HTMLElement;
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/AbstractChild.ts
				// Find for Id at Name or data-uniqueid attribute, data-uniqueid attribute is used at the elements that will be moved outside parent context
				this._parentId = Helper.Dom.Attribute.Get(findedElement, 'name') || findedElement.dataset.uniqueid;

				this._parentObject = getPatternByIdAPI(this._parentId) as PT;
			} catch (e) {
				// It means the pattern can be used without the parent, so lets not throw error (ex: accordionItem)
				if (canBeOrphan) {
					this._parentObject = undefined;
				} else {
					// Was not able to get parent element!
					throw new Error(
						`${ErrorCodes.AbstractChild.FailParentNotFound}: Parent of Child with Id: '${this.widgetId}' was not found!`
					);
				}
			}
		}

		/**
		 * Getter that allows to check if it's the first child.
		 *
		 * @readonly
		 * @type {string}
		 * @memberof OSFramework.Patterns.AbstractChild
		 */
		public get isFirstChild(): boolean {
			return this._isFirstChild;
		}

		/**
		 * Setter that allows to define it's the first child.
		 *
		 * @readonly
		 * @type {string}
		 * @memberof OSFramework.Patterns.AbstractChild
		 */
		public set isFirstChild(value: boolean) {
			this._isFirstChild = value;
		}

		/**
		 * Getter that allows to check if it's the last child.
		 *
		 * @memberof OSFramework.Patterns.AbstractChild
		 */
		public get isLastChild(): boolean {
			return this._isLastChild;
		}

		/**
		 * Setter that allows to define it's the last child.
		 *
		 * @memberof OSFramework.Patterns.AbstractChild
		 */
		public set isLastChild(value: boolean) {
			this._isLastChild = value;
		}

		/**
		 * Getter that allows to obtain the parentId.
		 *
		 * @readonly
		 * @type {string}
		 * @memberof OSFramework.Patterns.AbstractChild
		 */
		public get parentId(): string {
			return this._parentId;
		}

		/**
		 * Getter that allows to obtain the parent reference.
		 *
		 * @readonly
		 * @type {PT}
		 * @memberof OSFramework.Patterns.AbstractChild
		 */
		public get parentObject(): PT {
			return this._parentObject;
		}
	}
}
