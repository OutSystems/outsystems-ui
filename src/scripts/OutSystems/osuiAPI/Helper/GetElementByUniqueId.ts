// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.osuiAPI.Helper {
	/**
	 * Responsable for finding a DOM Element
	 * @param uniqueId Identificator for a HTMElement
	 * @param raiseError Will throw when there is no object with this uniqueId
	 * @returns The respective DOM Element
	 */
	export function GetElementByUniqueId(uniqueId: string, raiseError = true): HTMLElement {
		const obj = document.getElementsByName(uniqueId);

		if (obj.length) {
			return obj[0];
		} else if (raiseError) {
			throw new Error(`Object with name '${uniqueId}' not found.`);
		} else {
			return undefined;
		}
	}
}
