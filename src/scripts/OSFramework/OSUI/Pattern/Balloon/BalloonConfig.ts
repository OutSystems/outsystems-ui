// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Balloon {
	/**
	 * Class that represents the custom configurations received by the Balloon.
	 *
	 * @export
	 * @class BalloonConfig
	 * @extends {AbstractConfiguration}
	 */
	export class BalloonConfig extends AbstractConfiguration {
		public Alignment: string;
		public AllowedPlacements: Array<GlobalEnum.FloatingPosition>;
		public AnchorId: string;
		public AnchorType: BalloonAnchor;
		public Position: GlobalEnum.FloatingPosition;
		public Shape: GlobalEnum.ShapeTypes;

		constructor(config: JSON) {
			super(config);
		}
	}
}
