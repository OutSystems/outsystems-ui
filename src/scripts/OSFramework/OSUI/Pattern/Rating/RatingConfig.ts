// eslint-disable-next-line @typescript-eslint/no-unused-vars
<<<<<<<< HEAD:src/scripts/OSFramework/Pattern/Rating/RatingConfig.ts
namespace OSFramework.Patterns.Rating {
========
namespace OSFramework.OSUI.Patterns.Rating {
>>>>>>>> origin/rc2.16.0:src/scripts/OSFramework/OSUI/Pattern/Rating/RatingConfig.ts
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
