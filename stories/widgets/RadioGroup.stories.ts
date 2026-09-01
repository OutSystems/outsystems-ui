import type { Meta, StoryObj } from '@storybook/html-vite';
import { cls, styleClassesArgType } from '../_helpers/lowcode';
import { renderStatic } from '../_helpers/osui';

/**
 * Radio Group — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17:
 *   `div[data-radio-group].radio-group[role=radiogroup]`
 *     > `div`                                  ← the widget's own inner wrapper
 *       > `div[data-radio-button]`
 *           > `input[type=radio].radio-button[name][value][tabindex]`
 *           > `label[for]`
 *
 * Note the asymmetry with Checkbox and Switch: OUI styles the radio through the
 * `.radio-button` **class**, not a data attribute — the widget puts its `style`
 * property on the input's className. `[data-radio-button]` is the row wrapper.
 *
 * `id`/`for`/`name` are real here (the capture emitted `id="-input"` and `name=""`
 * because the harness stubbed the platform's id service). No OUI selector targets
 * an id, and real ones make the labels clickable and the group actually mutually
 * exclusive.
 *
 * CSS contract: src/scss/03-widgets/_radio-button.scss.
 */
type WidgetArgs = { styleClasses: string };

const meta: Meta<WidgetArgs> = {
	title: 'Widgets/RadioGroup',
	tags: ['!ui-pending', 'ui-reviewed'],
	args: { styleClasses: '' },
	argTypes: { styleClasses: styleClassesArgType },
};
export default meta;
type Story = StoryObj<WidgetArgs>;

const radio = (value: string, label: string, selected: boolean, tabindex: number) => `
		<div data-radio-button="">
			<input type="radio" id="radio-${value}" class="radio-button" name="radiogroup" tabindex="${tabindex}"
				value="${value}"${selected ? ' checked=""' : ''}>
			<label for="radio-${value}">${label}</label>
		</div>`;

export const Default: Story = {
	render: ({ styleClasses }) =>
		renderStatic(`
			<div data-radio-group="" class="${cls('radio-group', styleClasses)}" role="radiogroup">
				<div>
					${radio('one', 'Option one', false, 0)}
					${radio('two', 'Option two', true, 0)}
					${radio('three', 'Option three', false, -1)}
				</div>
			</div>`),
};
