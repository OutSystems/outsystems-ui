import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const DROPDOWN_TAGS_DOC: PatternDocMeta = {
	name: 'Dropdown Tags',
	category: 'Interaction',
	lede: 'A searchable multi-select that shows every chosen option as a removable chip — for skills, labels, recipients and any other "pick several" field where the user needs to see the whole selection.',
	overview:
		'Dropdown Tags is the tags mode of the VirtualSelect dropdown. Selection is always multiple: ticked options render as chips inside the control, each with its own clear button, and the dropbox keeps a search input and the checkbox list fed by OptionsList. OnChanged reports the full selection every time a chip is added or removed.',
	stylingSelector: '.osui-dropdown.osui-dropdown-tags',
	odcUrl: 'https://success.outsystems.com/documentation/outsystems_developer_cloud/building_apps/user_interface/patterns/interaction/dropdown_tags/',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/dropdown_tags/',
	liveStoryId: 'patterns-interaction-dropdown-tags--basic-usage',
	cssApiSlug: 'patterns-interaction-dropdown-tags',
	whenToUse: [
		'Multi-select fields where the chosen values must stay visible — tags, skills, categories, recipients.',
		'Option lists long enough to need the search box, where a column of checkboxes would not fit.',
		'Filters that users add and remove one at a time while reviewing the result set.',
	],
	whenNotToUse: [
		'Single-value choices — use Dropdown (search mode) or a plain Dropdown widget.',
		'Selections that routinely exceed a handful of items; the chips wrap and push the form down — summarise the count with Dropdown and AllowMultipleSelection instead.',
	],
	anatomy: {
		tree: `<div class="osui-dropdown osui-dropdown-tags vscomp-ele" name="<id>"> <!-- pattern root; VirtualSelect mounts here -->
  <div class="vscomp-wrapper show-value-as-tags">
    <div class="vscomp-toggle-button"> <!-- trigger -->
      <div class="vscomp-value"> <!-- Prompt while empty -->
        <span class="vscomp-value-tag"> <!-- one chip per selected option -->
          <span class="vscomp-value-tag-content">Label</span>
          <span class="vscomp-value-tag-clear-button"></span>
        </span>
      </div>
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
        <div class="vscomp-option"> <!-- one per OptionsList entry, with a checkbox-icon -->
          <span class="vscomp-option-text">Label</span>
        </div>
      </div>
    </div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Dropdown Tags',
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
					description: 'List of options that appear pre-selected — as chips — when the dropdown is built.',
				},
				{
					name: 'Prompt',
					type: 'Text',
					defaultValue: '"Select..."',
					description: 'Text shown while no chip is selected; also serves as the empty value.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the Dropdown Tags root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
		{
			title: 'OptionalConfigs',
			rows: [
				{
					name: 'OptionalConfigs.IsDisabled',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'When True, the dropdown renders disabled: chips stay visible but cannot be removed or added.',
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
		{ name: 'Initialized', description: 'Fires once the Dropdown Tags instance is ready (DropdownTagsId).' },
		{
			name: 'OnChanged',
			description:
				'Fires each time a chip is added or removed, with SelectedOptionList holding the whole current selection.',
		},
	],
	apiSections: [
		{
			title: 'Dropdown API',
			rows: [
				{ name: 'Create', description: 'Register a Dropdown instance (mode tags, provider VirtualSelect).' },
				{ name: 'Initialize', description: 'Mount VirtualSelect on the root and render the option list.' },
				{ name: 'Open / Close', description: 'Programmatically show or hide the dropbox.' },
				{ name: 'Enable / Disable', description: 'Toggle the disabled state at runtime.' },
				{ name: 'Clear', description: 'Remove every chip (optionally without firing OnChanged).' },
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
			' toggles a checkbox and ',
			React.createElement(PdKey, null, 'Esc'),
			' closes.'
		),
		'Each chip has its own clear button, so a selection can be undone from the control without reopening the list; typing while open filters the options.',
		'VirtualSelect announces the option count and selection in a live region; give the control an accessible name with the SetVirtualSelectConfigs client action (ariaLabelText) when it has no visible label.',
		'On phones the dropbox opens as a full-width popup with a close button, so the list stays reachable above the keyboard.',
	],
	related: [
		{ name: 'Dropdown', storyId: 'patterns-interaction-dropdown--docs' },
		{ name: 'Tag', storyId: 'patterns-content-tag--docs' },
		{ name: 'Dropdown Server Side', storyId: 'patterns-advanced-dropdownserverside--docs' },
	],
};
