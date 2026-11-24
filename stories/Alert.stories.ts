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
// ─── Docs-page demos (ported from the docs stories) ─────────────────────────

// Docs order (success first) — differs from ALERT_TYPES below, so kept separate.
const ALERT_TYPES_DOC = ['success', 'info', 'warning', 'error'] as const;

function alertMarkup(type: string, message: string, vivid = false, style = ''): string {
	return `
		<div class="${cls('alert', `alert-${type}`, vivid && 'vivid')}" role="alert" aria-live="polite" aria-atomic="true" tabindex="0"${style ? ` style="${style}"` : ''}>
			<div class="alert-icon OSInline" aria-hidden="true"></div>
			<div class="alert-message"><span>${message}</span></div>
		</div>`;
}

type Story = StoryObj;

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

export const Playground: StoryObj<AlertArgs> = {
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

export const BasicUsage: Story = {
	tags: ['docs-example'],
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
	tags: ['docs-example'],
	name: 'All severities',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'All four severity types — each sets background, border, and icon colour via the matching <code>.alert-*</code> modifier.',
			},
		},
	},
	render: () =>
		renderStatic(
			ALERT_TYPES_DOC.map((type) => alertMarkup(type, ALERT_COPY[type], false, 'margin-bottom:12px;')).join('')
		),
};

export const Vivid: Story = {
	tags: ['docs-example'],
	name: 'Vivid',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Solid-fill look — add <code>vivid</code> via <code>ExtendedClass</code>. Warning keeps dark text on the yellow background.',
			},
		},
	},
	render: () =>
		renderStatic(
			ALERT_TYPES_DOC.map((type) =>
				alertMarkup(type, `${ALERT_COPY[type]} (vivid)`, true, 'margin-bottom:12px;')
			).join('')
		),
};

const LONG_COPY: Record<string, string> = {
	info: "Saved to Clipboard. 'https://outsystemsui-dev.outsystemsenterprise.com/TaskSample_DEV_ROU12826/TestScreen_OSUITheme#Alert'",
	error: 'Upload failed for /mnt/shared/outsystems/development/attachments/2026/q4/quarterly-revenue-consolidated-final.xlsx — the file exceeds the configured limit.',
	warning:
		'Your changes to the application theme have been published and are now live for every environment in the deployment pipeline, including production.',
};

export const LongText: StoryObj = {
	render: () =>
		renderStatic(
			(['info', 'error', 'warning'] as const)
				.map(
					(type) => `
				<div class="${cls('alert', `alert-${type}`)}" role="alert" aria-live="polite" aria-atomic="true" tabindex="0" style="max-width:480px;margin-bottom:12px;">
					<div class="alert-icon OSInline" aria-hidden="true"></div>
					<div class="alert-message"><span>${LONG_COPY[type]}</span></div>
				</div>`
				)
				.join('')
		),
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
