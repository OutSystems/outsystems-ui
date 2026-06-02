import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

/**
 * Carousel — Splide provider. `Create(id, configs, 'Splide')`. Slides are
 * DOM-driven: children of `.osui-carousel__content` inside `.osui-carousel__track`.
 * Requires `window.Splide`.
 */
interface CarouselArgs {
	itemsDesktop: number;
	loop: boolean;
	navigation: string;
	autoPlay: boolean;
}

const SLIDES = ['#1', '#2', '#3', '#4', '#5'];

const meta: Meta<CarouselArgs> = {
	title: 'Patterns/Content/Carousel',
	argTypes: {
		itemsDesktop: { control: { type: 'number', min: 1, max: 4 }, name: 'ItemsDesktop' },
		loop: { control: 'boolean', name: 'Loop' },
		navigation: { control: 'inline-radio', options: ['arrows', 'dots', 'both', 'none'], name: 'Navigation' },
		autoPlay: { control: 'boolean', name: 'AutoPlay' },
	},
	args: { itemsDesktop: 1, loop: true, navigation: 'both', autoPlay: false },
};
export default meta;

type Story = StoryObj<CarouselArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('carousel');
		const slides = SLIDES.map(
			(s) => `<div style="display:flex;align-items:center;justify-content:center;min-height:140px;background:#eef;border-radius:8px;font-size:32px;">${s}</div>`
		).join('');
		const template = `
			<div ${osuiRoot(id)} class="osui-carousel" style="max-width:480px;">
				<div class="osui-carousel__track">
					<div class="osui-carousel__content">${slides}</div>
				</div>
			</div>`;
		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			P.CarouselAPI.Create(
				id,
				cfg({
					ItemsDesktop: args.itemsDesktop,
					ItemsTablet: args.itemsDesktop,
					ItemsPhone: 1,
					Loop: args.loop,
					Navigation: args.navigation,
					AutoPlay: args.autoPlay,
					ItemsGap: '8px',
					Height: 'auto',
					StartingPosition: 0,
				}),
				'Splide'
			);
			P.CarouselAPI.Initialize(id);
			register(() => P.CarouselAPI.Dispose?.(id));
		});
	},
};
