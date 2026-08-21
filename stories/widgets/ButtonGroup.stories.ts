import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderPattern } from '../_helpers/osui';

/**
 * Button Group — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17:
 *   `div[data-button-group].button-group[role=radiogroup]`
 *     > `div`                              ← the widget's own inner wrapper
 *       > `button[data-button-group-item].button-group-item[role=radio][aria-checked]`
 *
 * The selected item additionally carries `.button-group-selected-item`. The
 * `tabindex` values are the widget's roving-tabindex output, reproduced as
 * emitted (it emits `0` for the first two items and `-1` for the third — a
 * widget quirk, not a transcription slip).
 *
 * Selection is re-wired below. Transcribing the DOM removes the React component
 * but not the need to *use* the control: the widget's visible state change on
 * click is two class/attribute mutations, so the story performs exactly those
 * and nothing else — no state model, no re-render. `tabindex` is deliberately
 * left alone, so what you see at rest stays byte-identical to the capture — which
 * is also what Chromatic snapshots, since it photographs the initial render.
 *
 * CSS contract: src/scss/03-widgets/_button-group.scss, plus the flex layout the
 * platform base layer puts on `[data-button-group] > div`.
 */
const meta: Meta = { title: 'Widgets/ButtonGroup' };
export default meta;
type Story = StoryObj;

const item = (label: string, selected: boolean, tabindex: number) =>
	`<button data-button-group-item="" class="button-group-item${selected ? ' button-group-selected-item' : ''}"
		aria-checked="${selected}" role="radio" tabindex="${tabindex}">${label}</button>`;

const template = `
	<div data-button-group="" class="button-group" role="radiogroup">
		<div>
			${item('Day', false, 0)}
			${item('Week', true, 0)}
			${item('Month', false, -1)}
		</div>
	</div>`;

export const Default: Story = {
	render: () =>
		renderPattern(template, (root) => {
			const items = [...root.querySelectorAll<HTMLElement>('[data-button-group-item]')];
			// The two mutations the widget makes when a different item wins selection.
			const select = (chosen: HTMLElement): void => {
				for (const el of items) {
					const isChosen = el === chosen;
					el.classList.toggle('button-group-selected-item', isChosen);
					el.setAttribute('aria-checked', String(isChosen));
				}
			};
			// `<button>` already fires click for Enter/Space, so keyboard works for free.
			for (const el of items) {
				el.addEventListener('click', () => select(el));
			}
		}),
};
