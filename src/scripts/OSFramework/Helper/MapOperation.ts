/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.Helper.MapOperation {
	/**
	 * Finds in a map the pattern element
	 *
	 * @export
	 * @param {Map} map
	 * @return {*}  {string}
	 */
	export function FindInMap(
		pattternName: string,
		patternId: string,
		map: Map<string, Interface.IPattern>
	): Interface.IPattern {
		let pattern: Interface.IPattern;

		// animatedLabelId is the UniqueId
		if (map.has(patternId)) {
			pattern = map.get(patternId);
		} else {
			//Search for animatedLabelId
			for (const p of map.values()) {
				if (p.equalsToID(patternId)) {
					pattern = p;
					break;
				}
			}
		}

		if (pattern === undefined) {
			throw new Error(`The ${pattternName} with id:'${patternId}' was not found`);
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
