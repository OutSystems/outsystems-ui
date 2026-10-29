import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid, type Register } from './_helpers/osui';
import { labeledBoard } from './_helpers/showcase';

interface GalleryArgs {
	rowItemsDesktop: number;
	rowItemsTablet: number;
	rowItemsPhone: number;
	itemsGap: string;
}

const ITEMS_GAP_OPTIONS = ['none', 'xs', 's', 'base', 'm', 'l', 'xl', 'xxl'] as const;

const meta: Meta<GalleryArgs> = {
	title: 'Patterns/Adaptive/Gallery',
	argTypes: {
		rowItemsDesktop: { control: { type: 'number', min: 1, max: 8 }, name: 'RowItemsDesktop' },
		rowItemsTablet: { control: { type: 'number', min: 1, max: 8 }, name: 'RowItemsTablet' },
		rowItemsPhone: { control: { type: 'number', min: 1, max: 8 }, name: 'RowItemsPhone' },
		itemsGap: {
			options: [...ITEMS_GAP_OPTIONS],
			control: {
				type: 'select',
				labels: {
					none: 'None',
					xs: 'Extra Small',
					s: 'Small',
					base: 'Base',
					m: 'Medium',
					l: 'Large',
					xl: 'Extra Large',
					xxl: 'XXLarge',
				},
			},
			name: 'ItemsGap',
		},
	},
	args: { rowItemsDesktop: 3, rowItemsTablet: 2, rowItemsPhone: 1, itemsGap: 'base' },
};
export default meta;

type Story = StoryObj<GalleryArgs>;

function galleryMarkup(id: string): string {
	const cards = Array.from(
		{ length: 6 },
		() =>
			`<div data-container=""><img data-image="" style="height:100%;" src="https://fastly.picsum.photos/id/58/1280/853.jpg?hmac=YO3QnOm9TpyM5DqsJjoM4CHg8oIq4cMWLpd9ALoP908" alt=""></div>`
	).join('');
	return `<div ${osuiRoot(id)} class="osui-gallery"><div class="list">${cards}</div></div>`;
}

function initGallery(id: string, overrides: Record<string, unknown>, register: Register): void {
	const P = Patterns();
	P.GalleryAPI.Create(
		id,
		cfg({ RowItemsDesktop: 3, RowItemsTablet: 2, RowItemsPhone: 1, ItemsGap: 'base', ...overrides })
	);
	P.GalleryAPI.Initialize(id);
	register(() => P.GalleryAPI.Dispose?.(id));
}

export const Default: Story = {
	render: (args) => {
		const id = uid('gallery');
		return renderPattern(galleryMarkup(id), (_root, register) =>
			initGallery(
				id,
				{
					RowItemsDesktop: args.rowItemsDesktop,
					RowItemsTablet: args.rowItemsTablet,
					RowItemsPhone: args.rowItemsPhone,
					ItemsGap: args.itemsGap,
				},
				register
			)
		);
	},
};

/** One gallery per labeled cell, each initialized with its own config overrides. */
function galleryBoard(variants: Array<{ label: string; overrides: Record<string, unknown> }>) {
	const entries = variants.map((v) => ({ ...v, id: uid('gallery') }));
	const board = labeledBoard(
		entries.map(({ label, id }) => ({ label, html: `<div style="width:560px;">${galleryMarkup(id)}</div>` })),
		// Side by side while they fit, at half zoom — three 560px galleries then
		// share one row instead of forcing a long scroll.
		{ direction: 'row', gap: 24, wrap: true, zoom: 0.5 }
	);
	return renderPattern(board.outerHTML, (_root, register) => {
		for (const { id, overrides } of entries) {
			initGallery(id, overrides, register);
		}
	});
}

/** RowItemsDesktop at 2 / 3 / 4 columns. */
export const Columns: Story = {
	parameters: { controls: { disable: true } },
	render: () =>
		galleryBoard(
			[2, 3, 4].map((columns) => ({
				label: `${columns} columns`,
				overrides: { RowItemsDesktop: columns, RowItemsTablet: columns },
			}))
		),
};

/** The ItemsGap scale at s / base / xl. */
export const Gaps: Story = {
	parameters: { controls: { disable: true } },
	render: () => galleryBoard(['s', 'base', 'xl'].map((gap) => ({ label: gap, overrides: { ItemsGap: gap } }))),
};
