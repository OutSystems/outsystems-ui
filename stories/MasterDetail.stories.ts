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

export const Playground: StoryObj<MasterDetailArgs> = {
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

const EMPLOYEES = [
	{ name: 'Carlton Turner', role: 'Data analyst', team: 'Analytics', email: 'carlton.turner@example.com' },
	{ name: 'Diana Rossi', role: 'Software engineer', team: 'Payments', email: 'diana.rossi@example.com' },
	{ name: 'Evelyn Chen', role: 'Project manager', team: 'Product', email: 'evelyn.chen@example.com' },
	{ name: 'Hugo Almeida', role: 'UX designer', team: 'Design', email: 'hugo.almeida@example.com' },
] as const;

/**
 * Docs-page markup with the block defaults (LeftPercentage 50, OpenedOnPhone False): a List of
 * employees in LeftContent and the selected record in RightContent. The selection is switched
 * in the story so the detail pane follows the list, the way a List OnClick would in the app.
 */
function employeeMasterDetailMarkup(leftPercentage: number, selected: number): string {
	const pct = `${leftPercentage}%`;
	const items = EMPLOYEES.map(
		(employee, index) =>
			`<div data-list-item data-index="${index}" class="list-item${index === selected ? ' list-item-selected' : ''}" tabindex="0" role="button" aria-pressed="${index === selected}">
				<div class="list-item-content">
					<div class="list-item-content-center">
						<div class="list-item-content-title">${employee.name}</div>
						<div class="list-item-content-text">${employee.role}</div>
					</div>
				</div>
			</div>`
	).join('');
	return `
		<div class="${cls('split-screen-wrapper', 'is--full-height')}" style="--left-percentage:${pct};display:flex;height:320px;border:1px solid var(--color-neutral-4, #eee);border-radius:8px;overflow:hidden;">
			<div class="split-left OSInline" style="flex:0 0 ${pct};">
				<div class="list list-group">${items}</div>
			</div>
			<div class="split-right" style="flex:1;">
				<div class="split-right-content" data-detail></div>
			</div>
		</div>`;
}

function employeeDetail(index: number): string {
	const employee = EMPLOYEES[index];
	return `
		<h3 style="margin:0 0 4px;">${employee.name}</h3>
		<p style="margin:0 0 16px;color:var(--color-neutral-7, #667);">${employee.role} · ${employee.team}</p>
		<dl style="display:grid;grid-template-columns:auto 1fr;gap:4px 16px;margin:0;font-size:14px;">
			<dt style="font-weight:600;">Email</dt><dd style="margin:0;">${employee.email}</dd>
			<dt style="font-weight:600;">Team</dt><dd style="margin:0;">${employee.team}</dd>
			<dt style="font-weight:600;">Status</dt><dd style="margin:0;">Active</dd>
		</dl>`;
}

export const BasicUsage: StoryObj = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Block defaults — <code>LeftPercentage</code> 50 and <code>OpenedOnPhone</code> False. A List in LeftContent drives what RightContent shows; on desktop and tablet both panes stay side by side.',
			},
		},
	},
	render: () => {
		const root = renderStatic(employeeMasterDetailMarkup(50, 0));
		const detail = root.querySelector<HTMLElement>('[data-detail]')!;
		detail.innerHTML = employeeDetail(0);
		const select = (index: number) => {
			root.querySelectorAll<HTMLElement>('[data-list-item]').forEach((item, i) => {
				item.classList.toggle('list-item-selected', i === index);
				item.setAttribute('aria-pressed', String(i === index));
			});
			detail.innerHTML = employeeDetail(index);
		};
		root.querySelectorAll<HTMLElement>('[data-list-item]').forEach((item) => {
			const index = Number(item.dataset.index);
			item.addEventListener('click', () => select(index));
			item.addEventListener('keydown', (event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					select(index);
				}
			});
		});
		return root;
	},
};

/** LeftPercentage at 30 / 50 / 70. */
export const SplitRatios: StoryObj = {
	tags: ['docs-example'],
	name: 'Left percentage',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: '<code>LeftPercentage</code> at 30, 50 and 70. The value becomes the <code>--left-percentage</code> variable: LeftContent takes that share of the width and RightContent the remainder.',
			},
		},
	},
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
	tags: ['docs-example'],
	name: 'Opened on phone',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: 'On phones the panes stack: the list fills the screen and RightContent slides in over it when <code>OpenedOnPhone</code> is True. Bind it to a Boolean variable set in the list item OnClick, and reset it on the <code>DetailClose</code> event.',
			},
		},
	},
	render: () =>
		renderStatic(
			labeledBoard(
				[false, true].map((openedOnPhone) => ({
					label: openedOnPhone ? 'OpenedOnPhone = True' : 'OpenedOnPhone = False',
					html: `<div style="width:280px;">${masterDetailMarkup({ leftPercentage: 100, openedOnPhone, height: '280px' }, true)}</div>`,
				})),
				{ direction: 'row', wrap: true }
			).outerHTML
		),
};
