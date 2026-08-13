import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

interface TooltipArgs {
	isHover: boolean;
	position: string;
	startVisible: boolean;
}

const meta: Meta<TooltipArgs> = {
	title: 'Patterns/Interaction/Tooltip',
	tags: ['!ui-pending', 'ui-reviewed'],
	argTypes: {
		isHover: { control: 'boolean', name: 'IsHover' },
		position: {
			control: 'select',
			// GlobalEnum.Position values — TooltipConfig.validateInRange silently
			// falls back to 'right' for anything outside this list.
			options: [
				'top',
				'top-left',
				'top-right',
				'bottom',
				'bottom-left',
				'bottom-right',
				'left',
				'right',
				'center',
			],
			name: 'Position',
		},
		startVisible: { control: 'boolean', name: 'StartVisible' },
	},
	args: { isHover: true, position: 'bottom', startVisible: false },
};
export default meta;

type Story = StoryObj<TooltipArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('tooltip');
		const id2 = uid('tooltip');
		const template = `
			<div>
				<div style="display:flex;align-items:center;justify-content:center;min-height:420px;flex-direction:column;gap:100px;">
					<div ${osuiRoot(id)} class="osui-tooltip" style="display:inline-block;">
						<div class="osui-tooltip__content" role="button" tabindex="0">
							<i class="icon ph ph-question" style="font-size: 2em;"></i>
						</div>
						<div class="osui-tooltip__balloon-wrapper osui-balloon" role="tooltip">
							<div class="osui-tooltip__balloon-wrapper__balloon" id="${id}-balloon" style="padding:8px 12px;">
								Helpful hint text
							</div>
							<div class="osui-tooltip__balloon-arrow"></div>
						</div>
					</div>
					<div ${osuiRoot(id2)} class="osui-tooltip" style="display:inline-block;">
						<div class="osui-tooltip__content" role="button" tabindex="0">
							<span class="btn">Hover me</span>
						</div>
						<div class="osui-tooltip__balloon-wrapper osui-balloon" role="tooltip">
							<div class="osui-tooltip__balloon-wrapper__balloon" id="${id2}-balloon" style="padding:8px 12px;">
								This is a helpful but long tip that will explain to you a lot of interesting things in your application.
							</div>
							<div class="osui-tooltip__balloon-arrow"></div>
						</div>
					</div>
				</div>
			</div>
			`;
		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			[id, id2].forEach((tooltipId) => {
				P.TooltipAPI.Create(
					tooltipId,
					cfg({ IsHover: args.isHover, Position: args.position, StartVisible: args.startVisible })
				);
				P.TooltipAPI.Initialize(tooltipId);
				register(() => P.TooltipAPI.Dispose?.(tooltipId));
			});
		});
	},
};
