import type { Meta, StoryObj } from '@storybook/html-vite';
import { cls, styleClassesArgType } from '../_helpers/lowcode';
import { renderStatic } from '../_helpers/osui';

/**
 * Checkbox — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17:
 *   `span` > `input[data-checkbox][type=checkbox]`
 *
 * The wrapping `<span>` is the widget's own (it also hosts the validation
 * message at runtime). `class=""` is emitted verbatim when the widget's `style`
 * property is empty — reproduced so the DOM matches byte for byte.
 *
 * The visible box is NOT a native checkbox: the platform base layer
 * (.storybook/platform/platform-core.css) hides the input and generates the box
 * with pseudo-element `content`, and src/scss/03-widgets/_checkbox.scss then
 * recolours and resizes it. That is why the base layer must load first.
 */
type WidgetArgs = { styleClasses: string };

const meta: Meta<WidgetArgs> = {
	title: 'Widgets/Checkbox',
	args: { styleClasses: '' },
	argTypes: { styleClasses: styleClassesArgType },
};
export default meta;
type Story = StoryObj<WidgetArgs>;

const checkbox = (id: string, label: string, checked: boolean, disabled = false, styleClasses = '') => `
	<span class="${cls(styleClasses)}" style="display:flex;align-items:center;gap:8px;">
		<input data-checkbox="" class="" type="checkbox" id="${id}"${checked ? ' checked=""' : ''}${
			disabled ? ' disabled=""' : ''
		}>
		<label data-label="" for="${id}">${label}</label>
	</span>`;

export const Default: Story = {
	render: ({ styleClasses }) =>
		renderStatic(`<span class="${cls(styleClasses)}"><input data-checkbox="" class="" type="checkbox" checked=""></span>`),
};

/**
 * The same widget across its states. Each row is the captured DOM above with the
 * `checked` / `disabled` attributes the widget emits for that state, paired with
 * a `[data-label]` so the states are readable in the snapshot.
 */
export const States: Story = {
	render: ({ styleClasses }) =>
		renderStatic(`
			<div style="display:flex;flex-direction:column;gap:12px;">
				${checkbox('cb-checked', 'Checked', true, false, styleClasses)}
				${checkbox('cb-unchecked', 'Unchecked', false, false, styleClasses)}
				${checkbox('cb-checked-disabled', 'Checked, disabled', true, true, styleClasses)}
				${checkbox('cb-unchecked-disabled', 'Unchecked, disabled', false, true, styleClasses)}
			</div>`),
};
