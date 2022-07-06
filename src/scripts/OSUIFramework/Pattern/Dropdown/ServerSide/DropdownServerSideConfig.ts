/* eslint-disable @typescript-eslint/no-unused-vars */
namespace OSUIFramework.Patterns.Dropdown.ServerSide {
	/**
	 * Class that represents the custom configurations received by the Dropdown.
	 *
	 * @export
	 * @class OSUIDropdownServerSideConfig
	 * @extends {OSUIFramework.Patterns.AbstractConfiguration}
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	export class OSUIDropdownServerSideConfig extends OSUIFramework.Patterns.AbstractConfiguration {
		// Store the MaxHeight for the balloon
		private _balloonMaxHeight = Enum.PropertiesValues.MaxHeight;
		// Store the BalloonOptions container AriaLabel text
		private _balloonOptionsArialabel = '';
		// Store the SelectValuesWrapper AriaLabel text
		private _selectValuesWrapperAriaLabel = Enum.PropertiesValues.SelectValuesWrapperAriaLabelValue;
		// Properties
		public AllowMultipleSelection: boolean;
		public IsDisabled: boolean;

		constructor(config: JSON) {
			super(config);

			this._balloonOptionsArialabel = this.AllowMultipleSelection
				? Enum.PropertiesValues.BalloonOptionsWrapperAriaLabelMultipleValue
				: Enum.PropertiesValues.BalloonOptionsWrapperAriaLabelSingleValue;
		}

		/**
		 * Override, validate configs key values
		 *
		 * @param {string} key
		 * @param {unknown} value
		 * @return {*}  {unknown}
		 * @memberof OSUIDropdownServerSideConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.AllowMultipleSelection:
				case Enum.Properties.IsDisabled:
					validatedValue = this.validateBoolean(value as boolean, false);
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}

		/**
		 * Getter that allows to obtain the MaxHeight that ballon should have.
		 *
		 * @readonly
		 * @type {number}
		 * @memberof OSUIDropdownServerSideConfig
		 */
		public get balloonMaxHeight(): number {
			return this._balloonMaxHeight as number;
		}

		/**
		 * Getter that allows to obtain the AriaLabel default text value to be added to balloon options container.
		 *
		 * @readonly
		 * @memberof OSUIDropdownServerSideConfig
		 */
		public get balloonOptionsArialabel(): string {
			return this._balloonOptionsArialabel as string;
		}

		/**
		 * Getter that allows to obtain the AriaLabel default text value to be added to select "input" container.
		 *
		 * @readonly
		 * @memberof OSUIDropdownServerSideConfig
		 */
		public get selectValuesWrapperAriaLabel(): string {
			return this._selectValuesWrapperAriaLabel as string;
		}
	}
}
