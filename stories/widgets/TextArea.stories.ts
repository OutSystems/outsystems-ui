import type { Meta, StoryObj } from '@storybook/html-vite';
import { cls, styleClassesArgType } from '../_helpers/lowcode';
import { renderStatic } from '../_helpers/osui';

/**
 * Text Area — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17:
 *   `span` > `textarea[data-textarea].<style>[rows][placeholder][maxlength]`
 *
 * `textLines` becomes `rows`. Unlike Input the wrapper `<span>` carries no
 * `.input-text` class — a real asymmetry in the widget, reproduced as emitted.
 *
 * CSS contract: `[data-textarea]` from
 * src/scss/03-widgets/_inputs-and-textareas.scss. Note the platform base layer
 * styles `[data-input]` but not `[data-textarea]`, so this control's look is
 * entirely OUI's.
 */
type WidgetArgs = { styleClasses: string };

const meta: Meta<WidgetArgs> = {
	title: 'Widgets/TextArea',
	args: { styleClasses: '' },
	argTypes: { styleClasses: styleClassesArgType },
};
export default meta;
type Story = StoryObj<WidgetArgs>;

export const Default: Story = {
	render: ({ styleClasses }) =>
		renderStatic(`
			<span class="${cls(styleClasses)}">
				<textarea data-textarea="" class="form-control" rows="3" placeholder="Write a comment…"
					maxlength="500"></textarea>
			</span>`),
};
