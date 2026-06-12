import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

/**
 * RangeSlider — noUiSlider provider. `Create(id, configs, mode, 'noUiSlider')`
 * where mode ∈ {'single','interval'}. noUiSlider mounts on
 * `.osui-range-slider__provider`. Requires `window.noUiSlider`.
 */
interface RangeSliderArgs {
	mode: 'single' | 'interval';
	minValue: number;
	maxValue: number;
	step: number;
	showFloatingLabel: boolean;
	showTickMarks: boolean;
}

const meta: Meta<RangeSliderArgs> = {
	title: 'Patterns/Interaction/RangeSlider',
	argTypes: {
		mode: { control: 'inline-radio', options: ['single', 'interval'] },
		minValue: { control: 'number', name: 'MinValue' },
		maxValue: { control: 'number', name: 'MaxValue' },
		step: { control: 'number', name: 'Step' },
		showFloatingLabel: { control: 'boolean', name: 'ShowFloatingLabel' },
		showTickMarks: { control: 'boolean', name: 'ShowTickMarks' },
	},
	args: { mode: 'single', minValue: 0, maxValue: 100, step: 1, showFloatingLabel: true, showTickMarks: false },
};
export default meta;

type Story = StoryObj<RangeSliderArgs>;

function renderRangeSlider(args: RangeSliderArgs): HTMLElement {
	const id = uid('range-slider');
	const interval = args.mode === 'interval';
	const template = `
		<div ${osuiRoot(id)} class="osui-range-slider" style="max-width:360px;padding:24px 8px;">
			<div class="osui-range-slider__provider"></div>
		</div>`;
	return renderPattern(template, (_root, register) => {
		const P = Patterns();
		P.RangeSliderAPI.Create(
			id,
			cfg({
				MinValue: args.minValue,
				MaxValue: args.maxValue,
				Step: args.step,
				IsInterval: interval,
				ShowFloatingLabel: args.showFloatingLabel,
				ShowTickMarks: args.showTickMarks,
				StartingValueFrom: interval ? args.minValue + (args.maxValue - args.minValue) * 0.25 : args.minValue,
				StartingValueTo: interval ? args.minValue + (args.maxValue - args.minValue) * 0.75 : 0,
				Orientation: 'horizontal',
				Size: '100%',
			}),
			args.mode,
			'noUiSlider'
		);
		P.RangeSliderAPI.Initialize(id);
		register(() => P.RangeSliderAPI.Dispose?.(id));
	});
}

export const Default: Story = {
	render: renderRangeSlider,
};

export const Interval: Story = {
	args: { mode: 'interval' },
	render: renderRangeSlider,
};
