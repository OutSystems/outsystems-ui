import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from '../_helpers/osui';

/**
 * Dropdown — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * The widget has two modes and they emit different DOM. Captured from
 * @outsystems/runtime-widgets-js@6.25.4 under React 17:
 *
 *   Custom (`dropdownMode: 1`) — a div-based control the platform drives itself:
 *     `div[data-dropdown].dropdown-container`
 *       > `div.dropdown-display[tabindex=0]` > `div.dropdown-display-content`
 *     …and, while expanded, a `.dropdown-list` sibling (see `CustomExpanded`).
 *
 *   Native (`dropdownMode: 0`) — a real `<select>`:
 *     `div[data-dropdown].dropdown-container#<id>-container`
 *       > `select.dropdown-display#<id>` > `option[value=-1|0..n]`
 *     The empty value is `value="-1"`; real options are indexed, not keyed by
 *     their own value.
 *
 * Two deliberate departures from the raw capture, both noted because they are the
 * only places this file is not a byte-for-byte transcription:
 *   1. `id`s are real. The React harness stubbed the platform's id service, so the
 *      capture contained artefacts (`id=""`, `id="-container"`). No OUI selector
 *      targets an id, so real ids are safe and make `label[for]` work.
 *   2. The native `<select>` carries `selected` on its current option. React sets
 *      selection through the DOM `value` property, which never appears in
 *      `innerHTML` — so the capture lost it and static markup has to state it.
 *
 * CSS contract: src/scss/03-widgets/_dropdown.scss.
 */
const meta: Meta = { title: 'Widgets/Dropdown' };
export default meta;
type Story = StoryObj;

const OPTIONS = ['Apple', 'Banana', 'Cherry'];

const nativeSelect = (id: string, selectedIndex: number) => `
	<div id="${id}-container" class="dropdown-container" data-dropdown="">
		<select class="dropdown-display " aria-disabled="false" id="${id}">
			<option value="-1">-- Select --</option>
			${OPTIONS.map((o, i) => `<option value="${i}"${i === selectedIndex ? ' selected=""' : ''}>${o}</option>`).join(
				'\n\t\t\t'
			)}
		</select>
	</div>`;

const customDisplay = (value: string) => `
	<div data-dropdown="" class="dropdown-container">
		<div class="dropdown-display" tabindex="0">
			<div class="dropdown-display-content">${value}</div>
		</div>
	</div>`;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div style="display:flex;gap:40px;padding:20px;position:relative;">
				<div style="flex:1;overflow:visible;position:relative;">
					<h3>Custom (Mode 1)</h3>
					${customDisplay('Banana')}
				</div>
				<div style="flex:1;">
					<h3>Native (Mode 0)</h3>
					${nativeSelect('dropdown-native', 1)}
				</div>
			</div>`),
};

/**
 * Custom mode while expanded — the state that carried real CSS weight and was
 * previously unreachable in a snapshot (Chromatic captures the initial render, so
 * the list never appeared even when the story mounted the live widget).
 *
 * Captured by dispatching a click on `.dropdown-display` before reading the DOM:
 *   `.dropdown-container.dropdown-expanded.dropdown-expanded-down`
 *     > `.dropdown-display` > `.dropdown-display-content`
 *     > `.dropdown-list` > `.scrollable-list.scrollable-list-with-scroll`
 *         > `.dropdown-popup-row.drowpdown-empty-value-row` > `span`
 *         > `.dropdown-popup-row(.dropdown-popup-row-selected)`
 *     > `.dropdown-background-window`   ← transparent click-catcher, z-index only
 *
 * `drowpdown-empty-value-row` is spelled that way by the platform. It is a
 * selector we may one day have to match, so it is reproduced verbatim, typo and
 * all — do not "fix" it here.
 *
 * The inline `left/top` on `.dropdown-list` and the size/position on
 * `.dropdown-background-window` are the widget's own inline styles.
 */
export const CustomExpanded: Story = {
	render: () =>
		renderStatic(`
			<div style="padding:20px;position:relative;height:260px;">
				<div data-dropdown="" class="dropdown-container dropdown-expanded dropdown-expanded-down">
					<div class="dropdown-display" tabindex="0">
						<div class="dropdown-display-content">Banana</div>
					</div>
					<div class="dropdown-list" style="left: 0px; top: 0px;">
						<div class="scrollable-list scrollable-list-with-scroll">
							<div class="dropdown-popup-row drowpdown-empty-value-row " tabindex="0"><span>-- Select --</span></div>
							<div class="dropdown-popup-row">Apple</div>
							<div class="dropdown-popup-row dropdown-popup-row-selected" tabindex="0">Banana</div>
							<div class="dropdown-popup-row">Cherry</div>
						</div>
					</div>
					<div class="dropdown-background-window" style="width: 100%; height: 100%; position: fixed; top: 0px; left: 0px;"></div>
				</div>
			</div>`),
};
