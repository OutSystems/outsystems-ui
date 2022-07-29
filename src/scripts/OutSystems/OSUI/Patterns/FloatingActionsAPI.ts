// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.FloatingActionsAPI {
	const _floatingActionsMap = new Map<string, OSFramework.Patterns.FloatingActions.IFloatingActions>(); //floatingActions.uniqueId -> FloatingActions obj

	/**
	 * Function that will change the property of a given Floating Actions pattern.
	 *
	 * @export
	 * @param {string} floatingActionsId ID of the Floating Action where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(floatingActionsId: string, propertyName: string, propertyValue: any): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const floatingActions = GetFloatingActionsById(floatingActionsId);

			floatingActions.changeProperty(propertyName, propertyValue);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.FloatingActions.FailChangeProperty;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Create the new Floating Actions instance and add it to the floatingActionsMap
	 *
	 * @export
	 * @param {string} floatingActionsId ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.Patterns.FloatingActions.IFloatingActions}
	 */
	export function Create(
		floatingActionsId: string,
		configs: string
	): OSFramework.Patterns.FloatingActions.IFloatingActions {
		if (_floatingActionsMap.has(floatingActionsId)) {
			throw new Error(
				`There is already a ${OSFramework.GlobalEnum.PatternName.FloatingActions} registered under id: ${floatingActionsId}`
			);
		}

		const _newFloatingActions = new OSFramework.Patterns.FloatingActions.FloatingActions(
			floatingActionsId,
			JSON.parse(configs)
		);

		_floatingActionsMap.set(floatingActionsId, _newFloatingActions);

		return _newFloatingActions;
	}

	/**
	 * Function that will dispose the instance of the given Floating Actions
	 *
	 * @export
	 * @param {string} floatingActionsId
	 */
	export function Dispose(floatingActionsId: string): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const floatingAction = GetFloatingActionsById(floatingActionsId);

			floatingAction.dispose();

			_floatingActionsMap.delete(floatingAction.uniqueId);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.FloatingActions.FailDispose;
		}

		return JSON.stringify(responseObj);
	}

	/**
	 * Fucntion that will return the Map with all the Floating Actions instances at the page
	 *
	 * @export
	 * @return {*}  {Map<string, OSFramework.Patterns.FloatingActions.IFloatingActions>}
	 */
	export function GetAllFloatingActions(): Array<string> {
		return OSFramework.Helper.MapOperation.ExportKeys(_floatingActionsMap);
	}

	/**
	 * Function that gets the instance of Floating Actions by a given ID.
	 *
	 * @export
	 * @param {string} floatingActionsId ID of the Floating Action that will be looked for.
	 * @return {*}  {OSFramework.Patterns.FloatingActions.IFloatingActions}
	 */
	export function GetFloatingActionsById(
		floatingActionsId: string
	): OSFramework.Patterns.FloatingActions.IFloatingActions {
		return OSFramework.Helper.MapOperation.FindInMap(
			'FloatingAction',
			floatingActionsId,
			_floatingActionsMap
		) as OSFramework.Patterns.FloatingActions.IFloatingActions;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} floatingActionId ID of the Floating Action pattern that will be initialized.
	 * @return {*}  {OSFramework.Patterns.FloatingActions.IFloatingActions}
	 */
	export function Initialize(floatingActionId: string): OSFramework.Patterns.FloatingActions.IFloatingActions {
		const floatingAction = GetFloatingActionsById(floatingActionId);

		floatingAction.build();

		return floatingAction;
	}

	/**
	 *
	 *
	 * @export
	 * @param {string} ratingId
	 * @param {*} callback
	 */
	export function RegisterCallback(
		floatingActionId: string,
		callback: OSFramework.GlobalCallbacks.OSGeneric
	): string {
		const responseObj = {
			isSuccess: true,
			message: ErrorCodes.Success.message,
			code: ErrorCodes.Success.code,
		};

		try {
			const floatingAction = GetFloatingActionsById(floatingActionId);

			floatingAction.registerCallback(callback);
		} catch (error) {
			responseObj.isSuccess = false;
			responseObj.message = error.message;
			responseObj.code = ErrorCodes.FloatingActions.FailRegisterCallback;
		}

		return JSON.stringify(responseObj);
	}
}
