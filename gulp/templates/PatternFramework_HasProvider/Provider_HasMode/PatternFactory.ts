/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSUIFramework.Patterns.<%= patternNamePC %>.Factory {
	/**
	 * Create the new <%= patternNamePC %> instance object according given provider
	 *
	 * @export
	 * @param {string} <%= patternName %>Id ID of the Pattern that a new instance will be created.
	 * @param {OSUIFramework.Patterns.<%= patternNamePC %>.Enum.Mode} mode
	 * @param {string} configs Configurations for the Pattern in JSON format.
	 * @return {*}  {OSUIFramework.Patterns.Progress.I<%= patternNamePC %>}
	 */
	export function New<%= patternNamePC %>(
		<%= patternName %>Id: string,
		configs: string,
		mode: OSUIFramework.Patterns.<%= patternNamePC %>.Enum.Mode,
		provider: string
	): OSUIFramework.Patterns.<%= patternNamePC %>.I<%= patternNamePC %> {
		let _<%= patternName %>Item = null;

		switch (provider) {
			case Enum.Provider.<%= providerNamePC %>:
				_<%= patternName %>Item = Providers.<%= patternNamePC %>.<%= providerNamePC %>.Factory.New<%= providerNamePC %>(<%= patternName %>Id, mode, configs);

				break;

			default:
				/* TODO (by CreateNewPattern): 
					The line below is created by the CreateNewPattern mechanism, that is not able to replace values
					as expected, that said, check other patterns to understand how to replace it!
				*/
				throw new Error("There is no "+ GlobalEnum.PatternsNames.<%= patternNamePC %> +" of the "+ provider +" provider");
		}

		return _<%= patternName %>Item;
	}
}
