// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OutSystems.OSUI.Patterns.<%= patternNamePC %>API {
	const _<%= patternName %>ItemsMap = new Map<string, OSFramework.Patterns.<%= patternNamePC %>.I<%= patternNamePC %>>(); //<%= patternNamePC %>.uniqueId -> <%= patternNamePC %> obj

	/**
	 * Function that will change the property of a given <%= patternNamePC %> Id.
	 *
	 * @export
	 * @param {string} <%= patternName %>Id ID of the <%= patternNamePC %> where the property will be changed.
	 * @param {string} propertyName Property name that will be updated
	 * @param {*} propertyValue Value that will be set to the property
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	export function ChangeProperty(<%= patternName %>Id: string, propertyName: string, propertyValue: any): void {
		const _<%= patternName %>Item = Get<%= patternNamePC %>ItemById(<%= patternName %>Id);

		_<%= patternName %>Item.changeProperty(propertyName, propertyValue);
	}

	/**
	 * Create the new <%= patternNamePC %>Item instance and add it to the <%= patternName %>ItemsMap
	 *
	 * @export
	 * @param {string} <%= patternName %>Id ID of the Pattern that a new instance will be created.
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.Patterns.<%= patternNamePC %>.I<%= patternNamePC %>}
	 */
	export function Create(
		<%= patternName %>Id: string,
		configs: string,
	): OSFramework.Patterns.<%= patternNamePC %>.I<%= patternNamePC %> {
		if (_<%= patternName %>ItemsMap.has(<%= patternName %>Id)) {
			/* TODO (by CreateNewPattern): 
				The line below is created by the CreateNewPattern mechanism, that is not able to replace values
				as expected, that said, check other patterns to understand how to replace it!
			*/
			throw new Error("There is already an <%= patternNamePC %> registered under id: "+<%= patternName %>Id);
		}

		const _<%= patternName %>Item = new OSFramework.Patterns.<%= patternNamePC %>.<%= patternNamePC %>(<%= patternName %>Id, JSON.parse(configs));

		_<%= patternName %>ItemsMap.set(<%= patternName %>Id, _<%= patternName %>Item);

		return _<%= patternName %>Item;
	}

	/**
	 * Function that will dispose the instance of the given <%= patternNamePC %>Item Id
	 *
	 * @export
	 * @param {string} <%= patternName %>Id
	 */
	export function Dispose(<%= patternName %>Id: string): void {
		const _<%= patternName %>Item = Get<%= patternNamePC %>ItemById(<%= patternName %>Id);

		_<%= patternName %>Item.dispose();

		_<%= patternName %>ItemsMap.delete(_<%= patternName %>Item.uniqueId);
	}

	/**
	 * Fucntion that will return the Map with all the <%= patternNamePC %> instances at the page
	 *
	 * @export
	 * @return {*}  Array<string>
	 */
	export function GetAll<%= patternNamePC %>ItemsMap(): Array<string> {
		return OSFramework.Helper.MapOperation.ExportKeys(_<%= patternName %>ItemsMap);
	}

	/**
	 * Function that gets the instance of <%= patternNamePC %>, by a given ID.
	 *
	 * @export
	 * @param {string} <%= patternName %>Id ID of the <%= patternNamePC %> that will be looked for.
	 * @return {*}  {OSFramework.Patterns.<%= patternNamePC %>.I<%= patternNamePC %>;}
	 */
	export function Get<%= patternNamePC %>ItemById(<%= patternName %>Id: string): OSFramework.Patterns.<%= patternNamePC %>.I<%= patternNamePC %> {
		return OSFramework.Helper.MapOperation.FindInMap(
			'<%= patternNamePC %>',
			<%= patternName %>Id,
			_<%= patternName %>ItemsMap
		) as OSFramework.Patterns.<%= patternNamePC %>.I<%= patternNamePC %>;
	}

	/**
	 * Function that will initialize the pattern instance.
	 *
	 * @export
	 * @param {string} <%= patternName %>Id ID of the <%= patternNamePC %>Item that will be initialized.
	 * @return {*}  {OSFramework.Patterns.<%= patternNamePC %>.I<%= patternNamePC %>}
	 */
	export function Initialize(<%= patternName %>Id: string): OSFramework.Patterns.<%= patternNamePC %>.I<%= patternNamePC %> {
		const _<%= patternName %>Item = Get<%= patternNamePC %>ItemById(<%= patternName %>Id);

		_<%= patternName %>Item.build();

		return _<%= patternName %>Item;
	}
}