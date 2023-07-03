// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/SectionIndexItem/SectionIndexItemConfig.ts
namespace OSFramework.Patterns.SectionIndexItem {
========
namespace OSFramework.OSUI.Patterns.SectionIndexItem {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/SectionIndexItem/SectionIndexItemConfig.ts
	/**
	 * Class that represents the custom configurations received by the SectionIndexItem.
	 *
	 * @export
	 * @class SectionIndexItemConfig
	 * @extends {AbstractConfiguration}
	 */
	export class SectionIndexItemConfig extends AbstractConfiguration {
		public ScrollToWidgetId: string;

		/**
		 * Method that will check if a given property (key) can be changed/updated!
		 *
		 * @param isBuilt True when pattern has been built!
		 * @param key property name
		 * @returns {boolean} boolean
		 * @memberof  OSFramework.Patterns.SectionIndexItem.SectionIndexItemConfig
		 */
		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return key !== Enum.Properties.ScrollToWidgetId;
			}
			return true;
		}
	}
}
