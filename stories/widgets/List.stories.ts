import type { Meta, StoryObj } from '@storybook/html-vite';
import { cls, styleClassesArgType } from '../_helpers/lowcode';
import { renderStatic } from '../_helpers/osui';

/**
 * List + List Item — the two OutSystems platform **widgets** rendered together,
 * the way they compose at runtime: a List widget (`.list.list-group`) wrapping
 * one or more List Item widgets (`[data-list-item].list-item`). Each List Item
 * hosts a List Item Content pattern (see Patterns/Content/List Item Content for
 * the content block on its own).
 *
 * CSS-only render — the widget DOM + classes are the styling contract from
 * src/scss/03-widgets/_list.scss and src/scss/03-widgets/_list-item.scss:
 *   `.list.list-group` > `[data-list-item].list-item(.list-item-selected)`
 *   > `.list-item-content` > `-left | -center(-title/-text) | -right`.
 *
 * Each row composes the full Figma layout: a UserAvatar in the left region, the
 * title/text in the center, and a trailing caret in the right region. The
 * caret also exercises `--osui-list-item-selected-icon-color`, which recolors
 * it on the selected row.
 *
 * Hover, pressed and selected styling key off the `.desktop` body class set by
 * the Storybook preview decorator.
 */
type WidgetArgs = { styleClasses: string };

const meta: Meta<WidgetArgs> = {
	title: 'Widgets/List',
	args: { styleClasses: '' },
	argTypes: { styleClasses: styleClassesArgType },
};
export default meta;
type Story = StoryObj<WidgetArgs>;

/** Derive initials: first letter of each word, up to 2 characters, uppercased. */
function initials(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.map((w) => w[0] ?? '')
		.join('')
		.slice(0, 2)
		.toUpperCase();
}

// Matches the Figma List Item spec: 40px (avatar-medium) circular indigo avatar.
const avatar = (title: string): string => `
	<div class="avatar avatar-medium border-radius-rounded background-indigo" role="img"
		aria-label="user initials, ${initials(title)}">
		<span class="OSFillParent">${initials(title)}</span>
	</div>`;

const caretRight = `<i class="icon ph ph-caret-right" aria-hidden="true"></i>`;

const item = (selected: boolean, title: string, text: string): string => `
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

export const Default: Story = {
	render: ({ styleClasses }) =>
		renderStatic(`
			<div class="${cls('list', 'list-group', styleClasses)}" style="max-width:420px;">
				${item(false, 'First item', 'A tappable row with a title and supporting text.')}
				${item(true, 'Selected item', 'This row is selected.')}
				${item(false, 'Third item', 'Another row.')}
			</div>`),
};
