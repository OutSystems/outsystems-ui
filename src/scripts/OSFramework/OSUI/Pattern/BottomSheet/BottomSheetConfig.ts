// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.BottomSheet {
	/**
	 * Class that represents the custom configurations received by the BottomSheet.
	 *
	 * @export
	 * @class BottomSheetConfig
	 * @extends {AbstractConfiguration}
	 */
	export class BottomSheetConfig extends AbstractConfiguration {
		public Shape: GlobalEnum.ShapeTypes;
		public ShowHandler: boolean;

		constructor(config: JSON) {
			super(config);
		}
	}
}
