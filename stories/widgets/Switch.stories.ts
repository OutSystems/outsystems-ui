import type { Meta, StoryObj } from '@storybook/html-vite';
import { cls, styleClassesArgType } from '../_helpers/lowcode';
import { renderStatic } from '../_helpers/osui';

/**
 * Switch — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17:
 *   `span` > `input[data-switch][type=checkbox]`
 *
 * Structurally identical to Checkbox — only the data attribute differs. The
 * track and thumb are pseudo-element `content` from the platform base layer
 * (.storybook/platform/platform-core.css); src/scss/03-widgets/_switch.scss
 * repaints them (notably to OUI blue rather than the base layer's legacy green),
 * which is exactly the override this story is here to catch.
 */
type WidgetArgs = { styleClasses: string };

const meta: Meta<WidgetArgs> = {
	title: 'Widgets/Switch',
	tags: ['!ui-pending', 'ui-reviewed'],
	args: { styleClasses: '' },
	argTypes: { styleClasses: styleClassesArgType },
};
export default meta;
type Story = StoryObj<WidgetArgs>;

const sw = (id: string, label: string, checked: boolean, disabled = false, styleClasses = '') => `
	<span class="${cls(styleClasses)}" style="display:flex;align-items:center;gap:8px;">
		<input data-switch="" class="" type="checkbox" id="${id}"${checked ? ' checked=""' : ''}${
			disabled ? ' disabled=""' : ''
		}>
		<label data-label="" for="${id}">${label}</label>
	</span>`;

export const Default: Story = {
	render: ({ styleClasses }) =>
		renderStatic(`<span class="${cls(styleClasses)}"><input data-switch="" class="" type="checkbox" checked=""></span>`),
};

/** The widget's four states, same captured DOM with the attributes it emits for each. */
export const States: Story = {
	render: ({ styleClasses }) =>
		renderStatic(`
			<div style="display:flex;flex-direction:column;gap:12px;">
				${sw('sw-on', 'On', true, false, styleClasses)}
				${sw('sw-off', 'Off', false, false, styleClasses)}
				${sw('sw-on-disabled', 'On, disabled', true, true, styleClasses)}
				${sw('sw-off-disabled', 'Off, disabled', false, true, styleClasses)}
			</div>`),
};
