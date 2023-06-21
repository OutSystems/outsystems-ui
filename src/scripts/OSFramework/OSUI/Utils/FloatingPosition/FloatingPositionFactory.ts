/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSFramework.OSUI.Utils.FloatingPosition.Factory {
	export function NewFloatingPosition(configs: FloatingPositionConfig, provider: string): void {
		let _floatingPositionItem = null;

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
