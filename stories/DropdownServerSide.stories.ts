import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid, type Register } from './_helpers/osui';
import { labeledBoard } from './_helpers/showcase';

/**
 * Dropdown Server Side (+ DropdownServerSideItem) — the "Advanced" dropdown
 * where the options list is server-rendered (each option is its own block).
 * Here the list is emulated with static items (same data as the Dropdown
 * story); on the platform the items come from an aggregate.
 *
 * Runtime contract (Pattern/Dropdown/ServerSide + DropdownServerSideItem):
 *  • API: `DropdownAPI.Create(id, 'server-side', 'osui-components', configs)`.
 *  • Root `.osui-dropdown-serverside` (by `name=<id>`) must contain:
 *      .osui-dropdown-serverside__selected-values-wrapper  (click target)
 *      .osui-dropdown-serverside__balloon.osui-balloon     (positioned by the
 *        Balloon feature via FloatingUI; `osui-balloon` must be in the MARKUP —
 *        the framework doesn't add it) carrying `data-uniqueid=<id>` — items
 *        resolve their parent via `closest('.…__balloon')` → name/data-uniqueid
 *        → DropdownAPI.GetDropdownById.
 *      Inside the balloon: __balloon-container > __balloon-search (with an
 *      <input>), __balloon-content (options wrapper), __balloon-footer.
 *  • Each item: `.osui-dropdown-serverside-item` (by `name=<itemId>`) with an
 *    `__content` child; config `{ ItemId, IsSelected }`.
 *  • Call order: Create parent → Create items → Initialize parent → items.
 */

interface DropdownServerSideArgs {
	allowMultipleSelection: boolean;
	isDisabled: boolean;
}

const PLACEHOLDER = 'Choose a fruit';

const OPTIONS = [
	{ label: 'Apple', value: 'apple' },
	{ label: 'Banana', value: 'banana' },
	{ label: 'Cherry', value: 'cherry' },
];

const meta: Meta<DropdownServerSideArgs> = {
	title: 'Patterns/Advanced/DropdownServerSide',
	argTypes: {
		allowMultipleSelection: {
			control: 'boolean',
			name: 'AllowMultipleSelection',
			description: 'Lets the user select more than one option.',
		},
		isDisabled: { control: 'boolean', name: 'IsDisabled', description: 'Renders the dropdown disabled.' },
	},
	args: { allowMultipleSelection: false, isDisabled: false },
};
export default meta;

type Story = StoryObj<DropdownServerSideArgs>;

/**
 * Labels of the currently-selected options, read off the item's balloon-content
 * siblings. Extracted from the click handler below to keep the callback chain
 * inside `render` shallow.
 */
function selectedLabels(item: Element): string[] {
	const content = item.closest('.osui-dropdown-serverside__balloon-content');
	return [...(content?.children ?? [])]
		.filter((it) => it.classList.contains('osui-dropdown-serverside-item--is-selected'))
		.map((it) => it.textContent!.trim());
}

/**
 * Emulate the server side: on the platform the screen's OnSelected action
 * re-renders the selected-values placeholder; here we just mirror the selected
 * item labels into the trigger text. Deferred a frame so the framework has
 * already applied `--is-selected` by the time we read it.
 */
function mirrorSelectionToTrigger(root: HTMLElement, textEl: HTMLElement, placeholder: string): void {
	root.querySelectorAll('.osui-dropdown-serverside-item').forEach((el) =>
		el.addEventListener('click', () =>
			requestAnimationFrame(() => {
				textEl.textContent = selectedLabels(el).join(', ') || placeholder;
			})
		)
	);
}

function serverSideMarkup(id: string, itemIds: string[]): string {
	const items = OPTIONS.map(
		(o, i) => `
			<div ${osuiRoot(itemIds[i])} class="osui-dropdown-serverside-item" tabindex="0">
				<div class="osui-dropdown-serverside-item__content">${o.label}</div>
			</div>`
	).join('');

	return `
		<div style="max-width: 280px; min-height: 320px;">
			<div ${osuiRoot(id)} class="osui-dropdown-serverside">
				<div class="osui-dropdown-serverside__selected-values-wrapper" tabindex="0">
					<div class="osui-dropdown-serverside__selected-values">
						<span class="osui-dropdown-serverside__text">${PLACEHOLDER}</span>
					</div>
				</div>
				<div class="osui-dropdown-serverside__balloon osui-balloon" data-uniqueid="${id}">
					<div class="osui-dropdown-serverside__balloon-container">
						<div class="osui-dropdown-serverside__balloon-search">
							<input type="text" class="form-control" placeholder="Search…" />
						</div>
						<div class="osui-dropdown-serverside__balloon-content">${items}</div>
						<div class="osui-dropdown-serverside__balloon-footer"></div>
					</div>
				</div>
			</div>
		</div>`;
}

/**
 * Create parent → create items → initialize parent → items (the runtime call
 * order). `selected` pre-selects options by value via the items' `IsSelected`.
 */
function initServerSide(
	id: string,
	itemIds: string[],
	args: DropdownServerSideArgs,
	register: Register,
	selected: string[] = []
): void {
	const P = Patterns();
	P.DropdownAPI.Create(
		id,
		'server-side',
		'osui-components',
		cfg({ AllowMultipleSelection: args.allowMultipleSelection, IsDisabled: args.isDisabled })
	);
	itemIds.forEach((itemId, i) =>
		P.DropdownServerSideItemAPI.Create(
			itemId,
			cfg({ ItemId: OPTIONS[i].value, IsSelected: selected.includes(OPTIONS[i].value) })
		)
	);
	P.DropdownAPI.Initialize(id);
	itemIds.forEach((itemId) => P.DropdownServerSideItemAPI.Initialize(itemId));
	register(() => {
		itemIds.forEach((itemId) => P.DropdownServerSideItemAPI.Dispose?.(itemId));
		P.DropdownAPI.Dispose?.(id);
	});
}

export const Playground: Story = {
	tags: ['docs-example'],
	render: (args) => {
		const id = uid('dropdown-ss');
		const itemIds = OPTIONS.map(() => uid('dropdown-ss-item'));
		return renderPattern(serverSideMarkup(id, itemIds), (root, register) => {
			initServerSide(id, itemIds, args, register);
			const textEl = root.querySelector('.osui-dropdown-serverside__text') as HTMLElement;
			mirrorSelectionToTrigger(root, textEl, PLACEHOLDER);
		});
	},
};

/**
 * Selection states: single mode with one option selected next to
 * `AllowMultipleSelection` with two selected. The items are pre-selected via
 * their `IsSelected` config, the trigger text mirrors the selection (the
 * platform's OnSelected action would do this), and the balloons are opened so
 * the `--is-selected` highlight is visible.
 */
export const Selection: Story = {
	parameters: { controls: { disable: true }, chromatic: { delay: 300 } },
	render: () => {
		const entries = [
			{ label: 'single (one selected)', multiple: false, selected: ['banana'] },
			{ label: 'multiple (two selected)', multiple: true, selected: ['apple', 'cherry'] },
		].map((v) => ({ ...v, id: uid('dropdown-ss'), itemIds: OPTIONS.map(() => uid('dropdown-ss-item')) }));
		const board = labeledBoard(
			entries.map(({ label, id, itemIds }) => ({ label, html: serverSideMarkup(id, itemIds) })),
			{ direction: 'row', wrap: true }
		);
		return renderPattern(board.outerHTML, (root, register) => {
			const P = Patterns();
			for (const { id, itemIds, multiple, selected } of entries) {
				initServerSide(
					id,
					itemIds,
					{ allowMultipleSelection: multiple, isDisabled: false },
					register,
					selected
				);
			}
			for (const { id, selected } of entries) {
				const labels = OPTIONS.filter((o) => selected.includes(o.value)).map((o) => o.label);
				const textEl = root.querySelector<HTMLElement>(`[name="${id}"] .osui-dropdown-serverside__text`);
				if (textEl) textEl.textContent = labels.join(', ');
				P.DropdownAPI.Open(id);
			}
		});
	},
};

/** Enabled trigger next to the disabled (`IsDisabled: true`) one. */
export const States: Story = {
	parameters: { controls: { disable: true } },
	render: () => {
		const entries = [
			{ label: 'enabled', isDisabled: false },
			{ label: 'disabled', isDisabled: true },
		].map((v) => ({ ...v, id: uid('dropdown-ss'), itemIds: OPTIONS.map(() => uid('dropdown-ss-item')) }));
		const board = labeledBoard(
			entries.map(({ label, id, itemIds }) => ({ label, html: serverSideMarkup(id, itemIds) })),
			{ direction: 'row', wrap: true }
		);
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const { id, itemIds, isDisabled } of entries) {
				initServerSide(id, itemIds, { allowMultipleSelection: false, isDisabled }, register);
			}
		});
	},
};
