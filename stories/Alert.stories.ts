import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Alert — shipped markup: `.alert.alert-{type}` (role/aria) > empty `.alert-icon`
 * + `.alert-message > span`. The status icon is drawn by `.alert-{type} .alert-icon:after`
 * via `content: var(--osui-icon-{type})` (icon-library var → respects the FA/Phosphor toggle),
 * so NO inner `<i>` is needed.
 *
 * Controls mirror the low-code input parameters of the `Alert` block:
 *   AlertType    → `.alert-{success|warning|error|info}` modifier on the root
 *   ExtendedClass → extra classes on the root
 * Class mappings from src/scss/04-patterns/02-content/_alert.scss.
 */
const meta: Meta = { title: 'Patterns/Content/Alert', tags: ['!ui-pending', 'ui-reviewed'] };
export default meta;

type AlertArgs = { alertType: string; extendedClass: string };

export const Default: StoryObj<AlertArgs> = {
	args: { alertType: 'success', extendedClass: '' },
	argTypes: {
		alertType: {
			name: 'AlertType',
			control: 'select',
			options: ['success', 'info', 'warning', 'error'],
			description:
				'Type of the alert message. Maps to `.alert-{success|info|warning|error}` on the root element.',
		},
		extendedClass: extendedClassArgType,
	},
	render: ({ alertType, extendedClass }) =>
		renderStatic(`
			<div class="${cls('alert', alertType && `alert-${alertType}`, extendedClass)}" role="alert" aria-live="polite" aria-atomic="true" tabindex="0">
				<div class="alert-icon OSInline" aria-hidden="true"></div>
				<div class="alert-message"><span>${alertType === 'success' ? 'Success! Your changes were saved.' : alertType === 'warning' ? 'Warning — double-check this before continuing.' : alertType === 'error' ? 'Something went wrong. Please try again.' : 'Heads up — this is an informational alert.'}</span></div>
			</div>`),
};

export const AllVariants: StoryObj = {
	render: () =>
		renderStatic(
			[
				{ type: 'info', msg: 'Heads up — this is an informational alert.' },
				{ type: 'success', msg: 'Success! Your changes were saved.' },
				{ type: 'warning', msg: 'Warning — double-check this before continuing.' },
				{ type: 'error', msg: 'Something went wrong. Please try again.' },
			]
				.map(
					({ type, msg }) => `
			<div class="alert alert-${type}" role="alert" aria-live="polite" aria-atomic="true" tabindex="0" style="margin-bottom:12px;">
				<div class="alert-icon OSInline" aria-hidden="true"></div>
				<div class="alert-message"><span>${msg}</span></div>
			</div>`
				)
				.join('')
		),
};
