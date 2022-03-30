/// <reference path="AbstractPattern.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns {
	/**
	 * Defines the Default props and methods for Patterns that will have other Patterns as its childs
	 *
	 * @export
	 * @abstract
	 * @class AbstractParent
	 * @implements {Interface.IParent}
	 * @template {C extends AbstractConfiguration, CT extends Interface.IChild}
	 */
	export abstract class AbstractParent<C extends AbstractConfiguration, CT extends Interface.IChild>
		extends AbstractPattern<C>
		implements Interface.IParent
	{
		/**
		 * Store a collection about all the child items in the parent scope
		 *
		 * @private
		 * @type {Map<string, CT>}
		 * @memberof AbstractParent
		 */
		private _childItems: Map<string, CT> = new Map<string, CT>();

		/**
		 * Get the child reference based on given Id
		 *
		 * @param childId Child Id of the element to be found
		 * @returns Child Reference
		 */
		protected getChild(childId: string): CT {
			return this._childItems.get(childId);
		}

		/**
		 * Get a child reference by a given Index position
		 *
		 * @param index Index of the item to be returned
		 * @returns Child Reference
		 */
		protected getChildByIndex(index: number): CT {
			return this.getChild(Helper.MapOperation.ExportKeys(this._childItems)[index]);
		}

		/**
		 * Get a child index from a given child Id
		 *
		 * @param childId Child id where index will be found
		 * @returns Index value
		 */
		protected getChildIndex(childId: string): number {
			return Helper.MapOperation.ExportKeys(this._childItems).indexOf(childId);
		}

		/**
		 * Method that is used to set a given child as a Parent child.
		 *
		 * @param childId Id that should be added
		 * @param optionItem Reference to be added
		 */
		protected setChild(childId: string, optionItem: CT): void {
			// Check if we have only one item
			if (this._childItems.size === 0) {
				// Set that item is the First and Last child
				optionItem.isFirstChild = true;
				optionItem.isLastChild = true;
			} else {
				// Get the previous child and unset it as lastChild
				this.getChildByIndex(this._childItems.size - 1).isLastChild = false;
				// Set the current one as lastChild
				optionItem.isLastChild = true;
			}

			this._childItems.set(childId, optionItem);
		}

		/**
		 * Method that will remove Child by given Id
		 *
		 * @param childId Id of the item that will be removed
		 */
		protected unsetChild(childId: string): void {
			this._childItems.delete(childId);
		}

		/**
		 * Getter that allows to obtain all the child Ids inside Dropdown.
		 *
		 * @readonly
		 * @type {Array<CT>}
		 * @memberof AbstractParent
		 */
		public get childItems(): Array<CT> {
			return [...this._childItems.values()];
		}

		/**
		 * Method used to be notified by a given ChildId about a given action and act accordingly
		 *
		 * @param childId Child Item Id
		 * @param notifiedTo Notification name (Should be based on an Enum)
		 * @memberof OSUIDropdownServerSide
		 */
		public abstract beNotifiedByChild(childId: string, notifiedTo: string): void;
	}
}
