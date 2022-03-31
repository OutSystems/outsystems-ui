// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Rating {
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
