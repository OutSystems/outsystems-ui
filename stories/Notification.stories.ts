import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid, type Register } from './_helpers/osui';

interface NotificationArgs {
	position: string;
	width: string;
	interactToClose: boolean;
	closeAfterTime: number;
}

// NotificationConfig documents: top (default), top-left, top-right, bottom,
// bottom-left, bottom-right or center. (Bare left/right are not valid values.)
const POSITION_OPTIONS = ['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right', 'center'];

const meta: Meta<NotificationArgs> = {
	title: 'Patterns/Interaction/Notification',
	tags: ['!ui-pending', 'ui-reviewed'],
	argTypes: {
		position: {
			control: 'select',
			options: POSITION_OPTIONS,
			name: 'Position',
			description: 'Set the position where the notification appears on the screen.',
		},
		width: {
			control: 'text',
			name: 'Width',
			description: 'Set the Notification width (CSS length); 370px by default.',
		},
		interactToClose: {
			control: 'boolean',
			name: 'OptionalConfigs.InteractToClose',
			description: 'Closes the notification on interaction outside it (click outside or Escape).',
		},
		closeAfterTime: {
			control: 'number',
			name: 'OptionalConfigs.CloseAfterTime (ms, 0 = off)',
			description: 'Milliseconds after which the notification closes itself; 0 keeps it open.',
		},
	},
	args: { position: 'top', width: '370px', interactToClose: true, closeAfterTime: 0 },
};
export default meta;

type Story = StoryObj<NotificationArgs>;

export const Playground: Story = {
	render: (args) => {
		const id = uid('notification');
		const template = `
			<div style="min-height:200px;">
				<button class="btn btn-primary" data-open type="button">Show notification</button>
				<div ${osuiRoot(id)} class="osui-notification" aria-hidden="true" tabindex="-1">
					<div style="padding:16px;">Saved successfully. ✓</div>
				</div>
			</div>`;
		return renderPattern(template, (root, register) => {
			const P = Patterns();
			P.NotificationAPI.Create(
				id,
				cfg({
					Position: args.position,
					Width: args.width,
					InteractToClose: args.interactToClose,
					CloseAfterTime: args.closeAfterTime,
					NeedsSwipes: false,
					StartsOpen: false,
				})
			);
			P.NotificationAPI.Initialize(id);
			root.querySelector('[data-open]')?.addEventListener('click', () => P.NotificationAPI.Show(id));
			register(() => P.NotificationAPI.Dispose?.(id));
		});
	},
};

// ─── Docs-page examples ──────────────────────────────────────────────────────

type NotificationConfig = {
	Position: string;
	Width: string;
	InteractToClose: boolean;
	CloseAfterTime: number;
	StartsOpen: boolean;
};

const DOC_DEFAULTS: NotificationConfig = {
	Position: 'top',
	Width: '370px',
	InteractToClose: true,
	CloseAfterTime: 0,
	StartsOpen: false,
};

/** Notification root; `content` is what the Content placeholder would hold. */
function notificationMarkup(id: string, content: string): string {
	return `
		<div ${osuiRoot(id)} class="osui-notification" aria-hidden="true" tabindex="-1">
			<div style="display:flex;align-items:center;gap:12px;padding:16px;">${content}</div>
		</div>`;
}

function initNotification(id: string, configs: Partial<NotificationConfig>, register: Register): void {
	const P = Patterns();
	P.NotificationAPI.Create(id, cfg({ ...DOC_DEFAULTS, ...configs, NeedsSwipes: false }));
	P.NotificationAPI.Initialize(id);
	register(() => P.NotificationAPI.Dispose?.(id));
}

const INVOICE_SENT = `
	<i class="icon ph ph-check-circle" aria-hidden="true" style="font-size:1.5em;color:var(--color-success);"></i>
	<div>
		<strong>Invoice #1042 sent</strong>
		<div style="color:var(--color-text-subtle);">The customer will receive a copy by email.</div>
	</div>`;

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Block defaults — <code>Position</code> Top, <code>Width</code> 370px, <code>StartsOpen</code> False. The button shows the notification; a click on it or <kbd>Esc</kbd> dismisses it (<code>InteractToClose</code>).',
			},
		},
	},
	render: () => {
		const id = uid('notification');
		const template = `
			<div style="min-height:320px;">
				<button class="btn btn-primary" data-open type="button">Send invoice</button>
				${notificationMarkup(id, INVOICE_SENT)}
			</div>`;
		return renderPattern(template, (root, register) => {
			initNotification(id, {}, register);
			root.querySelector('[data-open]')?.addEventListener('click', () => Patterns().NotificationAPI.Show(id));
		});
	},
};

const POSITION_DEMOS: Array<[label: string, position: string]> = [
	['Top', 'top'],
	['Bottom right', 'bottom-right'],
	['Center', 'center'],
];

export const PositionVariants: Story = {
	tags: ['docs-example'],
	name: 'Position',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'One notification per <code>Position</code> — Top, BottomRight and Center. Each button shows its own instance; the notification is fixed, so it pins to that edge of the viewport.',
			},
		},
	},
	render: () => {
		const entries = POSITION_DEMOS.map(([label, position]) => ({ label, position, id: uid('notification') }));
		const template = `
			<div style="min-height:320px;display:flex;flex-wrap:wrap;gap:12px;align-content:flex-start;">
				${entries
					.map(
						({ label, position, id }) => `
				<button class="btn" data-open="${id}" type="button">Show at ${label}</button>
				${notificationMarkup(id, `<span>Position: <strong>${position}</strong></span>`)}`
					)
					.join('')}
			</div>`;
		return renderPattern(template, (root, register) => {
			for (const { position, id } of entries) {
				initNotification(id, { Position: position, Width: '260px' }, register);
				root.querySelector(`[data-open="${id}"]`)?.addEventListener('click', () =>
					Patterns().NotificationAPI.Show(id)
				);
			}
		});
	},
};

export const AutoClose: Story = {
	tags: ['docs-example'],
	name: 'Auto close',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '<code>OptionalConfigs.CloseAfterTime</code> is 3000 — the notification hides itself three seconds after it is shown. 0 (the default) keeps it open until the user dismisses it.',
			},
		},
	},
	render: () => {
		const id = uid('notification');
		const template = `
			<div style="min-height:320px;">
				<button class="btn btn-primary" data-open type="button">Save draft</button>
				${notificationMarkup(
					id,
					`<i class="icon ph ph-floppy-disk" aria-hidden="true" style="font-size:1.5em;"></i>
					<span>Draft saved — this closes in 3 seconds.</span>`
				)}
			</div>`;
		return renderPattern(template, (root, register) => {
			initNotification(id, { CloseAfterTime: 3000 }, register);
			root.querySelector('[data-open]')?.addEventListener('click', () => Patterns().NotificationAPI.Show(id));
		});
	},
};

/**
 * Every Position value, all open at once (`StartsOpen: true`). The notification
 * is `position: fixed`, so the seven instances pin to the viewport edges.
 */
export const Positions: Story = {
	parameters: { controls: { disable: true }, chromatic: { delay: 500 } },
	render: () => {
		const entries = POSITION_OPTIONS.map((position) => ({ position, id: uid('notification') }));
		const template = `
			<div style="min-height:420px;">
				${entries
					.map(
						({ position, id }) => `
				<div ${osuiRoot(id)} class="osui-notification" aria-hidden="true" tabindex="-1">
					<div style="padding:12px 16px;">${position}</div>
				</div>`
					)
					.join('')}
			</div>`;
		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			for (const { position, id } of entries) {
				P.NotificationAPI.Create(
					id,
					cfg({
						Position: position,
						Width: '180px',
						InteractToClose: false,
						CloseAfterTime: 0,
						NeedsSwipes: false,
						StartsOpen: true,
					})
				);
				P.NotificationAPI.Initialize(id);
				register(() => P.NotificationAPI.Dispose?.(id));
			}
		});
	},
};
