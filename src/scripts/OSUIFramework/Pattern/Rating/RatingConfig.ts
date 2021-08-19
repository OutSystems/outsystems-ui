// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Rating {
	export class RatingConfig extends AbstractConfiguration {
		public RatingValue: number;
		public RatingScale: number;
		public IsEdit: boolean;
		public Size: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
