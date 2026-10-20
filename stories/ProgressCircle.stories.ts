import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

/**
 * Progress Circle — `Create(id, 'Circle', configs)`.
 * Markup: an SVG with trail-path and progress-path circles inside
 * `.osui-progress-circle__container > .svg-wrapper`.
 */
interface ProgressCircleArgs {
	progress: number;
	thickness: number;
	shape: string;
}

const meta: Meta<ProgressCircleArgs> = {
	title: 'Patterns/Numbers/Progress Circle',
	argTypes: {
		progress: { control: { type: 'range', min: 0, max: 100 }, name: 'Progress' },
		thickness: { control: { type: 'number', min: 1, max: 24 }, name: 'Thickness' },
		shape: { control: 'inline-radio', options: ['sharp', 'soft', 'rounded', 'round'], name: 'Shape' },
	},
	args: { progress: 60, thickness: 8, shape: 'rounded' },
};
export default meta;

type Story = StoryObj<ProgressCircleArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('progress-circle');
		const template = `
			<div ${osuiRoot(id)} class="osui-progress-circle" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width:140px;height:140px;">
				<div class="osui-progress-circle__container">
					<div class="svg-wrapper">
						<svg>
							<defs></defs>
							<circle class="osui-progress-circle__container__trail-path"></circle>
							<circle class="osui-progress-circle__container__progress-path"></circle>
						</svg>
					</div>
				</div>
				<div class="osui-progress-circle__content" id="${id}-label"></div>
			</div>`;
		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			P.ProgressAPI.Create(
				id,
				'Circle',
				cfg({
					Progress: args.progress,
					Thickness: args.thickness,
					Shape: args.shape,
					ProgressColor: 'primary',
					TrailColor: 'neutral-2',
					AnimateInitialProgress: true,
					InitialProgress: 0,
					ProgressCircleSize: 'auto',
				})
			);
			P.ProgressAPI.Initialize(id);
			register(() => P.ProgressAPI.Dispose?.(id));
		});
	},
};
