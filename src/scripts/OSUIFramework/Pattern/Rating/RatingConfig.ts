// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Rating {
	export class RatingConfig extends AbstractConfiguration {
		public IsEdit: boolean;
		public RatingScale: number;
		public RatingValue: number;
		public Size: string;

		// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
		constructor(config: any) {
			super(config);
		}
	}
}
