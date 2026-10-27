import type { Meta, StoryObj } from '@storybook/html-vite';
import { createAndInit, osuiRoot, renderPattern, renderStatic, uid } from './_helpers/osui';
import { extendedClassArgType } from './_helpers/lowcode';

/**
 * Search — a lightweight wrapper; its build() is a no-op stub, the markup is the search input itself.
 *
 * The icon is painted by `.osui-search .osui-search__input > span::after` (ODC) and by a
 * background image on `.osui-search__input input` (O11), so the Input widget has to sit in
 * that span. Hover is the input widget's `:hover` border (`--osui-input-hover-border-color`).
 *
 * Controls mirror the low-code input parameters of the `Search` block:
 *   ExtendedClass → extra classes on the `.osui-search` root (applied by the pattern at build)
 */
const meta: Meta = {
	title: 'Patterns/Interaction/Search',
};
export default meta;

type Story = StoryObj;

type SearchArgs = { extendedClass: string };

function searchField(id: string, value = '', pseudo = ''): string {
	const valueAttr = value ? ` value="${value}"` : '';
	const pseudoAttr = pseudo ? ` data-pseudo="${pseudo}"` : '';
	return `
		<div ${osuiRoot(id)} class="osui-search"${pseudoAttr} style="width:280px;">
			<div class="osui-search__input">
				<span class="input-text">
					<input class="form-control" type="search" placeholder="Search…" data-input${valueAttr} />
				</span>
			</div>
		</div>`;
}

export const Playground: StoryObj<SearchArgs> = {
	tags: ['docs-example'],
	args: { extendedClass: '' },
	argTypes: { extendedClass: extendedClassArgType },
	render: ({ extendedClass }) => {
		const id = uid('search');
		return renderPattern(searchField(id), (_root, register) =>
			createAndInit('SearchAPI', id, { ExtendedClass: extendedClass }, register)
		);
	},
};

/**
 * Resting, filled-and-blurred, hovered, and clicked (focused), side by side.
 *
 * Hover and the clicked focus ring are forced, because a static gallery can't hold a
 * pointer or a caret and Chromatic can't either. The pseudo-states addon rewrites
 * `:hover` / `:focus` in the compiled CSS, and the story also sets those looks from
 * the same `--osui-input-*` variables the input widget's rules read.
 * "With text, unfocused" is a value with no focus: Search adds no class of its own.
 */
export const States: Story = {
	parameters: {
		controls: { disable: true },
		pseudo: {
			hover: ['[data-pseudo="search-hover"] .form-control[data-input]'],
			focus: ['[data-pseudo="search-active"] .form-control[data-input]'],
		},
	},
	render: () => {
		const cells: ReadonlyArray<{ label: string; value?: string; pseudo?: string }> = [
			{ label: 'Default' },
			{ label: 'With text, unfocused', value: 'Invoices' },
			{ label: 'Hovered', pseudo: 'search-hover' },
			{ label: 'Active', pseudo: 'search-active' },
		];
		// Built in the DOM, not a template literal, so the docs skeleton stays the single field.
		const style = document.createElement('style');
		style.textContent = `
			[data-pseudo="search-hover"] .form-control[data-input] {
				border-color: var(--osui-input-hover-border-color);
			}
			[data-pseudo="search-active"] .form-control[data-input] {
				border-color: var(--osui-input-focus-border-color);
				box-shadow: 0 0 0 var(--token-border-size-050, 2px) var(--osui-input-focus-ring-color);
				outline: none;
			}`;
		const board = document.createElement('div');
		board.style.cssText = 'align-items:flex-start;display:flex;flex-wrap:wrap;gap:32px 48px;';
		board.append(style);
		for (const cell of cells) {
			const item = document.createElement('div');
			const label = document.createElement('div');
			label.textContent = cell.label;
			label.style.cssText =
				'color:var(--color-text-subtle);font-family:monospace;font-size:0.8125rem;margin-bottom:8px;';
			item.append(label);
			item.insertAdjacentHTML('beforeend', searchField(uid('search'), cell.value ?? '', cell.pseudo ?? ''));
			board.append(item);
		}
		return renderStatic(board.outerHTML);
	},
};
