import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from './_helpers/lowcode';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

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
	extendedClass: string;
}

const OPTIONS = [
	{ label: 'Apple', value: 'apple' },
	{ label: 'Banana', value: 'banana' },
	{ label: 'Cherry', value: 'cherry' },
];

const meta: Meta<DropdownServerSideArgs> = {
	title: 'Patterns/Advanced/DropdownServerSide',
	argTypes: {
		allowMultipleSelection: { control: 'boolean', name: 'AllowMultipleSelection' },
		isDisabled: { control: 'boolean', name: 'IsDisabled' },
		extendedClass: extendedClassArgType,
	},
	args: { allowMultipleSelection: false, isDisabled: false, extendedClass: '' },
};
export default meta;

type Story = StoryObj<DropdownServerSideArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('dropdown-ss');
		const itemIds = OPTIONS.map(() => uid('dropdown-ss-item'));
		const items = OPTIONS.map(
			(o, i) => `
				<div ${osuiRoot(itemIds[i])} class="osui-dropdown-serverside-item" tabindex="0">
					<div class="osui-dropdown-serverside-item__content">${o.label}</div>
				</div>`
		).join('');

		const template = `
			<div style="max-width: 280px; min-height: 320px;">
				<div ${osuiRoot(id)} class="osui-dropdown-serverside">
					<div class="osui-dropdown-serverside__selected-values-wrapper" tabindex="0">
						<div class="osui-dropdown-serverside__selected-values">
							<span class="osui-dropdown-serverside__text">Choose a fruit</span>
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

		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			P.DropdownAPI.Create(
				id,
				'server-side',
				'osui-components',
				cfg({
					AllowMultipleSelection: args.allowMultipleSelection,
					IsDisabled: args.isDisabled,
					ExtendedClass: args.extendedClass,
				})
			);
			itemIds.forEach((itemId, i) =>
				P.DropdownServerSideItemAPI.Create(itemId, cfg({ ItemId: OPTIONS[i].value, IsSelected: false }))
			);
			P.DropdownAPI.Initialize(id);
			itemIds.forEach((itemId) => P.DropdownServerSideItemAPI.Initialize(itemId));
			// Emulate the server side: on the platform the screen's OnSelected
			// action re-renders the selected-values placeholder; here we just
			// mirror the selected item labels into the trigger text.
			const textEl = _root.querySelector('.osui-dropdown-serverside__text') as HTMLElement;
			_root.querySelectorAll('.osui-dropdown-serverside-item').forEach((el) =>
				el.addEventListener('click', () => {
					requestAnimationFrame(() => {
						const labels = [...el.closest('.osui-dropdown-serverside__balloon-content')!.children]
							.filter((it) => it.classList.contains('osui-dropdown-serverside-item--is-selected'))
							.map((it) => it.textContent!.trim());
						textEl.textContent = labels.join(', ') || 'Choose a fruit';
					});
				})
			);
			register(() => {
				itemIds.forEach((itemId) => P.DropdownServerSideItemAPI.Dispose?.(itemId));
				P.DropdownAPI.Dispose?.(id);
			});
		});
	},
};
