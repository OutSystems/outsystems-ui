import type { Meta, StoryObj } from '@storybook/html-vite';
import { carouselImageSlidesMarkup } from './_helpers/carousel-markup';
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

function renderCarousel(args: CarouselArgs, demoClass = '', extendedClass = ''): HTMLElement {
	const id = uid('carousel');
	const slides = carouselImageSlidesMarkup();
	const template = `
		<div class="carousel-demo${demoClass ? ` ${demoClass}` : ''}">
			<div ${osuiRoot(id)} class="osui-carousel">
				<div class="osui-carousel__track">
					<div class="osui-carousel__content">${slides}</div>
				</div>
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
				ExtendedClass: extendedClass,
			}),
			'Splide'
		);
		P.CarouselAPI.Initialize(id);
		register(() => P.CarouselAPI.Dispose?.(id));
	});
}

const meta: Meta<CarouselArgs> = {
	title: 'Patterns/Content/Carousel',
	tags: ['!ui-pending', 'ui-reviewed'],
	argTypes: {
		itemsDesktop: { control: { type: 'number', min: 1, max: 4 }, name: 'ItemsDesktop' },
		loop: { control: 'boolean', name: 'Loop' },
		navigation: { control: 'inline-radio', options: ['arrows', 'dots', 'both', 'none'], name: 'Navigation' },
		autoPlay: { control: 'boolean', name: 'AutoPlay' },
	},
	args: { itemsDesktop: 1, loop: true, navigation: 'both', autoPlay: false },
	parameters: {
		docs: {
			source: { disable: true },
			canvas: { sourceState: 'none' },
		},
	},
};
export default meta;

type Story = StoryObj<CarouselArgs>;

export const Default: Story = {
	render: (args) => renderCarousel(args),
};

export const TwoItemsInfinite: Story = {
	name: 'Two items (loop)',
	args: { itemsDesktop: 2, loop: true, navigation: 'both' },
	render: (args) => renderCarousel(args, 'carousel-demo--two'),
};

export const ArrowsOnly: Story = {
	name: 'Arrows only',
	args: { itemsDesktop: 1, loop: true, navigation: 'arrows' },
	render: (args) => renderCarousel(args),
};

export const AutoPlay: Story = {
	name: 'Autoplay',
	args: { autoPlay: true, navigation: 'dots' },
	render: (args) => renderCarousel(args),
};

export const RoundShape: Story = {
	name: 'Round shape',
	args: { itemsDesktop: 1, loop: true, navigation: 'both' },
	render: (args) => renderCarousel(args, '', 'shape-round'),
};
