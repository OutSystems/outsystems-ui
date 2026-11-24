import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * List Item Content — the `ListItemContent` block from the OutSystemsUI library OML:
 * a content layout with left / center / right regions that lives *inside* a List Item
 * widget, which in turn lives in a List widget. The story renders that composition
 * (the List and List Item wrappers are the platform widgets' DOM) so the block is
 * shown in the only context where it makes sense; Widgets/List shows a full list.
 *
 * Controls mirror the low-code input parameters of the block:
 *   ExtendedClass → extra classes on the `.list-item-content` root
 * Class mappings from src/scss/04-patterns/02-content/_list-item-content.scss.
 */
const meta: Meta = { title: 'Patterns/Content/List Item Content' };
export default meta;

type ListItemContentArgs = { extendedClass: string };

function listItemContentMarkup(extendedClass: string, title: string, text: string, initials: string): string {
	return `
		<div data-list-item class="list-item">
			<div class="${cls('list-item-content', extendedClass)}">
				<div class="list-item-content-left">
					<div class="avatar avatar-medium border-radius-rounded background-indigo" role="img" aria-label="user initials, ${initials}">
						<span class="OSFillParent">${initials}</span>
					</div>
				</div>
				<div class="list-item-content-center">
					<div class="list-item-content-title">${title}</div>
					<div class="list-item-content-text">${text}</div>
				</div>
				<div class="list-item-content-right"><i class="icon ph ph-caret-right" aria-hidden="true"></i></div>
			</div>
		</div>`;
}

export const Playground: StoryObj<ListItemContentArgs> = {
	args: { extendedClass: '' },
	argTypes: { extendedClass: extendedClassArgType },
	render: ({ extendedClass }) =>
		renderStatic(`
			<div data-list="" class="list list-group" style="max-width:420px;">
				${listItemContentMarkup(extendedClass, 'Jane Doe', 'Product designer', 'JD')}
			</div>
			<p style="max-width:420px;margin-top:16px;color:var(--color-text-subtle);font-size:0.8125rem;">
				Composed example with several rows and a selected item:
				<a href="./?path=/story/widgets-list--default" target="_top">Widgets/List →</a>
			</p>`),
};

// ─── Docs-page stories ────────────────────────────────────────────────────────

type Story = StoryObj;

function initials(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.map((w) => w[0] ?? '')
		.join('')
		.slice(0, 2)
		.toUpperCase();
}

const avatar = (title: string): string => `
	<div class="avatar avatar-medium border-radius-rounded background-indigo" role="img" aria-label="user initials, ${initials(title)}">
		<span class="OSFillParent">${initials(title)}</span>
	</div>`;

const caretRight = `<i class="icon ph ph-caret-right" aria-hidden="true"></i>`;

function listItemRow(selected: boolean, title: string, text: string): string {
	return `
	<div data-list-item class="list-item ${selected ? 'list-item-selected' : ''}">
		<div class="list-item-content">
			<div class="list-item-content-left">${avatar(title)}</div>
			<div class="list-item-content-center">
				<div class="list-item-content-title">${title}</div>
				<div class="list-item-content-text">${text}</div>
			</div>
			<div class="list-item-content-right">${caretRight}</div>
		</div>
	</div>`;
}

export const BasicRow: Story = {
	tags: ['docs-example'],
	name: 'Basic row',
	parameters: { layout: 'padded' },
	render: () =>
		renderStatic(
			`<div style="display:flex;justify-content:center;width:100%;"><div class="list list-group" style="max-width:420px;width:100%;">
				${listItemRow(false, 'Jane Doe', 'Product designer')}
			</div></div>`
		),
};

export const InList: Story = {
	tags: ['docs-example'],
	name: 'In a list',
	parameters: { layout: 'padded' },
	render: () =>
		renderStatic(
			`<div style="display:flex;justify-content:center;width:100%;"><div class="list list-group" style="max-width:420px;width:100%;">
				${listItemRow(false, 'First item', 'A tappable row with a title and supporting text.')}
				${listItemRow(true, 'Selected item', 'This row is selected.')}
				${listItemRow(false, 'Third item', 'Another row.')}
			</div></div>`
		),
};
