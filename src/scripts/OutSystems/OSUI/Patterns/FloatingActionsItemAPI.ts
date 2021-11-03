// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.FloatingActionsItemAPI {
	const _floatingActionsMap = new Map<string, string>(); //floatingActionsItem.uniqueId -> FloatingActions.uniqueId
	const _floatingActionsItemMap = new Map<string, OSUIFramework.Patterns.FloatingActionsItem.IFloatingActionsItem>(); //floatingActionsItem.uniqueId -> FloatingActionsItem obj

	/**
	 * Gets the Floating Action pattern the Item belongs to
	 *
	 * @return {*}  {Map<string, OSUIFramework.Patterns.FloatingActions.IFloatingActions>}
	 */
	export function GetFloatingActionsByItem(
		floatingActionsItemId: string
	): OSUIFramework.Patterns.FloatingActions.IFloatingActions {
		let floatingActions: OSUIFramework.Patterns.FloatingActions.IFloatingActions;

		if (_floatingActionsMap.has(floatingActionsItemId)) {
			floatingActions = FloatingActionsAPI.GetFloatingActionsById(_floatingActionsMap.get(floatingActionsItemId));
		} else {
			// Try to find its reference on DOM
			const elem = OSUIFramework.Helper.GetElementByUniqueId(floatingActionsItemId);
			const floating = elem.closest(OSUIFramework.Patterns.FloatingActions.Enum.CssClasses.FloatingActionWrapper);

			if (!floating) {
				throw Error(
					`This ${OSUIFramework.GlobalEnum.PatternsNames.FloatingActionsItem} does not belong to any ${OSUIFramework.GlobalEnum.PatternsNames.FloatingActions} pattern.`
				);
			}
			const uniqueId = floating.getAttribute('name');
			floatingActions = FloatingActionsAPI.GetFloatingActionsById(uniqueId);
		}

		return floatingActions;
	}

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
			throw new Error(
				`There is already a ${OSUIFramework.GlobalEnum.PatternsNames.FloatingActions} registered under id: ${floatingActionsItemId}`
			);
		}

		const _newFloatingActionsItem = new OSUIFramework.Patterns.FloatingActionsItem.FloatingActionsItem(
			floatingActionsItemId,
			JSON.parse(configs)
		);

		_floatingActionsItemMap.set(floatingActionsItemId, _newFloatingActionsItem);
		_newFloatingActionsItem.build();

		const floatingAction = GetFloatingActionsByItem(floatingActionsItemId);

		if (floatingAction !== undefined) {
			_floatingActionsMap.set(floatingActionsItemId, floatingAction.uniqueId);
			floatingAction.addFloatingActionItem(_newFloatingActionsItem.uniqueId, _newFloatingActionsItem);
		}

		return _newFloatingActionsItem;
	}

	/**
	 * Function that will dispose the instance of the given Floating Actions
	 *
	 * @export
	 * @param {string} floatingActionsItemId
	 */
	export function Dispose(floatingActionsItemId: string): void {
		const floatingActionItem = GetFloatingActionsItemById(floatingActionsItemId);

		//When destroying the whole pattern Floating Actions + Floating Actions Item, the parent is destroyed first
		//So, there is no parent to disconnect from.
		if (floatingActionItem) {
			const floatingAction = GetFloatingActionsByItem(floatingActionsItemId);

			if (floatingAction !== undefined) {
				floatingAction.removeFloatingActionItem(floatingActionItem.uniqueId);
			}
		}

		floatingActionItem.dispose();

		_floatingActionsItemMap.delete(floatingActionItem.uniqueId);
		_floatingActionsMap.delete(floatingActionItem.uniqueId);
	}

	/**
	 * Function that will return the Map with all the Floating Actions instances at the page
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
}
