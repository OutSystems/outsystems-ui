import React from 'react';
import { PdKey } from './PatternDocShell';
import type { PatternDocMeta } from './types';

export const DROPDOWN_SERVER_SIDE_DOC: PatternDocMeta = {
	name: 'Dropdown Server Side',
	category: 'Advanced',
	lede: 'A dropdown whose options are blocks you render yourself — built for large datasets with pagination, query-based search and custom balloon content.',
	overview:
		'Dropdown Server Side ships only the shell: a trigger (SelectedValues placeholder), and a balloon with a search input, a footer and a BalloonContent placeholder where you drop a List of Dropdown Server Side Item blocks. The runtime positions the balloon, handles keyboard navigation and open/close state, and each item reports its ItemId through OnSelected so your screen logic decides what "selected" means and re-renders the trigger.',
	stylingSelector: '.osui-dropdown-serverside',
	o11Url: 'https://success.outsystems.com/documentation/11/building_apps/user_interface/patterns/using_mobile_and_reactive_patterns/interaction/dropdown_server_side/',
	liveStoryId: 'patterns-advanced-dropdownserverside--basic-usage',
	cssApiSlug: 'patterns-interaction-dropdown-serverside',
	whenToUse: [
		'Option lists too large to ship to the client at once — paginate or infinite-scroll the List inside BalloonContent.',
		'Search that must hit the server (an aggregate or REST call filtered by the search input) rather than filter a local list.',
		'Rich options or balloon chrome — avatars, descriptions, a footer with "Apply" and "Clear" buttons, a title.',
	],
	whenNotToUse: [
		'A static list that fits in memory — Dropdown or Dropdown Tags give you search and selection for free.',
		'Simple forms where the extra wiring (OnSelected handler, selected-state variable, trigger expression) is not worth it.',
	],
	anatomy: {
		tree: `<div class="osui-dropdown-serverside" name="<id>">
  <div class="osui-dropdown-serverside__selected-values-wrapper" tabindex="0"> <!-- trigger -->
    <div class="osui-dropdown-serverside__selected-values">
      <!-- SelectedValues placeholder: an Expression with the chosen label(s) -->
    </div>
  </div>
  <div class="osui-dropdown-serverside__balloon osui-balloon" data-uniqueid="<id>">
    <div class="osui-dropdown-serverside__balloon-container">
      <div class="osui-dropdown-serverside__balloon-search">
        <!-- BalloonSearchInput placeholder (Input) + BalloonSearchInputIcon placeholder -->
      </div>
      <div class="osui-dropdown-serverside__balloon-content">
        <!-- BalloonContent placeholder: a List of Dropdown Server Side Item -->
        <div class="osui-dropdown-serverside-item" name="<itemId>"> <!-- --is-selected when picked -->
          <div class="osui-dropdown-serverside-item__content">
            <!-- DropdownItemContent placeholder -->
          </div>
        </div>
      </div>
      <div class="osui-dropdown-serverside__balloon-footer">
        <!-- BalloonFooter placeholder (hidden when empty) -->
      </div>
    </div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Dropdown Server Side',
			rows: [
				{
					name: 'AllowMultipleSelection',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'When False the balloon closes as soon as an option is picked; when True it stays open so the user can keep selecting.',
				},
				{
					name: 'IsDisabled',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'When True, the trigger renders disabled and the balloon cannot be opened.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the Dropdown Server Side root. Example: myclass or myclass1 myclass2. OutSystems UI utility classes are supported.',
				},
			],
		},
		{
			title: 'Dropdown Server Side Item',
			rows: [
				{
					name: 'ItemId',
					type: 'Text',
					description:
						'Identifier of the option (mandatory) — reported as ItemOptionId in OnSelected so your logic knows which record was picked.',
				},
				{
					name: 'IsSelected',
					type: 'Boolean',
					defaultValue: 'False',
					description:
						'When True, the item is built with the selected highlight — bind it to your selection state.',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description: 'Extra CSS classes on the item root.',
				},
			],
		},
	],
	events: [
		{
			name: 'Initialized',
			description: 'Fires once the Dropdown Server Side instance is ready (DropdownServerSideId).',
		},
		{ name: 'OnToggle', description: 'Fires each time the balloon opens or closes, with IsOpen.' },
		{
			name: 'OnSelected (item)',
			description:
				'Fires on the Dropdown Server Side Item that was clicked, with ItemOptionId and the parent DropdownServerSideId — update your selection variable and the SelectedValues expression here.',
		},
	],
	apiSections: [
		{
			title: 'Dropdown API',
			rows: [
				{
					name: 'Create',
					description: 'Register a Dropdown instance (mode server-side, provider osui-components).',
				},
				{ name: 'Initialize', description: 'Wire the trigger, balloon, search input and keyboard handling.' },
				{ name: 'Open / Close', description: 'Programmatically show or hide the balloon.' },
				{ name: 'Enable / Disable', description: 'Toggle the disabled state at runtime.' },
				{ name: 'Clear', description: 'Unselect every item (optionally without firing OnSelected).' },
				{ name: 'GetSelectedValues', description: 'Read the selected item ids as a JSON string.' },
				{
					name: 'SetValidation',
					description: 'Mark the control valid or invalid and show a validation message.',
				},
				{ name: 'ChangeProperty', description: 'Update a runtime property.' },
				{ name: 'RegisterCallback', description: 'Subscribe to OnToggle and other dropdown callbacks.' },
				{ name: 'Dispose', description: 'Tear down the balloon, listeners and child items.' },
			],
		},
		{
			title: 'Dropdown Server Side Item API',
			rows: [
				{
					name: 'Create',
					description: 'Register an item; it resolves its parent through the enclosing balloon.',
				},
				{ name: 'Initialize', description: 'Build the item and apply its IsSelected state.' },
				{ name: 'ChangeProperty', description: 'Update a runtime property such as IsSelected.' },
				{ name: 'RegisterCallback', description: 'Subscribe to OnSelected.' },
				{ name: 'Dispose', description: 'Tear down the item instance.' },
			],
		},
	],
	accessibility: [
		React.createElement(
			React.Fragment,
			null,
			'The trigger is focusable — ',
			React.createElement(PdKey, null, 'Enter'),
			', ',
			React.createElement(PdKey, { wide: true, children: 'Space' }),
			' or ',
			React.createElement(PdKey, null, '↓'),
			' open the balloon; ',
			React.createElement(PdKey, null, '↑'),
			' / ',
			React.createElement(PdKey, null, '↓'),
			' move between items, ',
			React.createElement(PdKey, null, 'Enter'),
			' selects and ',
			React.createElement(PdKey, null, 'Esc'),
			' closes and returns focus to the trigger.'
		),
		'The runtime sets aria-expanded on the trigger and toggles tabindex / aria-hidden on the search input, option list and footer controls so a closed balloon is skipped by the tab order.',
		'Keep the option label inside DropdownItemContent as text (or give images an alt) — the item itself has no accessible name of its own.',
		'With accessible features enabled (.has-accessible-features) the trigger, items and search input get visible focus rings, including a high-contrast variant.',
	],
	related: [
		{ name: 'Dropdown', storyId: 'patterns-interaction-dropdown--docs' },
		{ name: 'Dropdown Tags', storyId: 'patterns-interaction-dropdown-tags--docs' },
		{ name: 'Overflow Menu', storyId: 'patterns-navigation-overflowmenu--docs' },
	],
};
