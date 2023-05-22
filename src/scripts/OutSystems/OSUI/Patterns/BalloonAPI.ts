// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.BalloonAPI {
	const _balloonMap = new Map<string, OSFramework.OSUI.Patterns.Balloon.IBalloon>();

	/**
	 * Function that will change the property of a given Balloon pattern.
	 *
	 * @export
	 * @param {string} balloonId
	 * @param {string} propertyName
	 * @param {*} propertyValue
	 * @return {*}  {string}
	 */
	export function ChangeProperty(balloonId: string, propertyName: string, propertyValue: unknown): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Balloon.FailChangeProperty,
			callback: () => {
				const _balloon = GetBalloonById(balloonId);

				_balloon.changeProperty(propertyName, propertyValue);
			},
		});

		return result;
	}

	/**
	 * Create the new Balloon instance and add it to the Balloon Map
	 *
	 * @export
	 * @param {string} balloonId
	 * @param {string} configs
	 * @return {*}  {OSFramework.OSUI.Patterns.Balloon.IBalloon}
	 */
	export function Create(balloonId: string, configs: string): OSFramework.OSUI.Patterns.Balloon.IBalloon {
		if (_balloonMap.has(balloonId)) {
			throw new Error(
				`There is already a ${OSFramework.OSUI.GlobalEnum.PatternName.Balloon} registered under id: ${balloonId}`
			);
		}

		const _balloonItem = new OSFramework.OSUI.Patterns.Balloon.Balloon(balloonId, JSON.parse(configs));

		_balloonMap.set(balloonId, _balloonItem);

		return _balloonItem;
	}

	/**
	 * Function that will dispose the instance of the given Balloon
	 *
	 * @export
	 * @param {string} balloonId
	 */
	export function Dispose(balloonId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Balloon.FailDispose,
			callback: () => {
				const _balloon = GetBalloonById(balloonId);

				_balloon.dispose();

				_balloonMap.delete(_balloon.uniqueId);
			},
		});

		return result;
	}

	/**
	 * Function that will return the Map with all the Balloon instances at the page
	 *
	 * @export
	 * @return {*}  {Array<string>}
	 */
	export function GetAllBalloons(): Array<string> {
		return OSFramework.OSUI.Helper.MapOperation.ExportKeys(_balloonMap);
	}

	/**
	 * Function that gets the instance of Balloon by a given Id.
	 *
	 * @export
	 * @param {string} balloonId
	 * @return {*}  {OSFramework.OSUI.Patterns.Balloon.IBalloon}
	 */
	export function GetBalloonById(balloonId: string): OSFramework.OSUI.Patterns.Balloon.IBalloon {
		return OSFramework.OSUI.Helper.MapOperation.FindInMap(
			'Balloon',
			balloonId,
			_balloonMap
		) as OSFramework.OSUI.Patterns.Balloon.IBalloon;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} balloonId ID of the Balloon that will be initialized.
	 * @return {*}  {OSFramework.OSUI.Patterns.Balloon.IBalloon}
	 */
	export function Initialize(balloonId: string): OSFramework.OSUI.Patterns.Balloon.IBalloon {
		const _balloon = GetBalloonById(balloonId);

		_balloon.build();

		return _balloon;
	}

	/**
	 * Function to open this pattern
	 *
	 * @export
	 * @param {string} balloonId
	 * @return {*}  {string}
	 */
	export function Open(balloonId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Balloon.FailOpen,
			callback: () => {
				const _balloonItem = GetBalloonById(balloonId);

				_balloonItem.open();
			},
		});

		return result;
	}

	/**
	 * Function to close this pattern
	 *
	 * @export
	 * @param {string} balloonId
	 * @return {*}  {string}
	 */
	export function Close(balloonId: string): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Balloon.FailClose,
			callback: () => {
				const _balloonItem = GetBalloonById(balloonId);

				_balloonItem.close();
			},
		});

		return result;
	}

	/**
	 * Function to register a callback on this pattern
	 *
	 * @export
	 * @param {string} balloonId
	 * @param {string} eventName
	 * @param {OSFramework.OSUI.GlobalCallbacks.Generic} callback
	 * @return {*}  {string}
	 */
	export function RegisterCallback(
		balloonId: string,
		eventName: string,
		callback: OSFramework.OSUI.GlobalCallbacks.Generic
	): string {
		const result = OutSystems.OSUI.Utils.CreateApiResponse({
			errorCode: ErrorCodes.Balloon.FailRegisterCallback,
			callback: () => {
				const _balloon = GetBalloonById(balloonId);

				_balloon.registerCallback(callback, eventName);
			},
		});

		return result;
	}
}
