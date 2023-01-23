/// <reference path="AbstractPattern.ts" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns {
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
		//  Store a collection about all the child items <childId, childType> in the parent scope
		private _childIdsByType: Map<string, string> = new Map<string, string>();

		//  Associative Array that will contain the childType as keyName and a map with all childs of same type!
		private _childItemsByType = {};

		/**
		 * Get the child reference based on given Id
		 *
		 * @protected
		 * @param childId Child Id of the element to be found
		 * @returns Child Reference
		 * @memberof OSFramework.Patterns.AbstractParent
		 */
		protected getChild(childId: string): CT {
			// Get ChildType
			const childType = this._childIdsByType.get(childId);

			// Check if there are childs of the given ChildId type!
			if (this._childItemsByType[childType]) {
				return this._childItemsByType[childType].get(childId);
			} else {
				return undefined;
			}
		}

		/**
		 * Get a child reference by a given Index position
		 *
		 * @protected
		 * @param index Index of the item to be returned
		 * @param childType To be based on childType childs collection, otherwise will assume parent only contains one child type!
		 * @returns Child Reference
		 * @memberof OSFramework.Patterns.AbstractParent
		 */
		protected getChildByIndex(index: number, childType?: string): CT {
			// If childType undefined, get the first key object name!
			if (childType === undefined) {
				childType = Object.keys(this._childItemsByType)[0];
			}

			// Get the correct map based on the given childType
			const childsMap = this._childItemsByType[childType];
			return childsMap ? this.getChild(Helper.MapOperation.ExportKeys(childsMap)[index]) : undefined;
		}

		/**
		 * Get a child index from a given child Id
		 *
		 * @protected
		 * @param childId Child id where index will be found
		 * @returns Index value
		 * @memberof OSFramework.Patterns.AbstractParent
		 */
		protected getChildIndex(childId: string): number {
			// Get ChildType
			const childType = this._childIdsByType.get(childId);
			// Get the correct map based on the given childType
			const childsMap = this._childItemsByType[childType];

			return Helper.MapOperation.ExportKeys(childsMap).indexOf(childId);
		}

		/**
		 * Method that is used to set a given child as a Parent child.
		 *
		 * @protected
		 * @param childId Id that should be added
		 * @param childItem Reference to be added
		 * @memberof OSFramework.Patterns.AbstractParent
		 */
		protected setChild(childItem: CT): void {
			const childType = childItem.constructor.name;

			if (this._childItemsByType[childType] === undefined) {
				this._childItemsByType[childType] = new Map<string, CT>();
			}

			// Check if we have no items yet
			if (this._childItemsByType[childType].size === 0) {
				// Set item as First and Last child
				childItem.isFirstChild = true;
				childItem.isLastChild = true;
			} else {
				// Since we've more than one child, get the previous and unset it as lastChild
				this.getChildByIndex(this._childItemsByType[childType].size - 1, childType).isLastChild = false;
				// Set the current one as lastChild
				childItem.isLastChild = true;
			}

			// Set the child into the global _childIdsByType
			this._childIdsByType.set(childItem.uniqueId, childType);
			// Set the given child into the map with the same type
			this._childItemsByType[childType].set(childItem.uniqueId, childItem);
		}

		/**
		 * Method that will remove Child by given Id
		 *
		 * @protected
		 * @param childId Id of the item that will be removed
		 * @memberof OSFramework.Patterns.AbstractParent
		 */
		protected unsetChild(childId: string): void {
			// Get ChildType
			const childType = this._childIdsByType.get(childId);
			if (childType === undefined) {
				// Was not able to get type!
				throw new Error(
					`${ErrorCodes.AbstractParent.FailTypeNotFound}:Child Type of Child ('${childId}') was not found!`
				);
			}

			// Get the correct map based on the given childType
			const childsMap = this._childItemsByType[childType];
			if (childsMap === undefined) {
				// Was not able to get childs of type!
				throw new Error(
					`${ErrorCodes.AbstractParent.FailChildsNotFound}:Childs of Type ('${childType}') were not found!`
				);
			}

			// Get the child reference
			const childItem = this.getChild(childId);
			if (childItem === undefined) {
				// Was not able to get child by id!
				throw new Error(
					`${ErrorCodes.AbstractParent.FailChildNotFound}:Child of Id ('${childId}') was not found!`
				);
			}

			// Check if it's the firstChild
			if (childItem.isFirstChild) {
				// unSet it as firstChild
				childItem.isFirstChild = false;
				// Set the 2nd child as firsChild since it will turns into the first one!
				const nextSibling = this.getChildByIndex(1, childType);
				if (nextSibling) {
					nextSibling.isFirstChild = true;
				}
			}

			// Check if it's the lastChild
			if (childItem.isLastChild) {
				// unSet it as lastChild
				childItem.isLastChild = false;
				// Set the previous child as lastChild since it will turns into the last one!
				// The current last child (childsMap.size - 1), the prevSibling will be the child before (-2)
				const prevSibling = this.getChildByIndex(childsMap.size - 2, childType);
				if (prevSibling) {
					prevSibling.isLastChild = true;
				}
			}

			// Remove child from it's Map of all child items global reference!
			this._childIdsByType.delete(childId);
			// Remove child from it's Map of items with the same type!
			childsMap.delete(childId);
		}

		/**
		 * Getter that allows to obtain all the childs when parent only contains childs of one type,
		 * otherwise a type must be passed in order to return all child of the given type!
		 *
		 * @param type To be based on childType childs collection, otherwise will assume parent only contains one child type!
		 * @returns
		 * @memberof OSFramework.Patterns.AbstractParent
		 */
		public getChildItems(type?: string): Array<CT> {
			// If type undefined, get the first key object name!
			if (type === undefined) {
				type = Object.keys(this._childItemsByType)[0];
			}

			// Get the correct map based on the given type
			const childsMap = this._childItemsByType[type];
			return childsMap === undefined ? [] : [...childsMap.values()];
		}

		/**
		 * Method used to be notified by a given ChildId about a given action and act accordingly
		 *
		 * @abstract
		 * @param {string} childItem Child Item
		 * @param {string} notifiedTo Notification name (Should be based on an Enum)
		 * @memberof OSFramework.Patterns.AbstractParent
		 */
		public abstract beNotifiedByChild(childItem: CT, notifiedTo: string): void;
	}
}
