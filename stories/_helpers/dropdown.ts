/**
 * Shared harness for the VirtualSelect-backed Dropdown stories — search mode in
 * `Dropdown.stories.ts`, tags mode in `DropdownTags.stories.ts`.
 *
 * Runtime contract (Providers/OSUI/Dropdown/VirtualSelect/):
 *  • Signature is `DropdownAPI.Create(id, mode, provider, configs)` — mode and
 *    provider precede configs. Options are data-driven (`OptionsList` in the
 *    config, not DOM) and `StartingSelection` pre-selects.
 *  • VirtualSelect mounts on the element whose id === the pattern id and
 *    appends its dropbox to <body>. Requires `window.VirtualSelect`.
 *  • Search mode supports `AllowMultipleSelection`; tags mode is always
 *    multiple and renders the selection as chips (`showValueAsTags`).
 */

import { cfg, osuiRoot, Patterns, type Register } from './osui';

/** A dropdown mode: mirrors the low-code Dropdown vs DropdownTags blocks. */
export type DropdownMode = 'search' | 'tags';

/** The option set every dropdown story uses. */
export const DROPDOWN_OPTIONS = [
	{ label: 'Apple', value: 'apple' },
	{ label: 'Banana', value: 'banana' },
	{ label: 'Cherry', value: 'cherry' },
] as const;

/**
 * The widget root the platform emits — carries the mode class
 * (`osui-dropdown-search` / `osui-dropdown-tags`).
 *
 * @param id the pattern id
 * @param mode search or tags
 * @returns the root markup string
 */
export function dropdownMarkup(id: string, mode: DropdownMode): string {
	return `<div ${osuiRoot(id)} class="osui-dropdown osui-dropdown-${mode}" style="max-width:280px;"></div>`;
}

/**
 * Create → Initialize → register Dispose for one dropdown instance.
 *
 * @param id the pattern id
 * @param mode search or tags
 * @param configs per-story overrides merged over the defaults (e.g. `IsDisabled`, `AllowMultipleSelection`, `StartingSelection`)
 * @param register teardown registry of the rendering story
 */
export function initDropdown(
	id: string,
	mode: DropdownMode,
	configs: Record<string, unknown>,
	register: Register
): void {
	const P = Patterns();
	P.DropdownAPI.Create(
		id,
		mode,
		'virtual-select',
		cfg({
			IsDisabled: false,
			OptionsList: [...DROPDOWN_OPTIONS],
			StartingSelection: [],
			Prompt: 'Choose a fruit',
			SearchPrompt: 'Search…',
			NoOptionsText: 'No options',
			NoResultsText: 'No results',
			...configs,
		})
	);
	P.DropdownAPI.Initialize(id);
	register(() => P.DropdownAPI.Dispose?.(id));
}

/**
 * Pin a dropdown's dropbox permanently open (VirtualSelect `keepAlwaysOpen`,
 * injected via the `SetProviderConfigs` extensibility API, which redraws) —
 * `Open()` doesn't work on a board because each open steals focus and closes
 * the previous one.
 *
 * @param id the pattern id of an initialized dropdown
 */
export function pinDropdownOpen(id: string): void {
	Patterns().DropdownAPI.SetProviderConfigs(id, { keepAlwaysOpen: true });
}
