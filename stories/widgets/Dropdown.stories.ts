import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderPattern, renderStatic } from '../_helpers/osui';

/**
 * Dropdown — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * The widget has two modes and they emit different DOM. Captured from
 * @outsystems/runtime-widgets-js@6.25.4 under React 17:
 *
 *   Custom (`dropdownMode: 1`) — a div-based control the platform drives itself:
 *     collapsed → `div[data-dropdown].dropdown-container`
 *                   > `div.dropdown-display[tabindex=0]` > `div.dropdown-display-content`
 *     expanded  → root gains `.dropdown-expanded.dropdown-expanded-down` and two siblings:
 *                   > `.dropdown-list` (inline `left`/`top`)
 *                       > `.scrollable-list.scrollable-list-with-scroll`
 *                           > `.dropdown-popup-row.drowpdown-empty-value-row` > `span`
 *                           > `.dropdown-popup-row(.dropdown-popup-row-selected)`
 *                   > `.dropdown-background-window` ← transparent click-catcher (z-index only)
 *
 *   Native (`dropdownMode: 0`) — a real `<select>`:
 *     `div[data-dropdown].dropdown-container#<id>-container`
 *       > `select.dropdown-display#<id>` > `option[value=-1|0..n]`
 *     The empty value is `value="-1"`; real options are indexed, not keyed by
 *     their own value. Being a native control it needs no re-wiring.
 *
 * `drowpdown-empty-value-row` is spelled that way by the platform. It is a
 * selector we may one day have to match, so it is reproduced verbatim, typo and
 * all — do not "fix" it here.
 *
 * Three deliberate departures from the raw capture, the only places this file is
 * not a byte-for-byte transcription:
 *   1. `id`s are real. The React harness stubbed the platform's id service, so the
 *      capture contained artefacts (`id=""`, `id="-container"`). No OUI selector
 *      targets an id, so real ids are safe and make `label[for]` work.
 *   2. The native `<select>` carries `selected` on its current option. React sets
 *      selection through the DOM `value` property, which never appears in
 *      `innerHTML` — so the capture lost it and static markup has to state it.
 *   3. `.dropdown-background-window` is `position: fixed` at full viewport size.
 *      It is invisible (the platform base layer gives it z-index and nothing
 *      else), but it is only added while expanded, exactly as the widget does it.
 */
const meta: Meta = { title: 'Widgets/Dropdown' };
export default meta;
type Story = StoryObj;

const OPTIONS = ['Apple', 'Banana', 'Cherry'];
const EMPTY_LABEL = '-- Select --';

const nativeSelect = (id: string, selectedIndex: number) => `
	<div id="${id}-container" class="dropdown-container" data-dropdown="">
		<select class="dropdown-display " aria-disabled="false" id="${id}">
			<option value="-1">${EMPTY_LABEL}</option>
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

/** The two nodes the widget appends while expanded, in the order it appends them. */
const customList = (selected: string) => `
	<div class="dropdown-list" style="left: 0px; top: 0px;">
		<div class="scrollable-list scrollable-list-with-scroll">
			<div class="dropdown-popup-row drowpdown-empty-value-row " tabindex="0"><span>${EMPTY_LABEL}</span></div>
			${OPTIONS.map((o) =>
				o === selected
					? `<div class="dropdown-popup-row dropdown-popup-row-selected" tabindex="0">${o}</div>`
					: `<div class="dropdown-popup-row">${o}</div>`
			).join('\n\t\t\t')}
		</div>
	</div>
	<div class="dropdown-background-window" style="width: 100%; height: 100%; position: fixed; top: 0px; left: 0px;"></div>`;

/**
 * Both modes side by side. The custom one is re-wired: expand on click, pick a
 * row, collapse on the background click-catcher — the same three class/DOM
 * mutations the widget makes, and nothing more. The native `<select>` is a real
 * form control and already works.
 */
export const Default: Story = {
	render: () =>
		renderPattern(
			`<div style="display:flex;gap:40px;padding:20px;position:relative;">
				<div style="flex:1;overflow:visible;position:relative;">
					<h3>Custom (Mode 1)</h3>
					${customDisplay('Banana')}
				</div>
				<div style="flex:1;">
					<h3>Native (Mode 0)</h3>
					${nativeSelect('dropdown-native', 1)}
				</div>
			</div>`,
			(root) => {
				const container = root.querySelector<HTMLElement>('[data-dropdown]')!;
				const display = container.querySelector<HTMLElement>('.dropdown-display')!;
				const content = container.querySelector<HTMLElement>('.dropdown-display-content')!;

				const collapse = (): void => {
					container.className = 'dropdown-container';
					container.querySelector('.dropdown-list')?.remove();
					container.querySelector('.dropdown-background-window')?.remove();
				};

				const expand = (): void => {
					container.className = 'dropdown-container dropdown-expanded dropdown-expanded-down';
					container.insertAdjacentHTML('beforeend', customList(content.textContent ?? ''));

					for (const row of container.querySelectorAll<HTMLElement>('.dropdown-popup-row')) {
						row.addEventListener('click', () => {
							// Empty-value row clears the display, as the widget's emptyValue does.
							content.textContent = row.classList.contains('drowpdown-empty-value-row')
								? EMPTY_LABEL
								: (row.textContent ?? '');
							collapse();
						});
					}
					// The widget collapses through its own in-DOM click-catcher, not a
					// document listener — so there is nothing to tear down here.
					container
						.querySelector<HTMLElement>('.dropdown-background-window')!
						.addEventListener('click', collapse);
				};

				display.addEventListener('click', () =>
					container.classList.contains('dropdown-expanded') ? collapse() : expand()
				);
			}
		),
};

/**
 * Custom mode pinned open. Chromatic photographs the initial render, so without
 * this story the expanded DOM — `.dropdown-list`, `.dropdown-popup-row(-selected)`,
 * `.scrollable-list`, i.e. the bulk of `_dropdown.scss` — would never be
 * snapshotted, which was true even while this story mounted the live widget.
 */
export const CustomExpanded: Story = {
	render: () =>
		renderStatic(`
			<div style="padding:20px;position:relative;height:260px;">
				<div data-dropdown="" class="dropdown-container dropdown-expanded dropdown-expanded-down">
					<div class="dropdown-display" tabindex="0">
						<div class="dropdown-display-content">Banana</div>
					</div>
					${customList('Banana')}
				</div>
			</div>`),
};
