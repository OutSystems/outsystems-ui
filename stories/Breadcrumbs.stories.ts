import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Breadcrumbs — controls mirror the low-code input parameters of the `Breadcrumbs`
 * block in the OutSystemsUI library OML.
 *   ExtendedClass :: Text :: ""
 *
 * Class mappings come from src/scss/04-patterns/04-navigation/_breadcrumbs.scss.
 * Shipped: `nav.breadcrumbs > .breadcrumbs-content > .breadcrumbs-item > .title > a` +
 * separator `i.icon.ph.ph-caret-right`.
 *
 * Each Breadcrumbs Item block has a Title placeholder (`.title`, holding a Link for
 * ancestor screens or plain text for the current one) and an Icon placeholder, which
 * is the separator drawn after the title — the last item simply leaves it empty.
 */
const meta: Meta = { title: 'Patterns/Navigation/Breadcrumbs', tags: ['!ui-pending', 'ui-reviewed'] };
export default meta;

type BreadcrumbsArgs = { extendedClass: string };

type Crumb = {
	label: string;
	/** Ancestor screens are links; the current screen (no href) renders as text. */
	href?: string;
	/** Optional Icon widget dropped in the Title placeholder before the text. */
	icon?: string;
};

const separator = (icon: string): string => `<div aria-hidden="true"><i class="icon ph ${icon}"></i></div>`;

/** Title placeholder: a Link (or a plain span for the current screen), optionally led by an Icon widget. */
function titleMarkup({ label, href, icon }: Crumb): string {
	const text = icon
		? `<i class="icon ph ${icon} margin-right-xs" aria-hidden="true"></i><span>${label}</span>`
		: label;
	return href ? `<a href="${href}">${text}</a>` : `<span>${text}</span>`;
}

/** One Breadcrumbs Item per crumb; the separator (Icon placeholder) follows every item but the last. */
function breadcrumbsMarkup(crumbs: readonly Crumb[], separatorIcon = 'ph-caret-right', extendedClass = ''): string {
	const items = crumbs
		.map(
			(crumb, i) => `
				<div class="breadcrumbs-item"><div class="title">${titleMarkup(crumb)}</div>${
					i < crumbs.length - 1 ? separator(separatorIcon) : ''
				}</div>`
		)
		.join('');
	return `
		<nav aria-label="breadcrumb" class="${cls('breadcrumbs', extendedClass)}">
			<div class="breadcrumbs-content">${items}
			</div>
		</nav>`;
}

const PLAYGROUND_CRUMBS: Crumb[] = [
	{ label: 'Dashboard', href: '#dashboard' },
	{ label: 'List', href: '#list' },
	{ label: 'Detail' },
];

const CATALOGUE_CRUMBS: Crumb[] = [
	{ label: 'Products', href: '#products' },
	{ label: 'Laptops', href: '#laptops' },
	{ label: 'ThinkBook 14 Gen 6' },
];

export const Playground: StoryObj<BreadcrumbsArgs> = {
	args: { extendedClass: '' },
	argTypes: { extendedClass: extendedClassArgType },
	render: ({ extendedClass }) => renderStatic(breadcrumbsMarkup(PLAYGROUND_CRUMBS, 'ph-caret-right', extendedClass)),
};

type Story = StoryObj;

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Three levels — ancestor screens are Links in the Title placeholder, the current screen is plain text and renders bold without a separator.',
			},
		},
	},
	render: () => renderStatic(breadcrumbsMarkup(CATALOGUE_CRUMBS)),
};

export const CustomSeparator: Story = {
	tags: ['docs-example'],
	name: 'Custom separator',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'The Icon placeholder of each Breadcrumbs Item is the separator — swap the default caret for any icon (here <code>arrow-right</code>).',
			},
		},
	},
	render: () => renderStatic(breadcrumbsMarkup(CATALOGUE_CRUMBS, 'ph-arrow-right')),
};

export const HomeIcon: Story = {
	tags: ['docs-example'],
	name: 'Home icon',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'An Icon widget inside the first Title placeholder, before the link text — the root crumb reads as "Home" at a glance.',
			},
		},
	},
	render: () =>
		renderStatic(
			breadcrumbsMarkup([
				{ label: 'Home', href: '#home', icon: 'ph-house' },
				{ label: 'Orders', href: '#orders' },
				{ label: 'Order #48213' },
			])
		),
};
