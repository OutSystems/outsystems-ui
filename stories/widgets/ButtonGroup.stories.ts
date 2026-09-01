import type { Meta, StoryObj } from '@storybook/html-vite';
import { cls, styleClassesArgType } from '../_helpers/lowcode';
import { renderPattern, renderStatic } from '../_helpers/osui';

/**
 * Button Group — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17:
 *   `div[data-button-group].button-group[role=radiogroup]`
 *     > `div`                              ← the widget's own inner wrapper
 *       > `button[data-button-group-item].button-group-item[role=radio][aria-checked]`
 *
 * v3.0.0 visual contract: Figma node 20015249:20 — pill items on a neutral subtle
 * track; selected item is white with a default border, not primary-filled.
 *
 * CSS contract: src/scss/03-widgets/_button-group.scss, plus the flex layout the
 * platform base layer puts on `[data-button-group] > div`.
 */
type WidgetArgs = { styleClasses: string };

const meta: Meta<WidgetArgs> = {
	title: 'Widgets/ButtonGroup',
	tags: ['!ui-pending', 'ui-reviewed'],
	args: { styleClasses: '' },
	argTypes: { styleClasses: styleClassesArgType },
};
export default meta;
type Story = StoryObj<WidgetArgs>;

const item = (label: string, selected: boolean, disabled = false, tabindex = 0) =>
	`<button data-button-group-item="" class="button-group-item${selected ? ' button-group-selected-item' : ''}"
		aria-checked="${selected}" role="radio" tabindex="${tabindex}"${disabled ? ' disabled=""' : ''}>${label}</button>`;

const group = (items: string, extraClass = '', styleClasses = '') =>
	`<div data-button-group="" class="${cls('button-group', extraClass, styleClasses)}" role="radiogroup">
		<div>${items}</div>
	</div>`;

const sixItems = (selectedIndex: number, disabled = false) =>
	Array.from({ length: 6 }, (_, i) => item('Button', i === selectedIndex, disabled, i === 0 ? 0 : -1)).join('');

export const Default: Story = {
	render: ({ styleClasses }) =>
		renderPattern(group(item('Day', false) + item('Week', true) + item('Month', false), '', styleClasses), (root) => {
			const items = [...root.querySelectorAll<HTMLElement>('[data-button-group-item]')];
			const select = (chosen: HTMLElement): void => {
				for (const el of items) {
					const isChosen = el === chosen;
					el.classList.toggle('button-group-selected-item', isChosen);
					el.setAttribute('aria-checked', String(isChosen));
				}
			};
			for (const el of items) {
				el.addEventListener('click', () => select(el));
			}
		}),
};

export const States: Story = {
	render: ({ styleClasses }) =>
		renderStatic(`
			<div style="display:flex;flex-direction:column;gap:16px;">
				${group(sixItems(0), '', styleClasses)}
				${group(sixItems(2), '', styleClasses)}
				${group(sixItems(5), '', styleClasses)}
				${group(item('Only', true), '', styleClasses)}
				${group(
					item('Enabled', false) +
						item('Selected disabled', true, true) +
						item('Disabled', false, true),
					'',
					styleClasses,
				)}
			</div>`),
};
