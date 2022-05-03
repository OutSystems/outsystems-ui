// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Helper {
	/**
	 * Method that will help on getting the CurrentRowNumber from an element when it's inside a list
	 *
	 * @param widgetId Id of the element that will retunr it's list currentRowNumber
	 * @returns {number | null} the element row number, or null
	 */
	export function GetCurrentRowNumber(widgetId: string): number | null {
		// Get the element reference
		const myItem = document.getElementById(widgetId);
		// Get the data list container element
		// TODO: change the string into a const
		const listContainer = myItem.closest('[data-list]');

		// Get all list childs, excluding the script ones!
		// TODO: change the string into a const
		const listChilds = Array.from(listContainer.childNodes).filter(
			(item: HTMLElement) => item.tagName !== 'SCRIPT'
		);

		// Set the index row that will be addressed
		let indexRow = -1;
		listChilds.forEach((element, index) => {
			// Check if the list child item contains our element
			if (element.contains(myItem)) {
				indexRow = index;
			}
		});

		return indexRow > -1 ? indexRow : null;
	}
}
