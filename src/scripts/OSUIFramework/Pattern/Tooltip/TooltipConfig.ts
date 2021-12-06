// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Tooltip {
	/**
	 * Class that represents the custom configurations received by the Tooltip.
	 *
	 * @export
	 * @class TooltipConfig
	 * @extends {AbstractConfiguration}
	 */
	export class TooltipConfig extends AbstractConfiguration {
		private _position: GlobalEnum.Position;
		public IsHover: boolean;
		public IsVisible: boolean;

		constructor(config: JSON) {
			super(config);
		}

		public get Position(): GlobalEnum.Position {
			return this._position;
		}

		public set Position(newPosition: string) {
			const position = BoundsPosition.GetPositionByClass(newPosition);
			if (position === undefined) {
				this._position = GlobalEnum.Position.Bottom;
			} else {
				this._position = GlobalEnum.Position[position];
			}
		}
	}
}
