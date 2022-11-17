// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.Patterns.FlipContent {
	export class FlipContentConfig extends AbstractConfiguration {
		public FlipSelf: boolean;
		public IsFlipped: boolean;

		constructor(config: JSON) {
			super(config);
		}

		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return key !== Enum.Properties.IsFlipped;
			}
			return true;
		}
	}
}
