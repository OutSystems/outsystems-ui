import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from './_helpers/lowcode';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

interface GalleryArgs {
	rowItemsDesktop: number;
	rowItemsTablet: number;
	rowItemsPhone: number;
	itemsGap: string;
	extendedClass: string;
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
		extendedClass: extendedClassArgType,
	},
	args: { rowItemsDesktop: 3, rowItemsTablet: 2, rowItemsPhone: 1, itemsGap: 'base', extendedClass: '' },
};
export default meta;

type Story = StoryObj<GalleryArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('gallery');
		const cards = Array.from(
			{ length: 6 },
			(_, i) =>
				`<div data-container=""><img data-image="" style="height:100%;" src="https://fastly.picsum.photos/id/58/1280/853.jpg?hmac=YO3QnOm9TpyM5DqsJjoM4CHg8oIq4cMWLpd9ALoP908" alt=""></div>`
		).join('');
		const template = `<div ${osuiRoot(id)} class="osui-gallery"><div class="list">${cards}</div></div>`;
		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			P.GalleryAPI.Create(
				id,
				cfg({
					RowItemsDesktop: args.rowItemsDesktop,
					RowItemsTablet: args.rowItemsTablet,
					RowItemsPhone: args.rowItemsPhone,
					ItemsGap: args.itemsGap,
					ExtendedClass: args.extendedClass,
				})
			);
			P.GalleryAPI.Initialize(id);
			register(() => P.GalleryAPI.Dispose?.(id));
		});
	},
};
