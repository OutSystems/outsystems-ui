import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Alert — shipped markup: `.alert.alert-{type}` (role/aria) > empty `.alert-icon`
 * + `.alert-message > span`. The status icon is drawn by `.alert-{type} .alert-icon:after`
 * via `content: var(--osui-icon-{type})` (icon-library var → respects the FA/Phosphor toggle),
 * so NO inner `<i>` is needed. Add `.vivid` (ExtendedClass) for the solid-fill look.
 *
 * Controls mirror the low-code input parameters of the `Alert` block:
 *   AlertType    → `.alert-{success|warning|error|info}` modifier on the root
 *   ExtendedClass → extra classes on the root
 * Class mappings from src/scss/04-patterns/02-content/_alert.scss.
 */
const meta: Meta = { title: 'Patterns/Content/Alert', tags: ['!ui-pending', 'ui-reviewed'] };
export default meta;

const ALERT_COPY: Record<string, string> = {
	success: 'Success! Your changes were saved.',
	warning: 'Warning — double-check this before continuing.',
	error: 'Something went wrong. Please try again.',
	info: 'Heads up — this is an informational alert.',
};

const ALERT_TYPES = ['info', 'success', 'warning', 'error'] as const;

type AlertArgs = { alertType: string; vivid: boolean; extendedClass: string };

export const Default: StoryObj<AlertArgs> = {
	args: { alertType: 'success', vivid: false, extendedClass: '' },
	argTypes: {
		alertType: {
			name: 'AlertType',
			control: 'select',
			options: ['success', 'info', 'warning', 'error'],
			description:
				'Type of the alert message. Maps to `.alert-{success|info|warning|error}` on the root element.',
		},
		vivid: {
			name: 'Vivid',
			control: 'boolean',
			description: 'Solid-fill look. Maps to `.vivid` on the root (typically passed via ExtendedClass).',
		},
		extendedClass: extendedClassArgType,
	},
	render: ({ alertType, vivid, extendedClass }) =>
		renderStatic(`
			<div class="${cls('alert', alertType && `alert-${alertType}`, vivid && 'vivid', extendedClass)}" role="alert" aria-live="polite" aria-atomic="true" tabindex="0">
				<div class="alert-icon OSInline" aria-hidden="true"></div>
				<div class="alert-message"><span>${ALERT_COPY[alertType] ?? ALERT_COPY.info}</span></div>
			</div>`),
};

export const AllVariants: StoryObj = {
	render: () =>
		renderStatic(
			ALERT_TYPES.flatMap((type) =>
				[false, true].map(
					(vivid) => `
			<div class="${cls('alert', `alert-${type}`, vivid && 'vivid')}" role="alert" aria-live="polite" aria-atomic="true" tabindex="0" style="margin-bottom:12px;">
				<div class="alert-icon OSInline" aria-hidden="true"></div>
				<div class="alert-message"><span>${ALERT_COPY[type]}${vivid ? ' (vivid)' : ''}</span></div>
			</div>`
				)
			).join('')
		),
};
