// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Rating {
	/**
	 * Class that represents the custom configurations received by the Rating.
	 *
	 * @export
	 * @class RatingConfig
	 * @extends {AbstractConfiguration}
	 */
	export class RatingConfig extends AbstractConfiguration {
		public IsEdit: boolean;
		public RatingScale: number;
		public RatingValue: number;
		public Size: string;

		constructor(config: JSON) {
			super(config);
		}
	}
}
