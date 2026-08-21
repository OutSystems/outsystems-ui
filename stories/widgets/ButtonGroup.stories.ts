import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from '../_helpers/osui';

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
 * emitted.
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

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div data-button-group="" class="button-group" role="radiogroup">
				<div>
					${item('Day', false, 0)}
					${item('Week', true, 0)}
					${item('Month', false, -1)}
				</div>
			</div>`),
};
