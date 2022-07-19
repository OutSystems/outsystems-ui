// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.SectionIndexItem {
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
		 * Method that validates if a given property can be changed.
		 *
		 * @param {boolean} isBuilt
		 * @param {string} key
		 * @return {*}  {boolean}
		 * @memberof SectionIndexItemConfig
		 */
		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return key !== Enum.Properties.ScrollToWidgetId;
			}
			return true;
		}
	}
}
