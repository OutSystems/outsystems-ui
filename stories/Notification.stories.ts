import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

interface NotificationArgs {
	position: string;
	width: string;
	interactToClose: boolean;
	closeAfterTime: number;
}

const meta: Meta<NotificationArgs> = {
	title: 'Patterns/Interaction/Notification',
	argTypes: {
		position: { control: 'select', options: ['top', 'bottom', 'left', 'right'], name: 'Position' },
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
