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

const ALERT_COPY: Record<string, string> = {
	success: 'Success! Your changes were saved.',
	warning: 'Warning — double-check this before continuing.',
	error: 'Something went wrong. Please try again.',
	info: 'Heads up — this is an informational alert.',
};

const ALERT_TYPES = ['success', 'info', 'warning', 'error'] as const;

function alertMarkup(type: string, message: string, vivid = false, style = ''): string {
	return `
		<div class="${cls('alert', `alert-${type}`, vivid && 'vivid')}" role="alert" aria-live="polite" aria-atomic="true" tabindex="0"${style ? ` style="${style}"` : ''}>
			<div class="alert-icon OSInline" aria-hidden="true"></div>
			<div class="alert-message"><span>${message}</span></div>
		</div>`;
}

const meta: Meta = {
	title: 'Patterns/Content/Alert',
	tags: ['!ui-pending', 'ui-reviewed'],
	parameters: {
		docs: {
			source: { disable: true },
			canvas: { sourceState: 'none' },
		},
	},
};
export default meta;

type Story = StoryObj;

export const BasicUsage: Story = {
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Default success alert — <code>AlertType</code> maps to <code>.alert-success</code> on the root.',
			},
		},
	},
	render: () => renderStatic(alertMarkup('success', ALERT_COPY.success)),
};

export const AllSeverities: Story = {
	name: 'All severities',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story:
					'All four severity types — each sets background, border, and icon colour via the matching <code>.alert-*</code> modifier.',
			},
		},
	},
	render: () =>
		renderStatic(
			ALERT_TYPES.map((type) => alertMarkup(type, ALERT_COPY[type], false, 'margin-bottom:12px;')).join('')
		),
};

export const Vivid: Story = {
	name: 'Vivid',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story:
					'Solid-fill look — add <code>vivid</code> via <code>ExtendedClass</code>. Warning keeps dark text on the yellow background.',
			},
		},
	},
	render: () =>
		renderStatic(
			ALERT_TYPES.map((type) =>
				alertMarkup(type, `${ALERT_COPY[type]} (vivid)`, true, 'margin-bottom:12px;')
			).join('')
		),
};

type AlertArgs = { alertType: string; vivid: boolean; extendedClass: string };

/** Playground with Storybook controls — not used on the docs page. */
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
