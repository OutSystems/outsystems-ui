import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid, type Register } from './_helpers/osui';

/**
 * SectionIndex — anchor-nav whose items (SectionIndexItem) smooth-scroll to a
 * target element identified by `ScrollToWidgetId`. We render real target
 * sections so the scroll targets resolve.
 *
 * Contract (src/scss/04-patterns/04-navigation/section-index/_sectionindex.scss):
 *   nav.osui-section-index[.osui-section-index--is-sticky]   rail + items; IsFixed adds the modifier
 *     .osui-section-index-item[data-item=<targetId>]        one per SectionIndexItem (Content placeholder)
 *       .osui-section-index-item--is-active                  set by the runtime on click / scroll
 *   <target id=…>.osui-section-index-item__target            scroll-margin offset written by the runtime
 */
interface SectionIndexArgs {
	smoothScrolling: boolean;
	isFixed: boolean;
}

type SectionCopy = { title: string; body: string };

const SECTIONS: SectionCopy[] = ['Introduction', 'Installation', 'Usage'].map((title) => ({
	title,
	body: `Content for ${title.toLowerCase()}.`,
}));

/** Account-settings page used by the docs examples — enough sections to need scrolling. */
const SETTINGS_SECTIONS: SectionCopy[] = [
	{ title: 'Profile', body: 'Your name, photo and the e-mail address other members see next to your activity.' },
	{ title: 'Notifications', body: 'Choose which events reach your inbox and which stay as in-app badges.' },
	{ title: 'Security', body: 'Two-factor authentication, active sessions and the recovery codes for your account.' },
	{ title: 'Billing', body: 'Plan, payment method and the invoices of the last twelve months.' },
	{ title: 'Integrations', body: 'Connected calendars, chat tools and the API tokens issued to them.' },
];

type SectionIndexConfigs = { SmoothScrolling: boolean; IsFixed: boolean };

/**
 * Index + target sections, initialised like the low-code blocks: SectionIndex first, then
 * one SectionIndexItem per section, each pointing at its target via `ScrollToWidgetId`.
 *
 * `layout` — `'split'` keeps the nav static beside a scrolling pane (the Playground);
 * `'scroll'` wraps nav and sections in ONE scroll container so `IsFixed` can stick the nav
 * (`position: sticky` only works inside the element that scrolls).
 */
function sectionIndexDemo(sections: readonly SectionCopy[], configs: SectionIndexConfigs, layout: 'split' | 'scroll') {
	const id = uid('section-index');
	const itemIds = sections.map(() => uid('section-index-item'));
	const targetIds = sections.map(() => uid('section-target'));

	// No inline padding/cursor here — an inline style would beat the pattern's own
	// `padding: 8px 16px 8px 24px` (which is what insets the label from the rail) and
	// its `cursor: pointer`. Let _sectionindex.scss own the box.
	const items = sections
		.map(
			({ title }, i) =>
				`<div ${osuiRoot(itemIds[i])} class="osui-section-index-item" data-item="${targetIds[i]}">${title}</div>`
		)
		.join('');
	const targets = sections
		.map(
			({ title, body }, i) =>
				`<section id="${targetIds[i]}" style="min-height:160px;padding:12px;border-bottom:1px solid #eee;"><h3>${title}</h3><p>${body}</p></section>`
		)
		.join('');

	const nav = `<nav ${osuiRoot(id)} class="osui-section-index" style="flex:0 0 200px;align-self:flex-start;">${items}</nav>`;
	const template =
		layout === 'split'
			? `
			<div style="display:flex;gap:24px;" class="osui-main-content">
				${nav}
				<div style="flex:1;max-height:480px;overflow:auto;">${targets}</div>
			</div>`
			: `
			<div style="max-height:480px;overflow:auto;" class="osui-main-content">
				<div style="display:flex;gap:24px;align-items:flex-start;">
					${nav}
					<div style="flex:1;">${targets}</div>
				</div>
			</div>`;

	return renderPattern(template, (_root, register: Register) => {
		const P = Patterns();
		P.SectionIndexAPI.Create(id, cfg(configs));
		itemIds.forEach((itemId, i) => P.SectionIndexItemAPI.Create(itemId, cfg({ ScrollToWidgetId: targetIds[i] })));
		P.SectionIndexAPI.Initialize(id);
		itemIds.forEach((itemId) => P.SectionIndexItemAPI.Initialize(itemId));
		register(() => {
			itemIds.forEach((itemId) => P.SectionIndexItemAPI.Dispose?.(itemId));
			P.SectionIndexAPI.Dispose?.(id);
		});
	});
}

const meta: Meta<SectionIndexArgs> = {
	title: 'Patterns/Navigation/SectionIndex',
	argTypes: {
		smoothScrolling: {
			control: 'boolean',
			name: 'SmoothScrolling',
			description: 'If True, navigation to the destination is animated.',
		},
		isFixed: {
			control: 'boolean',
			name: 'IsFixed',
			description: 'If True, the Section Index Pattern is always in the same position on the screen.',
		},
	},
	args: { smoothScrolling: true, isFixed: false },
};
export default meta;

type Story = StoryObj<SectionIndexArgs>;

export const Playground: Story = {
	render: (args) =>
		sectionIndexDemo(SECTIONS, { SmoothScrolling: args.smoothScrolling, IsFixed: args.isFixed }, 'split'),
};

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Block defaults — <code>SmoothScrolling</code> True, <code>IsFixed</code> False. Click an item to scroll its section into view; the runtime marks it <code>--is-active</code>.',
			},
		},
	},
	render: () => sectionIndexDemo(SETTINGS_SECTIONS, { SmoothScrolling: true, IsFixed: false }, 'split'),
};

export const FixedPosition: Story = {
	tags: ['docs-example'],
	name: 'Fixed position',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '<code>IsFixed</code> True adds <code>.osui-section-index--is-sticky</code>: the index stays put while the content scrolls past it (here inside one scroll container holding both).',
			},
		},
	},
	render: () => sectionIndexDemo(SETTINGS_SECTIONS, { SmoothScrolling: true, IsFixed: true }, 'scroll'),
};

export const InstantScrolling: Story = {
	tags: ['docs-example'],
	name: 'Instant scrolling',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '<code>SmoothScrolling</code> False jumps to the target section without animation — useful when the app honours a reduced-motion preference.',
			},
		},
	},
	render: () => sectionIndexDemo(SETTINGS_SECTIONS, { SmoothScrolling: false, IsFixed: false }, 'split'),
};
