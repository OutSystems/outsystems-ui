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
		isHover: {
			control: 'boolean',
			name: 'IsHover',
			description:
				'Opens on hover (low-code Trigger = OnHover); when False it opens on click or keyboard focus (Trigger = OnClick).',
		},
		position: {
			control: 'select',
			options: POSITION_OPTIONS,
			name: 'Position',
			description: 'Placement of the balloon relative to the trigger.',
		},
		startVisible: {
			control: 'boolean',
			name: 'StartVisible',
			description: 'Shows the tooltip as soon as it is built. Low-code parameter: `StartsOpen`.',
		},
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

export const Playground: Story = {
	// Renders through the meta-level `render` with the meta args.
};

// ─── Docs-page examples ──────────────────────────────────────────────────────

/** One tooltip: the trigger is the Content placeholder, the balloon the Tooltip placeholder. */
function tooltipMarkup(id: string, trigger: string, tip: string, triggerLabel?: string): string {
	const label = triggerLabel ? ` aria-label="${triggerLabel}"` : '';
	return `
		<div ${osuiRoot(id)} class="osui-tooltip" style="display:inline-block;">
			<div class="osui-tooltip__content" role="button" tabindex="0"${label}>${trigger}</div>
			<div class="osui-tooltip__balloon-wrapper osui-balloon" role="tooltip">
				<div class="osui-tooltip__balloon-wrapper__balloon" id="${id}-balloon">${tip}</div>
				<div class="osui-tooltip__balloon-arrow"></div>
			</div>
		</div>`;
}

const HELP_ICON = '<i class="icon ph ph-question" aria-hidden="true" style="font-size:1.5em;"></i>';

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Block defaults — <code>Trigger</code> OnHover, <code>Position</code> Right, <code>StartsOpen</code> False. Hover or focus the help icon next to the field label to read the hint.',
			},
		},
	},
	render: () => {
		const id = uid('tooltip');
		const template = `
			<div style="display:flex;align-items:center;justify-content:center;min-height:160px;">
				<div style="display:flex;align-items:center;gap:8px;">
					<span>VAT number</span>
					${tooltipMarkup(
						id,
						HELP_ICON,
						'Your 9-digit VAT registration number, without the country prefix.',
						'What is a VAT number?'
					)}
				</div>
			</div>`;
		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			P.TooltipAPI.Create(id, cfg({ IsHover: true, Position: 'right', StartVisible: false }));
			P.TooltipAPI.Initialize(id);
			register(() => P.TooltipAPI.Dispose?.(id));
		});
	},
};

/** Pinned open so Chromatic photographs the balloon, not just the trigger. */
export const Visible: Story = {
	tags: ['docs-example'],
	name: 'Starts open',
	args: { startVisible: true },
	parameters: {
		layout: 'padded',
		// Entrance animation is 150ms; wait it out so the snapshot is not mid-fade.
		chromatic: { delay: 300 },
		docs: {
			description: {
				story: '<code>StartsOpen</code> True — both tooltips are visible as soon as they are built, no hover needed. They still close on Esc and reopen on hover.',
			},
		},
	},
};

export const ClickTrigger: Story = {
	tags: ['docs-example'],
	name: 'Click trigger',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '<code>Trigger</code> OnClick (<code>IsHover</code> false at runtime) — the balloon opens on click or keyboard focus and stays until Esc, Tab or a click elsewhere. <code>Position</code> is Bottom.',
			},
		},
	},
	render: () => {
		const id = uid('tooltip');
		const template = `
			<div style="display:flex;align-items:flex-start;justify-content:center;min-height:200px;padding-top:24px;">
				${tooltipMarkup(
					id,
					'<span class="btn">Why is this required?</span>',
					'We need a VAT number to issue a compliant invoice for business purchases within the EU.'
				)}
			</div>`;
		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			P.TooltipAPI.Create(id, cfg({ IsHover: false, Position: 'bottom', StartVisible: false }));
			P.TooltipAPI.Initialize(id);
			register(() => P.TooltipAPI.Dispose?.(id));
		});
	},
};

/** Every Position value pinned open on a spaced grid so the balloons don't collide. */
export const Positions: Story = {
	tags: ['docs-example'],
	name: 'Positions',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		chromatic: { delay: 300 },
		docs: {
			description: {
				story: 'Every <code>Position</code> value, pinned open: top, top-left, top-right, bottom, bottom-left, bottom-right, left, right and center. The balloon flips automatically when it would overflow the viewport.',
			},
		},
	},
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
