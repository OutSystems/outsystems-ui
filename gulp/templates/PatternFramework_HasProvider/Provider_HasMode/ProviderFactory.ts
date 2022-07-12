/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Providers.<%= patternNamePC %>.<%= providerNamePC %>.Factory {
	/**
	 * Create the new <%= providerNamePC %> instance object according given Mode
	 *
	 * @export
	 * @param {string} <%= patternName %>Id ID of the Pattern that a new instance will be created.
	 * @param {string} mode
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSFramework.Patterns.<%= patternNamePC %>.I<%= patternNamePC %>}
	 */
	export function New<%= providerNamePC %>(
		<%= patternName %>Id: string,
		mode: string,
		configs: JSON
	): OSFramework.Patterns.<%= patternNamePC %>.I<%= patternNamePC %> {
		let _<%= providerName %>Item = null;

		switch (mode) {
			case OSFramework.Patterns.<%= patternNamePC %>.Enum.Mode.<%= modeNamePC %>:
				_<%= providerName %>Item = new Providers.<%= patternNamePC %>.<%= providerNamePC %>.<%= modeNamePC %>.OSUI<%= providerNamePC %><%= modeNamePC %>(
					<%= patternName %>Id,
					configs
				);

				break;

			default:
				/* TODO (by CreateNewPattern): 
					The line below is created by the CreateNewPattern mechanism, that is not able to replace values
					as expected, that said, check other patterns to understand how to replace it!
				*/
				throw new Error("There is no <%= patternNamePC %> of <%= modeNamePC %> mode type");
		}

		return _<%= providerName %>Item;
	}
}
