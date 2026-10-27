import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

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

const meta: Meta = {
	title: 'Patterns/Content/List Item Content',
	tags: ['!ui-pending', 'ui-reviewed'],
	parameters: { docs: { source: { disable: true }, canvas: { sourceState: 'none' } } },
};
export default meta;

type Story = StoryObj;

export const BasicRow: Story = {
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
