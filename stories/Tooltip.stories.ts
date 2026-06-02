import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

interface TooltipArgs {
	isHover: boolean;
	position: string;
	startVisible: boolean;
}

const meta: Meta<TooltipArgs> = {
	title: 'Patterns/Interaction/Tooltip',
	argTypes: {
		isHover: { control: 'boolean', name: 'IsHover' },
		position: { control: 'select', options: ['Top', 'Bottom', 'Left', 'Right'], name: 'Position' },
		startVisible: { control: 'boolean', name: 'StartVisible' },
	},
	args: { isHover: true, position: 'Bottom', startVisible: false },
};
export default meta;

type Story = StoryObj<TooltipArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('tooltip');
		const template = `
			<div style="padding:48px;">
				<div ${osuiRoot(id)} class="osui-tooltip" style="display:inline-block;">
					<div class="osui-tooltip__content" role="button" tabindex="0">
						<span class="btn">Hover me</span>
					</div>
					<div class="osui-tooltip__balloon-wrapper osui-balloon" role="tooltip">
						<div class="osui-tooltip__balloon-wrapper__balloon" id="${id}-balloon" style="padding:8px 12px;">
							Helpful hint text
						</div>
						<div class="osui-tooltip__balloon-arrow"></div>
					</div>
				</div>
			</div>`;
		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			P.TooltipAPI.Create(id, cfg({ IsHover: args.isHover, Position: args.position, StartVisible: args.startVisible }));
			P.TooltipAPI.Initialize(id);
			register(() => P.TooltipAPI.Dispose?.(id));
		});
	},
};
