import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

interface TooltipArgs {
	isHover: boolean;
	position: string;
	startVisible: boolean;
}

// GlobalEnum.Position values — TooltipConfig.validateInRange silently
// falls back to 'right' for anything outside this list.
const POSITION_OPTIONS = [
	'top',
	'top-left',
	'top-right',
	'bottom',
	'bottom-left',
	'bottom-right',
	'left',
	'right',
	'center',
];

const meta: Meta<TooltipArgs> = {
	title: 'Patterns/Interaction/Tooltip',
	tags: ['!ui-pending', 'ui-reviewed'],
	argTypes: {
		isHover: { control: 'boolean', name: 'IsHover' },
		position: {
			control: 'select',
			options: POSITION_OPTIONS,
			name: 'Position',
		},
		startVisible: { control: 'boolean', name: 'StartVisible' },
	},
	args: { isHover: true, position: 'bottom', startVisible: false },
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
							<div class="osui-tooltip__balloon-wrapper__balloon" id="${id}-balloon">
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
							<div class="osui-tooltip__balloon-wrapper__balloon" id="${id2}-balloon">
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
export default meta;

type Story = StoryObj<TooltipArgs>;

export const Default: Story = {};

/** Pinned open so Chromatic photographs the balloon, not just the trigger. */
export const Visible: Story = {
	args: { startVisible: true },
	parameters: {
		// Entrance animation is 150ms; wait it out so the snapshot is not mid-fade.
		chromatic: { delay: 300 },
	},
};

/** Every Position value pinned open on a spaced grid so the balloons don't collide. */
export const Positions: Story = {
	parameters: { controls: { disable: true }, chromatic: { delay: 300 } },
	render: () => {
		const entries = POSITION_OPTIONS.map((position) => ({ position, id: uid('tooltip') }));
		const template = `
			<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:140px 60px;padding:120px 100px;justify-items:center;">
				${entries
					.map(
						({ position, id }) => `
					<div ${osuiRoot(id)} class="osui-tooltip" style="display:inline-block;">
						<div class="osui-tooltip__content" role="button" tabindex="0"><span class="btn">${position}</span></div>
						<div class="osui-tooltip__balloon-wrapper osui-balloon" role="tooltip">
							<div class="osui-tooltip__balloon-wrapper__balloon" id="${id}-balloon">${position}</div>
							<div class="osui-tooltip__balloon-arrow"></div>
						</div>
					</div>`
					)
					.join('')}
			</div>`;
		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			for (const { position, id } of entries) {
				P.TooltipAPI.Create(id, cfg({ IsHover: true, Position: position, StartVisible: true }));
				P.TooltipAPI.Initialize(id);
				register(() => P.TooltipAPI.Dispose?.(id));
			}
		});
	},
};
