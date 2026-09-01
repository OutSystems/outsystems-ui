import type { Meta, StoryObj } from '@storybook/html-vite';
import { cls, styleClassesArgType } from '../_helpers/lowcode';
import { renderStatic } from '../_helpers/osui';

/**
 * Input — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17:
 *   `span.input-text` > `input[data-input].<style>[type][placeholder][maxlength][aria-required]`
 *
 * The `span.input-text` wrapper is the widget's own — it is where the validation
 * message is appended at runtime, and OUI styles through it. `mandatory: true`
 * adds `required` plus `aria-required="true"` (see Widgets/Form).
 *
 * CSS contract: `.form-control[data-input]` from
 * src/scss/03-widgets/_inputs-and-textareas.scss.
 */
type WidgetArgs = { styleClasses: string };

const meta: Meta<WidgetArgs> = {
	title: 'Widgets/Input',
	args: { styleClasses: '' },
	argTypes: { styleClasses: styleClassesArgType },
};
export default meta;
type Story = StoryObj<WidgetArgs>;

export const Default: Story = {
	render: ({ styleClasses }) =>
		renderStatic(`
			<span class="${cls('input-text', styleClasses)}">
				<input data-input="" class="form-control" type="text" placeholder="Enter your name"
					aria-required="false" maxlength="100" value="">
			</span>`),
};
