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
		rowItemsDesktop: {
			control: { type: 'number', min: 1, max: 8 },
			name: 'RowItemsDesktop',
			description: 'Number of items per row on desktop.',
		},
		rowItemsTablet: {
			control: { type: 'number', min: 1, max: 8 },
			name: 'RowItemsTablet',
			description: 'Number of items per row on tablets.',
		},
		rowItemsPhone: {
			control: { type: 'number', min: 1, max: 8 },
			name: 'RowItemsPhone',
			description: 'Number of items per row on phones.',
		},
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
			description: 'Gap between items (Space static entity), mapped to the `--space-*` variables.',
		},
	},
	args: { rowItemsDesktop: 3, rowItemsTablet: 2, rowItemsPhone: 1, itemsGap: 'base' },
};
export default meta;

type Story = StoryObj<GalleryArgs>;

const DEMO_IMAGE = 'https://fastly.picsum.photos/id/58/1280/853.jpg?hmac=YO3QnOm9TpyM5DqsJjoM4CHg8oIq4cMWLpd9ALoP908';

function galleryMarkup(id: string): string {
	const cards = Array.from(
		{ length: 6 },
		() => `<div data-container=""><img data-image="" style="height:100%;" src="${DEMO_IMAGE}" alt=""></div>`
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

export const Playground: Story = {
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

const TRAILS = [
	{ name: 'Sintra ridge loop', length: '12 km', level: 'Moderate' },
	{ name: 'Arrábida coast path', length: '8 km', level: 'Easy' },
	{ name: 'Peneda-Gerês lakes', length: '21 km', level: 'Hard' },
	{ name: 'Douro vineyard walk', length: '6 km', level: 'Easy' },
	{ name: 'Serra da Estrela summit', length: '15 km', level: 'Hard' },
	{ name: 'Alentejo cork forest', length: '9 km', level: 'Moderate' },
	{ name: 'Azores crater rim', length: '11 km', level: 'Moderate' },
	{ name: 'Madeira levada trail', length: '14 km', level: 'Moderate' },
] as const;

/** Docs-page markup: one Card Sectioned per list item, the content a List widget would produce. */
function trailGalleryMarkup(id: string): string {
	const cards = TRAILS.map(
		(trail) => `
			<div data-container="">
				<div class="card card-sectioned flex-direction-column">
					<div class="card-image"><img data-image="" src="${DEMO_IMAGE}" alt="" style="aspect-ratio:3/2;object-fit:cover;width:100%;display:block;"></div>
					<div class="card-sectioned-top flex-direction-column">
						<div class="card-title">${trail.name}</div>
						<div class="card-content">${trail.length} · ${trail.level}</div>
					</div>
				</div>
			</div>`
	).join('');
	return `<div ${osuiRoot(id)} class="osui-gallery"><div class="list">${cards}</div></div>`;
}

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Block defaults: <code>RowItemsDesktop</code> 4, <code>RowItemsTablet</code> 3, <code>RowItemsPhone</code> 1 and <code>ItemsGap</code> Base. A List inside the Content placeholder supplies the items; the Gallery turns them into a responsive grid.',
			},
		},
	},
	render: () => {
		const id = uid('gallery');
		return renderPattern(trailGalleryMarkup(id), (_root, register) =>
			initGallery(id, { RowItemsDesktop: 4, RowItemsTablet: 3, RowItemsPhone: 1, ItemsGap: 'base' }, register)
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
	tags: ['docs-example'],
	name: 'Items per row',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: '<code>RowItemsDesktop</code> at 2, 3 and 4 (with <code>RowItemsTablet</code> matching). Each device parameter writes its own CSS variable, so the same list reflows per breakpoint without extra markup.',
			},
		},
	},
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
	tags: ['docs-example'],
	name: 'Items gap',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: '<code>ItemsGap</code> at Small, Base and ExtraLarge. The value is a Space entity record and resolves to the matching <code>--space-*</code> variable for both row and column gaps.',
			},
		},
	},
	render: () => galleryBoard(['s', 'base', 'xl'].map((gap) => ({ label: gap, overrides: { ItemsGap: gap } }))),
};
