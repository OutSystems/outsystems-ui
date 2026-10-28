import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';
import { phoneFrame, phoneList } from './_helpers/phone';

/**
 * Bottom Bar (+ Bottom Bar Item) — CSS-only mobile navigation bar. Contract
 * from src/scss/04-patterns/04-navigation/_bottom-bar-item.scss:
 *
 *   .bottom-bar-wrapper                    surface + top border (height: 100%)
 *     .bottom-bar > div[.active]           one container per item (flex: 1)
 *       .bottom-bar-item                        column layout
 *         .placeholder-empty.bottom-bar-item-icon   icon slot
 *         .placeholder-empty.bottom-bar-item-text   ellipsized label
 *
 * The item wrapper is a plain container — the BottomBarItem block does not render an
 * `<a>` — so the mock uses `div`. The SCSS covers `> a, > div` for that reason.
 *
 * The platform emits an inline `text-align: center;` on both placeholders (the block's
 * alignment). The classic CSS relies on it — it has no centering of its own — while the
 * new theme centers via `text-align: center` on `.bottom-bar-item`, so the mock must
 * carry the inline styles for the classic theme to render correctly. The placeholder
 * class is `placeholder-empty` on ODC (`ph` is O11-only, and collides with Phosphor's
 * icon-font class in this Storybook).
 *
 * In the native layout the wrapper lives in the `.footer` sized by `--bottom-bar-size`;
 * the stories render it there, in a phone-sized screen (`_helpers/phone.ts`).
 */

interface BottomBarArgs {
	activeIndex: number;
	extendedClass: string;
}

type BarItem = [label: string, icon: string];

const ITEMS: BarItem[] = [
	['Home', 'ph-house'],
	['Search', 'ph-magnifying-glass'],
	['Alerts', 'ph-bell'],
	['Profile', 'ph-user'],
];

/** Labels long enough to hit the `.bottom-bar-item-text` ellipsis at the 150px item max-width. */
const LONG_LABEL_ITEMS: BarItem[] = [
	['Home', 'ph-house'],
	['Notifications centre', 'ph-bell'],
	['Account settings', 'ph-gear'],
	['Help and support', 'ph-question'],
];

/** The screen each bar sits under — the title follows the active item. */
const SCREEN_ROWS: Array<[title: string, meta: string]> = [
	['Spring collection', 'Published today'],
	['Weekly digest', '3 new comments'],
	['Team standup notes', 'Updated yesterday'],
	['Q2 planning', 'Shared with you'],
];

/**
 * The phone screen with one `.bottom-bar-wrapper` in its footer. `activeIndex` is the
 * item that carries `.active` — what `ExtendedClass = "active"` on a Bottom Bar Item yields.
 */
function bottomBarMarkup(items: readonly BarItem[], activeIndex: number, extendedClass = ''): string {
	const bar = `
		<div class="${cls('bottom-bar-wrapper', extendedClass)}">
			<div class="bottom-bar" style="height: 100%;">
				${items
					.map(
						([label, icon], i) => `
				<div class="${cls(i === activeIndex && 'active')}">
					<div class="bottom-bar-item">
						<div class="placeholder-empty bottom-bar-item-icon" style="text-align: center;"><i class="icon ph ${icon}"></i></div>
						<div class="placeholder-empty bottom-bar-item-text" style="text-align: center;">${label}</div>
					</div>
				</div>`
					)
					.join('')}
			</div>
		</div>`;
	return phoneFrame({
		title: items[activeIndex]?.[0] ?? 'Home',
		content: phoneList(SCREEN_ROWS),
		footer: bar,
		height: 420,
	});
}

const meta: Meta<BottomBarArgs> = {
	title: 'Patterns/Navigation/BottomBar',
	argTypes: {
		activeIndex: {
			name: 'Active item',
			control: { type: 'number', min: 0, max: ITEMS.length - 1 },
			description: 'Which item carries the `.active` class.',
		},
		extendedClass: extendedClassArgType,
	},
	args: { activeIndex: 0, extendedClass: '' },
};
export default meta;

type Story = StoryObj<BottomBarArgs>;

export const Playground: Story = {
	render: ({ activeIndex, extendedClass }) => renderStatic(bottomBarMarkup(ITEMS, activeIndex, extendedClass)),
};

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Four Bottom Bar Items in the layout Bottom placeholder — each with an Icon and a Text placeholder, sharing the width equally.',
			},
		},
	},
	render: () => renderStatic(bottomBarMarkup(ITEMS, 0)),
};

export const ActiveItem: Story = {
	tags: ['docs-example'],
	name: 'Active item',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'The item of the current screen carries <code>active</code> (via <code>ExtendedClass</code>) — icon and label switch to <code>--osui-bottom-bar-item-active-color</code>.',
			},
		},
	},
	render: () => renderStatic(bottomBarMarkup(ITEMS, 2)),
};

export const LongLabels: Story = {
	tags: ['docs-example'],
	name: 'Long labels',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Labels never wrap — <code>.bottom-bar-item-text</code> ellipsizes whatever does not fit the item width, so keep them to one or two short words.',
			},
		},
	},
	render: () => renderStatic(bottomBarMarkup(LONG_LABEL_ITEMS, 0)),
};
