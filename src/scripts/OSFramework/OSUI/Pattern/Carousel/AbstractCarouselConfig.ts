// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace OSFramework.OSUI.Patterns.Carousel {
	export abstract class AbstractCarouselConfig extends Patterns.AbstractProviderConfiguration {
		// Advances the slides automatically.
		public AutoPlay: boolean;
		// Slide direction: ltr, rtl or ttb (vertical).
		public Direction: GlobalEnum.Direction.LTR | GlobalEnum.Direction.RTL | GlobalEnum.Direction.TTB;
		// Height of the carousel (CSS length or pixel number); auto by default, required for the vertical direction.
		public Height: string | number;
		// Number of items visible at once on desktop.
		public ItemsDesktop: number;
		// Gap between items (CSS length or pixel number); 0px by default.
		public ItemsGap: string | number;
		// Number of items visible at once on phones.
		public ItemsPhone: number;
		// Number of items visible at once on tablets.
		public ItemsTablet: number;
		// Rewinds to the first item after the last one.
		public Loop: boolean;
		// Navigation controls to render: Arrows, Dots, Both or None.
		public Navigation: Enum.Navigation;
		// Padding on both ends of the track so neighbouring items peek in (CSS length or pixel number).
		public Padding: string | number;
		// Zero-based index of the item shown first.
		public StartingPosition: number;

		constructor(config: JSON) {
			super(config);
		}

		/**
		 * Method that will check if a given property (key) can be changed/updated!
		 *
		 * @param isBuilt True when pattern has been built!
		 * @param key property name
		 * @returns {boolean} boolean
		 * @memberof  OSFramework.Patterns.Carousel.AbstractCarouselConfig
		 */
		public validateCanChange(isBuilt: boolean, key: string): boolean {
			if (isBuilt) {
				return key !== Enum.Properties.StartingPosition;
			}
			return true;
		}

		/**
		 * Method that will check if a given property (key) value is the type expected!
		 *
		 * @param key property name
		 * @param value value to be check
		 * @returns {unknown} value
		 * @memberof  OSFramework.Patterns.Carousel.AbstractCarouselConfig
		 */
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
				case Enum.Properties.Height:
					validatedValue = this.validateString(value as string, Enum.Defaults.Height);
					break;
				case Enum.Properties.AutoPlay:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				case Enum.Properties.ItemsGap:
					validatedValue = this.validateString(value as string, Enum.Defaults.SpaceNone);
					break;
				case Enum.Properties.Loop:
					validatedValue = this.validateBoolean(value as boolean, true);
					break;
				case Enum.Properties.Padding:
					validatedValue = this.validateString(value as string, Enum.Defaults.SpaceNone);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}
	}
}
