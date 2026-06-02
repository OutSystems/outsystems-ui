import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

interface GalleryArgs {
	rowItemsDesktop: number;
	rowItemsTablet: number;
	rowItemsPhone: number;
	itemsGap: string;
}

const meta: Meta<GalleryArgs> = {
	title: 'Patterns/Adaptive/Gallery',
	argTypes: {
		rowItemsDesktop: { control: { type: 'number', min: 1, max: 8 }, name: 'RowItemsDesktop' },
		rowItemsTablet: { control: { type: 'number', min: 1, max: 8 }, name: 'RowItemsTablet' },
		rowItemsPhone: { control: { type: 'number', min: 1, max: 8 }, name: 'RowItemsPhone' },
		itemsGap: { control: 'select', options: ['none', 'small', 'base', 'large'], name: 'ItemsGap' },
	},
	args: { rowItemsDesktop: 3, rowItemsTablet: 2, rowItemsPhone: 1, itemsGap: 'base' },
};
export default meta;

type Story = StoryObj<GalleryArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('gallery');
		const cards = Array.from({ length: 6 }, (_, i) =>
			`<div class="card" style="padding:24px;background:#eef;border-radius:8px;text-align:center;">Item ${i + 1}</div>`
		).join('');
		const template = `<div ${osuiRoot(id)} class="osui-gallery"><div class="list">${cards}</div></div>`;
		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			P.GalleryAPI.Create(
				id,
				cfg({ RowItemsDesktop: args.rowItemsDesktop, RowItemsTablet: args.rowItemsTablet, RowItemsPhone: args.rowItemsPhone, ItemsGap: args.itemsGap })
			);
			P.GalleryAPI.Initialize(id);
			register(() => P.GalleryAPI.Dispose?.(id));
		});
	},
};
