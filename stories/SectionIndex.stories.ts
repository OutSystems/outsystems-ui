import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

/**
 * SectionIndex — anchor-nav whose items (SectionIndexItem) smooth-scroll to a
 * target element identified by `ScrollToWidgetId`. We render real target
 * sections so the scroll targets resolve.
 */
interface SectionIndexArgs {
	smoothScrolling: boolean;
	isFixed: boolean;
}

const SECTIONS = ['Introduction', 'Installation', 'Usage'];

const meta: Meta<SectionIndexArgs> = {
	title: 'Patterns/Navigation/SectionIndex',
	argTypes: {
		smoothScrolling: { control: 'boolean', name: 'SmoothScrolling' },
		isFixed: { control: 'boolean', name: 'IsFixed' },
	},
	args: { smoothScrolling: true, isFixed: false },
};
export default meta;

type Story = StoryObj<SectionIndexArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('section-index');
		const itemIds = SECTIONS.map(() => uid('section-index-item'));
		const targetIds = SECTIONS.map(() => uid('section-target'));

		const items = SECTIONS.map(
			(label, i) => `<div ${osuiRoot(itemIds[i])} class="osui-section-index-item" data-item="${targetIds[i]}" style="cursor:pointer;padding:6px 0;">${label}</div>`
		).join('');
		const targets = SECTIONS.map(
			(label, i) => `<section id="${targetIds[i]}" style="min-height:160px;padding:12px;border-bottom:1px solid #eee;"><h3>${label}</h3><p>Content for ${label.toLowerCase()}.</p></section>`
		).join('');

		const template = `
			<div style="display:flex;gap:24px;" class="osui-main-content">
				<nav ${osuiRoot(id)} class="osui-section-index" style="flex:0 0 160px;align-self:flex-start;">${items}</nav>
				<div style="flex:1;max-height:320px;overflow:auto;">${targets}</div>
			</div>`;

		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			P.SectionIndexAPI.Create(id, cfg({ SmoothScrolling: args.smoothScrolling, IsFixed: args.isFixed }));
			itemIds.forEach((itemId, i) => P.SectionIndexItemAPI.Create(itemId, cfg({ ScrollToWidgetId: targetIds[i] })));
			P.SectionIndexAPI.Initialize(id);
			itemIds.forEach((itemId) => P.SectionIndexItemAPI.Initialize(itemId));
			register(() => {
				itemIds.forEach((itemId) => P.SectionIndexItemAPI.Dispose?.(itemId));
				P.SectionIndexAPI.Dispose?.(id);
			});
		});
	},
};
