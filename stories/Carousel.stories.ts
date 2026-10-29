import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid, type Register } from './_helpers/osui';
import { labeledBoard } from './_helpers/showcase';

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

function carouselMarkup(id: string): string {
	const slides = SLIDES.map(
		(s) =>
			`<div style="display:flex;align-items:center;justify-content:center;min-height:140px;width:100%;background:#eef;border-radius:8px;font-size:32px;">${s}</div>`
	).join('');
	return `
		<div ${osuiRoot(id)} class="osui-carousel" >
			<div class="osui-carousel__track">
				<div class="osui-carousel__content">${slides}</div>
			</div>
		</div>`;
}

function initCarousel(id: string, overrides: Record<string, unknown>, register: Register): void {
	const P = Patterns();
	P.CarouselAPI.Create(
		id,
		cfg({
			ItemsDesktop: 1,
			ItemsTablet: 1,
			ItemsPhone: 1,
			Loop: true,
			Navigation: 'both',
			AutoPlay: false,
			ItemsGap: '8px',
			Height: 'auto',
			StartingPosition: 0,
			...overrides,
		}),
		'Splide'
	);
	P.CarouselAPI.Initialize(id);
	register(() => P.CarouselAPI.Dispose?.(id));
}

export const Default: Story = {
	render: (args) => {
		const id = uid('carousel');
		return renderPattern(carouselMarkup(id), (_root, register) =>
			initCarousel(
				id,
				{
					ItemsDesktop: args.itemsDesktop,
					ItemsTablet: args.itemsDesktop,
					Loop: args.loop,
					Navigation: args.navigation,
					AutoPlay: args.autoPlay,
				},
				register
			)
		);
	},
};

/** One carousel per labeled cell, each initialized with its own config overrides. */
function carouselBoard(variants: Array<{ label: string; overrides: Record<string, unknown> }>) {
	const entries = variants.map((v) => ({ ...v, id: uid('carousel') }));
	const board = labeledBoard(
		entries.map(({ label, id }) => ({ label, html: `<div style="width:480px;">${carouselMarkup(id)}</div>` }))
	);
	return renderPattern(board.outerHTML, (_root, register) => {
		for (const { id, overrides } of entries) {
			initCarousel(id, overrides, register);
		}
	});
}

/** The four Navigation values: both, arrows, dots, none. */
export const Navigation: Story = {
	parameters: { controls: { disable: true } },
	render: () =>
		carouselBoard(
			['both', 'arrows', 'dots', 'none'].map((navigation) => ({
				label: navigation,
				overrides: { Navigation: navigation },
			}))
		),
};

/** ItemsDesktop at 1 / 2 / 3 items per view. */
export const ItemsPerView: Story = {
	parameters: { controls: { disable: true } },
	render: () =>
		carouselBoard(
			[1, 2, 3].map((items) => ({
				label: `${items} per view`,
				overrides: { ItemsDesktop: items, ItemsTablet: items },
			}))
		),
};
