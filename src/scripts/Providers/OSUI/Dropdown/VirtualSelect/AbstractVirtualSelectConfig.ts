/* eslint-disable @typescript-eslint/no-unused-vars, no-extra-boolean-cast */
namespace Providers.OSUI.Dropdown.VirtualSelect {
	/**
	 * Class that represents the custom configurations received by the Dropdown.
	 *
	 * @export
	 * @class AbstractVirtualSelectConfig
	 * @extends {AbstractDropdownConfig}
	 */
	export abstract class AbstractVirtualSelectConfig
		extends OSFramework.OSUI.Patterns.Dropdown.AbstractDropdownConfig
	{
		// Store grouped options
		private _groupedOptionsList: GroupDropDownOption[];
		// Store the Provider Options
		private _providerOptions: VirtualSelectOpts;
		// Store configs set using extensibility
		protected providerExtendedOptions: VirtualSelectOpts;
		public ElementId: string;
		public NoOptionsText: string;
		public NoResultsText: string;
		public OptionsList: DropDownOption[];
		public PopupDropboxBreakpoint: string;
		public Prompt: string;
		public SanitizeDropdownValues = false;
		public SearchPrompt: string;
		public ShowDropboxAsPopup = true;
		public StartingSelection: DropDownOption[];

		// Method used to check if an image or an icon should be added to the given option
		private _checkForFigType(option: DropDownOption): Enum.FigureType {
			let hasImage = Enum.FigureType.None;

			// Check if image_url_or_class filed has info
			if (!!option && !!option.image_url_or_class) {
				// The given info doesn't have spaces on it, check if it's a valid URL
				hasImage = OSFramework.OSUI.Helper.URL.IsImage(option.image_url_or_class)
					? Enum.FigureType.Image
					: Enum.FigureType.Icon;
			}

			return hasImage;
		}

		// Method to build the group list format required by the provider:
		// [
		// 	{
		// 	  label: 'Option Group 1',
		// 	  options: [{ label: 'Option 1-1', value: '1' }, ... ]
		// 	},
		// 	...
		// ]
		private _getGroupedOptionsList(): [boolean, GroupDropDownOption[]] {
			const options: GroupDropDownOption[] = [];
			let previousKey: string = undefined;
			const [hasDescription, groupedOptions] = this._groupOptions();

			for (const key in groupedOptions) {
				options.push({
					/* The key is the group_name exactly as the app set it. Escaping it is the library's job
					through enableSecureText, which SanitizeDropdownValues maps to: it runs every option
					label - group titles included - through secureText() before storing it. */
					label: key,
					options: groupedOptions[key],

					// When using grouped options, we need to calculate the index
					// to match the option index provided by VirtuaSelect
					index: groupedOptions[previousKey]
						? options[options.length - 1].index + groupedOptions[previousKey].length + 1
						: 0,
				});
				previousKey = key;
			}

			return [hasDescription, options];
		}

		// Method used to generate the HTML String to be attached at the option label
		private _getOptionIconPrefix(option: DropDownOption): string {
			/* The returned String is written into the dropbox innerHTML by the library, so the element is
			built through the DOM and only then serialized: that way the browser escapes the class attribute
			for us and an image_url_or_class carrying a double quote can not close the attribute and inject
			markup of its own. Assigning className keeps the exact same class list this used to produce. */
			const icon = document.createElement(OSFramework.OSUI.GlobalEnum.HTMLElement.Icon);
			icon.className = `${Enum.CssClass.OptionItemIcon} ${option.image_url_or_class}`;

			return icon.outerHTML;
		}

		// Method used to generate the HTML String to be attached at the option label
		private _getOptionImagePrefix(option: DropDownOption): string {
			/* Built through the DOM for the same reason as the icon prefix: Sanitize() does not escape the
			double quote, and IsImage() accepts an image extension followed by a query String, so an url
			such as `photo.png?" onerror="` used to break out of the src attribute. Serializing an element
			leaves the url itself untouched - the serializer only escapes what would be ambiguous inside the
			attribute - unlike Sanitize(), which would replace any angle bracket the url legitimately has. */
			const image = document.createElement(OSFramework.OSUI.GlobalEnum.HTMLElement.Image);
			image.className = Enum.CssClass.OptionItemImage;
			image.setAttribute(OSFramework.OSUI.GlobalEnum.HTMLAttributes.Src, option.image_url_or_class);

			return image.outerHTML;
		}

		// Method used to generate the option info that will be added
		private _getOptionInfo(data: VirtualSelectOptionInfo): string {
			let prefix = '';
			let index: number;
			let groupIndex: number;

			// Group titles do not have labels thus it can skip this block
			if (!data.isGroupTitle) {
				// If it has group options, we need to use the calculated group index in order to match
				// with the one received from the provider
				if (data.isGroupOption) {
					groupIndex = this._groupedOptionsList.findIndex((group) => group.index === data.groupIndex);
					index = data.index - (data.groupIndex + 1);
				} else {
					groupIndex = 0;
					index = data.index;
				}

				// Check if an image should be added to the Option item
				const hasFigureType = this._checkForFigType(this._groupedOptionsList[groupIndex].options[index]);

				switch (hasFigureType) {
					case Enum.FigureType.Image:
						prefix = this._getOptionImagePrefix(this._groupedOptionsList[groupIndex].options[index]);
						break;
					case Enum.FigureType.Icon:
						prefix = this._getOptionIconPrefix(this._groupedOptionsList[groupIndex].options[index]);
						break;
				}
			}

			return `${prefix}${data.label}`;
		}

		// Provide a list in Virtual Select format depending if it is has groups or not
		private _getOptionsList() {
			// If the _groupedOptionsList has just one group that does not have a defined label,
			// we infere that this should be that this is a regular DropDownOption list,
			// otherwise this is a GroupDropDownOption List
			if (this._groupedOptionsList.length === 1 && !!!this._groupedOptionsList[0].label) {
				return this._groupedOptionsList[0].options;
			} else {
				return this._groupedOptionsList;
			}
		}

		// Auxiliary method to group the options into an object where:
		// keys correspond to the names of the groups
		// values correspond to a list of the options in the group
		private _groupOptions(): [boolean, { [key: string]: DropDownOption[] }] {
			let hasDescription = false;

			const groupOptionsObject = this.OptionsList.reduce(function (
				previousValue: { [key: string]: DropDownOption[] },
				option: DropDownOption
			) {
				const group_name = option.group_name || '';
				const description = option.description || '';

				option.customData = {};

				/* We need to set the customData to obtain it when getSelectedOptions() invoked.
				Both entries are kept exactly as the app set them: the library escapes them where it uses
				them - it runs them through secureText() and then through the aria-label boundary - and
				getSelectedValues() should hand an app back the values it provided. */
				if (description !== '') {
					option.customData = { description: description };
					hasDescription = true;
				}
				if (group_name !== '') {
					option.customData = { ...option.customData, group_name: group_name };
				}

				previousValue[group_name] = previousValue[group_name] || [];
				previousValue[group_name].push(option);

				return previousValue;
			}, {});
			return [hasDescription, groupOptionsObject];
		}

		/**
		 * Method used to set all the common VirtualSelect properties across the different types of instances
		 *
		 * @returns [VirtualSelectOpts]
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelectConfig
		 */
		public getProviderConfig(): VirtualSelectOpts {
			/* The option text - label, description and group_name - is handed to the library exactly as the
			app set it, and escaping it is what SanitizeDropdownValues is for: it maps to enableSecureText,
			under which the library runs every label (group titles included) and every description through
			secureText() before storing them, and escapes them again at each attribute boundary it writes.
			OSUI used to sanitize these three here instead, unconditionally, which put it on the wrong side
			of the property in both positions: with SanitizeDropdownValues True the library already escapes
			them, so the extra pass was redundant; with it False the app has asked for its markup to render,
			and the extra pass was the only thing stopping it. It was also lossier than the library's - the
			`<` to `‹` substitution is never undone, so it reaches the app back through getSelectedValues(),
			is announced as a guillemet by assistive technology, and makes the text unsearchable, while the
			library escapes to entities, derives labelNormalized from the raw text and decodes the entities
			back for accessible names. What stays ours is the icon and image prefix, since
			image_url_or_class never reaches the library at all. */

			// We need to keep the _groupedOptionsList in order to use it in this._getOptionInfo method
			const [hasDescription, groupedOptionsList] = this._getGroupedOptionsList();
			this._groupedOptionsList = groupedOptionsList;

			// Set the library options
			this._providerOptions = {
				ele: this.ElementId,
				enableSecureText: this.SanitizeDropdownValues,
				disabled: this.IsDisabled,
				/* OSUI owns validation: the platform calls validation(), which applies
				.osui-dropdown--not-valid and appends its own .osui-dropdown-error-message. Turning the
				library's validate() off keeps that ownership explicit and prevents a half-applied state
				where the library marks the combobox aria-invalid and points aria-describedby at its own
				message element, which OSUI hides. An app that deliberately wants the library's
				validation can still set `disableValidation: false` through the extensibility configs,
				since those are merged last. */
				disableValidation: true,
				dropboxWrapper: OSFramework.OSUI.GlobalEnum.HTMLElement.Body,
				hasOptionDescription: hasDescription,
				hideClearButton: false,
				labelRenderer: this._getOptionInfo.bind(this),
				noOptionsText: this.NoOptionsText,
				noSearchResultsText: this.NoResultsText,
				options: this._getOptionsList() as [],
				placeholder: this.Prompt,
				search: true,
				searchNormalize: true,
				searchPlaceholderText: this.SearchPrompt,
				selectAllOnlyVisible: true,
				selectedValue: this.getSelectedValues() as [],
				showDropboxAsPopup: this.ShowDropboxAsPopup,
				popupDropboxBreakpoint: this.PopupDropboxBreakpoint,
				showSecureTextWarning: false,
				silentInitialValueSet: true,
				textDirection: OutSystems.OSUI.Utils.GetIsRTL()
					? OSFramework.OSUI.GlobalEnum.Direction.RTL
					: OSFramework.OSUI.GlobalEnum.Direction.LTR,
				updatePositionThrottle: 0,
				useGroupValue: true,
				zIndex: 251, // Higher than Sidebar and Popup
			};

			return this._providerOptions;
		}

		/**
		 * Method to validate and save the external provider configs
		 *
		 * @param {VirtualSelectOpts} newConfigs
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelectConfig
		 */
		public setExtensibilityConfigs(newConfigs: VirtualSelectOpts): void {
			if (newConfigs[Enum.ExtendedConfigs.hasOptionDescription] !== undefined)
				console.warn(
					`The option description may be affected when modifying the property ${Enum.ExtendedConfigs.hasOptionDescription}.`
				);

			this.providerExtendedOptions = newConfigs;
		}

		/**
		 * Override, Validate configs key values
		 *
		 * @param {string} key
		 * @param {unknown} value
		 * @memberof Providers.OSUI.Dropdown.VirtualSelect.AbstractVirtualSelectConfig
		 */
		public validateDefault(key: string, value: unknown): unknown {
			let validatedValue = undefined;

			switch (key) {
				case Enum.Properties.OptionsList:
					validatedValue = value as DropDownOption;
					break;
				case Enum.Properties.StartingSelection:
					validatedValue = value as DropDownOption;
					break;
				default:
					validatedValue = super.validateDefault(key, value);
					break;
			}

			return validatedValue;
		}

		// Common methods all DropdownsConfigs must implement
		protected abstract getSelectedValues(): string[];
	}
}
