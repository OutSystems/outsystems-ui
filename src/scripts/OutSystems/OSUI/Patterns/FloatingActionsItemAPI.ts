// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.FloatingActionsItemAPI {
	const _floatingActionsItemMap = new Map<string, OSUIFramework.Patterns.FloatingActionsItem.IFloatingActionsItem>(); //floatingActionsItem.uniqueId -> FloatingActionsItem obj

	/**
	 * Function that will change the property of a given Floating Actions pattern.
	 *
	 * @export
	 * @param {string} floatingActionsItemId ID of the Floating Action Item where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(floatingActionsItemId: string, propertyName: string, propertyValue: any): void {
		const floatingActionsItem = GetFloatingActionsItemById(floatingActionsItemId);

		floatingActionsItem.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Create the new Floating Actions Item instance and add it to the floatingActionsItem Map
	 *
	 * @export
	 * @param {string} floatingActionsItemId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.FloatingActions.IFloatingActions}
	 */
	export function Create(
		floatingActionsItemId: string,
		configs: string
	): OSUIFramework.Patterns.FloatingActionsItem.IFloatingActionsItem {
		if (_floatingActionsItemMap.has(floatingActionsItemId)) {
			throw new Error(`There is already a floating action registered under id: ${floatingActionsItemId}`);
		}

		const _newFloatingActions = new OSUIFramework.Patterns.FloatingActionsItem.FloatingActionsItem(
			floatingActionsItemId,
			JSON.parse(configs)
		);

		_floatingActionsItemMap.set(floatingActionsItemId, _newFloatingActions);

		return _newFloatingActions;
	}

	/**
	 * Function that will dispose the instance of the given Floating Actions
	 *
	 * @export
	 * @param {string} floatingActionsId
	 */
	export function Dispose(floatingActionsId: string): void {
		const floatingActionItem = GetFloatingActionsItemById(floatingActionsId);

		floatingActionItem.dispose();

		_floatingActionsItemMap.delete(floatingActionItem.uniqueId);
	}

	/**
	 * Fucntion that will return the Map with all the Floating Actions instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSUIFramework.Patterns.FloatingActions.IFloatingActions>}
	 */
	export function GetAllFloatingActionsItems(): Array<string> {
		return OSUIFramework.Helper.MapOperation.ExportKeys(_floatingActionsItemMap);
	}

	/**
	 * Function that gets the instance of Floating Actions by a given ID.
	 *
	 * @export
	 * @param {string} floatingActionsId ID of the Floating Action that will be looked for.
	 * @return {*}  {OSUIFramework.Patterns.FloatingActions.IFloatingActions}
	 */
	export function GetFloatingActionsItemById(
		floatingActionsItemId: string
	): OSUIFramework.Patterns.FloatingActionsItem.IFloatingActionsItem {
		return OSUIFramework.Helper.MapOperation.FindInMap(
			'FloatingActionItem',
			floatingActionsItemId,
			_floatingActionsItemMap
		) as OSUIFramework.Patterns.FloatingActionsItem.IFloatingActionsItem;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} floatingActionItemId ID of the Floating Action Item pattern that will be initialized.
	 * @return {*}  {OSUIFramework.Patterns.FloatingActionsItem.IFloatingActionsItem}
	 */
	export function Initialize(
		floatingActionItemId: string
	): OSUIFramework.Patterns.FloatingActionsItem.IFloatingActionsItem {
		const floatingActionItem = GetFloatingActionsItemById(floatingActionItemId);

		floatingActionItem.build();

		return floatingActionItem;
	}
}
