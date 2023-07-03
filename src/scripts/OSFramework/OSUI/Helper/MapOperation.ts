/* eslint-disable @typescript-eslint/no-unused-vars */
<<<<<<<< HEAD:src/scripts/OSFramework/Helper/MapOperation.ts
namespace OSFramework.Helper.MapOperation {
========
namespace OSFramework.OSUI.Helper.MapOperation {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Helper/MapOperation.ts
	/**
	 * Finds in a map the pattern element
	 *
	 * @export
	 * @param {Map} map
	 * @return {*}  {string}
	 */
	export function FindInMap(
		patternName: string,
		patternId: string,
		map: Map<string, Interface.IPattern>
	): Interface.IPattern {
		let pattern: Interface.IPattern;

<<<<<<<< HEAD:src/scripts/OSFramework/Helper/MapOperation.ts
		// animatedLabelId is the UniqueId
========
		// Search for patternId as the uniqueId
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Helper/MapOperation.ts
		if (map.has(patternId)) {
			pattern = map.get(patternId);
		} else {
			// Search for patternId as the widgetId.

			// Sometimes we can have more than one pattern with the same widgetID, because of how the Lifecycle of the page works.
			// In this case, we need to always get the newest one, that is, the latest one in the map.

			for (const p of map.values()) {
				if (p.equalsToID(patternId)) {
					pattern = p;
				}
			}
		}

		if (pattern === undefined) {
			throw new Error(`The ${patternName} with id:'${patternId}' was not found`);
		}

		return pattern;
	}
	/**
	 * Function that helps exporting all keys from a map.
	 * Useful to list the IDs of all patterns (of given type) in the page.
	 *
	 * @export
	 * @param {Map<string, Interface.IPattern>} map
	 * @return {*}  {Array<string>}
	 */
	export function ExportKeys(map: Map<string, Interface.IPattern>): Array<string> {
		//TODO: a future improvement would be get the widget Id of all Patterns, instead of the unique ID.
		return [...map.keys()];
	}
}
