import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

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
		position: { control: 'select', options: POSITION_OPTIONS, name: 'Position' },
		width: { control: 'text', name: 'Width' },
		interactToClose: { control: 'boolean', name: 'InteractToClose' },
		closeAfterTime: { control: 'number', name: 'CloseAfterTime (ms, 0 = off)' },
	},
	args: { position: 'top', width: '370px', interactToClose: true, closeAfterTime: 0 },
};
export default meta;

type Story = StoryObj<NotificationArgs>;

export const Default: Story = {
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
