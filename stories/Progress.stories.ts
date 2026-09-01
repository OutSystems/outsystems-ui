import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from './_helpers/lowcode';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

/**
 * Progress — `Create(id, type, configs)` where type ∈ {'Bar','Circle'}.
 * Bar needs `.osui-progress-bar__container > .osui-progress-bar__value`.
 * Circle needs an SVG with trail-path + progress-path circles inside
 * `.osui-progress-circle__container > .svg-wrapper`.
 */
interface ProgressArgs {
	progress: number;
	thickness: number;
	shape: string;
	extendedClass: string;
}

const meta: Meta<ProgressArgs> = {
	title: 'Patterns/Numbers/Progress',
	argTypes: {
		progress: { control: { type: 'range', min: 0, max: 100 }, name: 'Progress' },
		thickness: { control: { type: 'number', min: 1, max: 24 }, name: 'Thickness' },
		shape: { control: 'inline-radio', options: ['sharp', 'soft', 'rounded', 'round'], name: 'Shape' },
		extendedClass: extendedClassArgType,
	},
	args: { progress: 60, thickness: 8, shape: 'rounded', extendedClass: '' },
};
export default meta;

type Story = StoryObj<ProgressArgs>;

export const Bar: Story = {
	render: (args) => {
		const id = uid('progress-bar');
		const template = `
			<div ${osuiRoot(id)} class="osui-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="max-width:360px;">
				<div class="osui-progress-bar__container">
					<div class="osui-progress-bar__value"></div>
				</div>
				<div class="osui-progress-bar__content" id="${id}-label"></div>
			</div>`;
		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			P.ProgressAPI.Create(
				id,
				'Bar',
				cfg({
					Progress: args.progress,
					Thickness: args.thickness,
					Shape: args.shape,
					ProgressColor: 'primary',
					TrailColor: 'border-subtle',
					AnimateInitialProgress: true,
					InitialProgress: 0,
					ExtendedClass: args.extendedClass,
				})
			);
			P.ProgressAPI.Initialize(id);
			register(() => P.ProgressAPI.Dispose?.(id));
		});
	},
};

export const Circle: Story = {
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
					ExtendedClass: args.extendedClass,
				})
			);
			P.ProgressAPI.Initialize(id);
			register(() => P.ProgressAPI.Dispose?.(id));
		});
	},
};
