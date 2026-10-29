import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls } from './_helpers/lowcode';
import { labeledBoard } from './_helpers/showcase';

/**
 * Master Detail — controls mirror the low-code input parameters of the `MasterDetail`
 * block in the OutSystemsUI library OML.
 *   LeftPercentage :: Integer :: 50  → applied as `--left-percentage` on the wrapper + inline width on `.split-left`
 *   OpenedOnPhone  :: Boolean :: False → runtime/responsive: wraps layout in `.phone` and adds `.open` to `.split-right`
 *   Height         :: Text    :: ""    → applied as `height` inline style on the wrapper when set
 *
 * Note: MasterDetail has NO ExtendedClass param.
 * Class/style mappings come from src/scss/04-patterns/01-adaptive/_master-detail.scss.
 * On phone, `.split-right.open` slides the detail pane in (translateX(0)).
 * On desktop/tablet, `.split-screen-wrapper.is--full-height` / `.is--screen-size` drive
 * height via `--master-detail-height`; Height is a free-form CSS value wired here as
 * inline `height`.
 */
const meta: Meta = { title: 'Patterns/Adaptive/MasterDetail' };
export default meta;

type MasterDetailArgs = {
	leftPercentage: number;
	openedOnPhone: boolean;
	height: string;
};

const li = (selected: boolean, label: string) =>
	`<div data-list-item class="list-item ${selected ? 'list-item-selected' : ''}"><div class="list-item-content"><div class="list-item-content-center"><div class="list-item-content-title">${label}</div></div></div></div>`;

function masterDetailMarkup(
	{ leftPercentage, openedOnPhone, height }: MasterDetailArgs,
	phone = openedOnPhone
): string {
	const pct = `${leftPercentage}%`;
	const rightClass = cls('split-right', openedOnPhone && 'open');
	const wrapperStyle = [
		`--left-percentage:${pct}`,
		'display:flex',
		'border:1px solid #eee',
		'border-radius:8px',
		'overflow:hidden',
		height ? `height:${height}` : 'min-height:280px',
	].join(';');

	const markup = `
		<div class="${cls('split-screen-wrapper', 'is--full-height')}" style="${wrapperStyle}">
			<div class="split-left OSInline" style="flex:0 0 ${pct};border-right:1px solid #eee;">
				<div class="list list-group">${li(true, 'Inbox')}${li(false, 'Drafts')}${li(false, 'Sent')}</div>
			</div>
			<div class="${rightClass}" style="flex:1;">
				<div class="split-right-content" style="padding:24px;"><h2 style="margin:0;">Inbox</h2><p>Select an item from the list.</p></div>
			</div>
		</div>`;

	// Wrap in .phone context when OpenedOnPhone is active so the CSS transition
	// (.phone .split-right.open { transform: translateX(0) }) takes effect.
	// The wrapper is a transformed containing block: on phone `.split-right` is
	// `position: fixed`, so without the transform it would cover the whole viewport.
	return phone
		? `<div class="phone" style="position:relative;transform:translateZ(0);overflow:hidden;--header-size:0px;">${markup}</div>`
		: markup;
}

export const Default: StoryObj<MasterDetailArgs> = {
	args: {
		leftPercentage: 40,
		openedOnPhone: false,
		height: '',
	},
	argTypes: {
		leftPercentage: {
			name: 'LeftPercentage',
			control: { type: 'number', min: 10, max: 90, step: 5 },
			description: 'LeftContent width as a percentage of the total width.',
		},
		openedOnPhone: {
			name: 'OpenedOnPhone',
			control: 'boolean',
			description:
				'Whether the detail pane is opened on phone. Runtime/responsive: wraps the pattern in a `.phone` context and applies `.open` to `.split-right`, which slides the pane in via CSS transition.',
		},
		height: {
			name: 'Height',
			control: 'text',
			description:
				'Height of the pattern (any valid CSS value, e.g. "400px", "60vh"). Applied as an inline height style.',
		},
	},
	render: (args) => renderStatic(masterDetailMarkup(args)),
};

/** LeftPercentage at 30 / 50 / 70. */
export const SplitRatios: StoryObj = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderStatic(
			labeledBoard(
				[30, 50, 70].map((leftPercentage) => ({
					label: `${leftPercentage}%`,
					html: `<div style="width:480px;">${masterDetailMarkup({ leftPercentage, openedOnPhone: false, height: '220px' })}</div>`,
				}))
			).outerHTML
		),
};

/** Phone context with the detail pane closed vs slid in (`.split-right.open`). */
export const PhoneOpen: StoryObj = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderStatic(
			labeledBoard(
				[false, true].map((openedOnPhone) => ({
					label: openedOnPhone ? 'open' : 'closed',
					html: `<div style="width:280px;">${masterDetailMarkup({ leftPercentage: 100, openedOnPhone, height: '280px' }, true)}</div>`,
				})),
				{ direction: 'row', wrap: true }
			).outerHTML
		),
};
