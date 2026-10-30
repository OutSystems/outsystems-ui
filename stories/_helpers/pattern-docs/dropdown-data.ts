import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const DROPDOWN_DOC: PatternDocMeta = {
	name: 'Dropdown',
	category: 'Interaction',
	lede: 'A searchable select over a data-driven option list, with optional checkbox multi-selection — the pick for any list long enough that scrolling a native select would hurt.',
	overview:
		'The Dropdown Search block renders a VirtualSelect control: the trigger shows the Prompt or the selected labels, and the dropbox (appended to the body, or opened as a popup on phones) holds a search input and a virtualised option list fed by OptionsList. OnChanged reports the selection as a DropdownOption list every time it changes.',
	stylingSelector: '.osui-dropdown.osui-dropdown-search',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/dropdown_search/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/dropdown_search/',
	liveStoryId: 'patterns-interaction-dropdown--basic-usage',
	cssApiSlug: 'patterns-interaction-dropdown-search',
	whenToUse: [
		'Option lists long enough that users need to type to find a value (countries, products, teams, accounts).',
		'Forms where the options come from an aggregate or API and may change between loads.',
		'Multi-select pickers where the selected labels can be summarised as a count — for chips, use Dropdown Tags instead.',
	],
	whenNotToUse: [
		'Five or fewer fixed options — a plain Dropdown widget, radio group or Button Group is faster to scan.',
		'Paginated or server-filtered option sets with custom balloon content — use Dropdown Server Side.',
	],
	anatomy: {
		tree: `<div class="osui-dropdown osui-dropdown-search vscomp-ele" name="<id>"> <!-- pattern root; VirtualSelect mounts here -->
  <div class="vscomp-wrapper">
    <div class="vscomp-toggle-button"> <!-- trigger -->
      <div class="vscomp-value">Prompt or selected labels</div>
      <div class="vscomp-arrow"></div>
    </div>
  </div>
</div>
<!-- appended to <body> while open -->
<div class="vscomp-dropbox-container">
  <div class="vscomp-dropbox">
    <div class="vscomp-search-container">
      <input class="vscomp-search-input"> <!-- SearchPrompt -->
    </div>
    <div class="vscomp-options-container">
      <div class="vscomp-options-list">
        <div class="vscomp-option"> <!-- one per OptionsList entry; checkbox-icon in multi-select -->
          <span class="vscomp-option-text">Label</span>
        </div>
      </div>
    </div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Dropdown Search',
			rows: [
				{
					name: 'OptionsList',
					type: 'DropdownOption List',
					description:
						'List of options to show in the dropdown (mandatory). Each DropdownOption carries a value and a label, plus optional image_url_or_class, description and group_name.',
				},
				{
					name: 'StartingSelection',
					type: 'DropdownOption List',
					defaultValue: 'empty list',
					description: 'List of options that appear pre-selected when the dropdown is built.',
				},
				{
					name: 'Prompt',
					type: 'Text',
					defaultValue: '"Select..."',
					description: 'Text shown when nothing is selected; also serves as the empty value.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the Dropdown root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
		{
			title: 'OptionalConfigs',
			rows: [
				{
					name: 'OptionalConfigs.AllowMultipleSelection',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'When True, options get checkboxes and the user can select more than one; the dropbox stays open while picking.',
				},
				{
					name: 'OptionalConfigs.IsDisabled',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'When True, the dropdown renders disabled and cannot be opened.',
				},
				{
					name: 'OptionalConfigs.SearchPrompt',
					type: 'Text',
					description: 'Placeholder of the search input inside the dropbox.',
				},
				{
					name: 'OptionalConfigs.NoResultsText',
					type: 'Text',
					description: 'Message shown when a search matches no option.',
				},
				{
					name: 'OptionalConfigs.NoOptionsText',
					type: 'Text',
					defaultValue: '"There are no options to show."',
					description: 'Message shown when OptionsList is empty.',
				},
				{
					name: 'OptionalConfigs.SanitizeDropdownValues',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'When True, HTML in option labels and values is escaped before rendering. Off by default for performance.',
				},
			],
		},
	],
	events: [
		{ name: 'Initialized', description: 'Fires once the Dropdown Search instance is ready (DropdownSearchId).' },
		{
			name: 'OnChanged',
			description:
				'Fires each time the selection changes, with SelectedOptionList — the selected options are already applied, no need to feed them back into StartingSelection.',
		},
	],
	apiSections: [
		{
			title: 'Dropdown API',
			rows: [
				{ name: 'Create', description: 'Register a Dropdown instance (mode search, provider VirtualSelect).' },
				{ name: 'Initialize', description: 'Mount VirtualSelect on the root and render the option list.' },
				{ name: 'Open / Close', description: 'Programmatically show or hide the dropbox.' },
				{ name: 'Enable / Disable', description: 'Toggle the disabled state at runtime.' },
				{ name: 'Clear', description: 'Remove the current selection (optionally without firing OnChanged).' },
				{ name: 'GetSelectedValues', description: 'Read the selected values as a JSON string.' },
				{ name: 'SetValues', description: 'Select the given values (optionally without firing OnChanged).' },
				{
					name: 'SetValidation',
					description: 'Mark the control valid or invalid and show a validation message.',
				},
				{ name: 'TogglePopup', description: 'Switch between an anchored dropbox and a centred popup.' },
				{ name: 'SetProviderConfigs', description: 'Merge extra VirtualSelect options (e.g. ariaLabelText).' },
				{
					name: 'SetProviderEvent / UnsetProviderEvent',
					description: 'Subscribe to or remove a raw VirtualSelect event.',
				},
				{ name: 'ChangeProperty', description: 'Update a runtime property.' },
				{ name: 'RegisterCallback', description: 'Subscribe to OnToggle, OnSelected and other callbacks.' },
				{ name: 'Dispose', description: 'Destroy the VirtualSelect instance and release handlers.' },
			],
		},
	],
	accessibility: [
		React.createElement(
			React.Fragment,
			null,
			'The trigger is a focusable button — ',
			React.createElement(PdKey, null, 'Enter'),
			', ',
			React.createElement(PdKey, { wide: true, children: 'Space' }),
			' or ',
			React.createElement(PdKey, null, '↓'),
			' open the dropbox, ',
			React.createElement(PdKey, null, '↑'),
			' / ',
			React.createElement(PdKey, null, '↓'),
			' move through options, ',
			React.createElement(PdKey, null, 'Enter'),
			' selects and ',
			React.createElement(PdKey, null, 'Esc'),
			' closes.'
		),
		'Typing while the dropbox is open filters the list; the search input is focused automatically so the first keystroke is never lost.',
		'VirtualSelect announces the option count and selection in a live region; give the control an accessible name with the SetVirtualSelectConfigs client action (ariaLabelText) when it has no visible label.',
		'On phones the dropbox opens as a full-width popup with a close button, so the list stays reachable above the keyboard.',
	],
	related: [
		{ name: 'Dropdown Tags', storyId: 'patterns-interaction-dropdown-tags--docs' },
		{ name: 'Dropdown Server Side', storyId: 'patterns-advanced-dropdownserverside--docs' },
		{ name: 'Search', storyId: 'patterns-interaction-search--docs' },
	],
};
