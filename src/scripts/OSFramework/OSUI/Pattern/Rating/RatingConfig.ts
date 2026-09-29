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
		// Lets the user change the rating; when false it is read-only.
		public IsEdit: boolean;
		// Number of rating items (0–100).
		public RatingScale: number;
		// Current rating; decimals render a half-filled item.
		public RatingValue: number;
		// Size modifier appended as the rating-<Size> class (empty for the default size).
		public Size: string;

		constructor(config: JSON) {
			super(config);
		}
	}
}
