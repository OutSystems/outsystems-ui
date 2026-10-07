/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.OSUI.Utils.FloatingPosition.Factory {
	/**
	 * FloatingPosition Factory
	 *
	 * @param configs
	 * @param provider
	 */
	export function NewFloatingPosition(configs: FloatingPositionConfig, provider: string): FloatingPosition {
		let _floatingPositionItem: FloatingPosition = null;

		switch (provider) {
			case Enum.Provider.FloatingUI:
				_floatingPositionItem = new Providers.OSUI.Utils.FloatingUI(configs);

				break;

			default:
				throw new Error(`There is no FloatingPosition of the ${provider} provider`);
		}

		return _floatingPositionItem;
	}
}
