// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSUIFramework.Patterns.Carousel {
	export abstract class AbstractCarouselConfig extends Patterns.AbstractProviderConfiguration {
		public AutoPlay: boolean;
		public Gap: string;
		public ItemsDesktop: number;
		public ItemsPhone: number;
		public ItemsTablet: number;
		public Loop: boolean;
		public Navigation: Enum.Navigation;
		public Padding: string;
		public StartingPosition: number;

		constructor(config: JSON) {
			super(config);
		}

		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return key !== Enum.Properties.StartingPosition;
			}
			return true;
		}

		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;
			switch (key) {
				case Enum.Properties.Navigation:
					validatedValue = this.validateInRange(
						value,
						Enum.Navigation.Both,
						Enum.Navigation.Arrows,
						Enum.Navigation.Dots,
						Enum.Navigation.None
					);
					break;
				case Enum.Properties.ItemsDesktop:
				case Enum.Properties.ItemsTablet:
				case Enum.Properties.ItemsPhone:
					validatedValue = this.validateNumber(value as number, 1);
					break;
				case Enum.Properties.AutoPlay:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.Gap:
					validatedValue = this.validateString(value as string, '0');
					break;
				case Enum.Properties.Loop:
					validatedValue = this.validateBoolean(value as boolean, true);
					break;
				case Enum.Properties.Padding:
					validatedValue = this.validateString(value as string, '0');
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
