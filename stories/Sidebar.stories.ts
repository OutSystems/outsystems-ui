import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

/**
 * Sidebar — off-canvas overlay pattern.
 *
 * Runtime contract (OSFramework/.../Pattern/Sidebar/Sidebar.ts):
 *  • Root `<aside class="osui-sidebar">` located by `name=<id>`; the code also
 *    reads a `widgetId` via `getElementById`, so we set id == name == <id>.
 *  • Mandatory child `.osui-sidebar__content`; optional `.osui-sidebar__header`.
 *  • An ancestor needs `.active-screen` (+ a device class) for the open
 *    transition to apply — provided by the global decorator on <body>.
 *  • API: `SidebarAPI.Create(id, configs)` + `Initialize(id)`; drive it with
 *    `SidebarAPI.Open(id)` / `SidebarAPI.Close(id)`.
 *  • The aside is `position: fixed`, so it slides in over the whole preview.
 */

interface SidebarArgs {
	direction: 'left' | 'right';
	width: string;
	hasOverlay: boolean;
	startsOpen: boolean;
}

const meta: Meta<SidebarArgs> = {
	title: 'Patterns/Navigation/Sidebar',
	argTypes: {
		direction: {
			control: 'inline-radio',
			options: ['left', 'right'],
			name: 'Direction',
			description: 'Side of the screen the sidebar opens from.',
		},
		width: {
			control: 'text',
			name: 'Width',
			description: 'Width of the sidebar (CSS length); 500px by default.',
		},
		hasOverlay: {
			control: 'boolean',
			name: 'HasOverlay',
			description:
				'Dims the page behind the sidebar with an overlay while it is open (and closes on click outside).',
		},
		startsOpen: {
			control: 'boolean',
			name: 'StartsOpen',
			description: 'Renders the sidebar open when it is built.',
		},
	},
	args: { direction: 'left', width: '320px', hasOverlay: true, startsOpen: false },
};
export default meta;

type Story = StoryObj<SidebarArgs>;

export const Playground: Story = {
	render: (args) => {
		const id = uid('sidebar');
		const template = `
			<div style="min-height: 360px;">
				<button class="btn btn-primary" data-open type="button" style="cursor:pointer;">Open sidebar</button>
				<p style="margin-top: 12px; color: var(--osui-color-text-subtle, #666);">
					The sidebar is <code>position: fixed</code>; it slides in over the preview from the ${args.direction}.
				</p>

				<aside ${osuiRoot(id)} class="osui-sidebar" role="complementary" aria-haspopup="true" tabindex="-1" aria-hidden="true">
					<div class="osui-sidebar__header" style="padding: 16px;">
						<strong>Navigation</strong>
						<button class="btn" data-close type="button" style="float:right;cursor:pointer;">✕</button>
					</div>
					<div class="osui-sidebar__content" style="padding: 16px;">
						<ul style="list-style:none;padding:0;margin:0;line-height:2;">
							<li><a href="#dashboard">Dashboard</a></li>
							<li><a href="#projects">Projects</a></li>
							<li><a href="#settings">Settings</a></li>
						</ul>
					</div>
				</aside>
			</div>`;

		return renderPattern(template, (root, register) => {
			const P = Patterns();
			P.SidebarAPI.Create(
				id,
				cfg({
					Direction: args.direction,
					Width: args.width,
					HasOverlay: args.hasOverlay,
					StartsOpen: args.startsOpen,
				})
			);
			P.SidebarAPI.Initialize(id);

			root.querySelector('[data-open]')?.addEventListener('click', () => P.SidebarAPI.Open(id));
			root.querySelector('[data-close]')?.addEventListener('click', () => P.SidebarAPI.Close(id));

			register(() => P.SidebarAPI.Dispose?.(id));
		});
	},
};

// ─── Docs examples ───────────────────────────────────────────────────────────

interface SidebarDocOptions {
	direction: 'left' | 'right';
	hasOverlay: boolean;
	width: string;
	trigger: string;
	heading: string;
	content: string;
}

const ORDER_DETAILS = `
	<dl style="display:grid;grid-template-columns:auto 1fr;gap:8px 16px;margin:0;">
		<dt>Status</dt><dd style="margin:0;">Shipped</dd>
		<dt>Carrier</dt><dd style="margin:0;">DHL Express · tracking 4821 0093 17</dd>
		<dt>Items</dt><dd style="margin:0;">2 × Trail running shoes, 1 × Hydration vest</dd>
		<dt>Total</dt><dd style="margin:0;">€ 214,90</dd>
	</dl>`;

const FILTER_FORM = `
	<fieldset style="border:0;padding:0;margin:0 0 16px;">
		<legend style="font-weight:600;margin-bottom:8px;">Category</legend>
		<label style="display:block;"><input type="checkbox" checked /> Footwear</label>
		<label style="display:block;"><input type="checkbox" /> Apparel</label>
		<label style="display:block;"><input type="checkbox" /> Accessories</label>
	</fieldset>
	<fieldset style="border:0;padding:0;margin:0 0 16px;">
		<legend style="font-weight:600;margin-bottom:8px;">Availability</legend>
		<label style="display:block;"><input type="radio" name="stock" checked /> In stock</label>
		<label style="display:block;"><input type="radio" name="stock" /> Include back-orders</label>
	</fieldset>
	<button class="btn btn-primary" type="button">Apply filters</button>`;

const NAV_LINKS = `
	<ul style="list-style:none;padding:0;margin:0;line-height:2.25;">
		<li><a href="#dashboard">Dashboard</a></li>
		<li><a href="#orders">Orders</a></li>
		<li><a href="#customers">Customers</a></li>
		<li><a href="#reports">Reports</a></li>
		<li><a href="#settings">Settings</a></li>
	</ul>`;

/**
 * Docs example: one trigger button + one closed sidebar, initialised exactly like
 * `Playground`. The aside is `position: fixed`, so it slides in over the whole
 * docs page when opened and is dismissed with the close button, Esc, or (with
 * `HasOverlay`) a click on the backdrop.
 */
function renderSidebarDoc(options: SidebarDocOptions): HTMLElement {
	const id = uid('sidebar');
	const template = `
		<div style="min-height: 160px;">
			<button class="btn btn-primary" data-open type="button">${options.trigger}</button>
			<aside ${osuiRoot(id)} class="osui-sidebar" role="complementary" aria-haspopup="true" tabindex="-1" aria-hidden="true">
				<div class="osui-sidebar__header" style="display:flex;align-items:center;justify-content:space-between;">
					<strong>${options.heading}</strong>
					<button class="btn" data-close type="button" aria-label="Close sidebar">✕</button>
				</div>
				<div class="osui-sidebar__content">${options.content}</div>
			</aside>
		</div>`;

	return renderPattern(template, (root, register) => {
		const P = Patterns();
		P.SidebarAPI.Create(
			id,
			cfg({
				Direction: options.direction,
				Width: options.width,
				HasOverlay: options.hasOverlay,
				StartsOpen: false,
			})
		);
		P.SidebarAPI.Initialize(id);

		root.querySelector('[data-open]')?.addEventListener('click', () => P.SidebarAPI.Open(id));
		root.querySelector('[data-close]')?.addEventListener('click', () => P.SidebarAPI.Close(id));

		register(() => P.SidebarAPI.Dispose?.(id));
	});
}

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Default Sidebar: closed until `SidebarAPI.Open` runs, sliding in from the right (`Direction` = Right) without a backdrop. Close it with the header button or Esc.',
			},
		},
	},
	render: () =>
		renderSidebarDoc({
			direction: 'right',
			hasOverlay: false,
			width: '360px',
			trigger: 'View order #10482',
			heading: 'Order #10482',
			content: ORDER_DETAILS,
		}),
};

export const WithOverlay: Story = {
	tags: ['docs-example'],
	name: 'With overlay',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '`HasOverlay` = True dims the page behind the panel; clicking the backdrop closes the Sidebar.',
			},
		},
	},
	render: () =>
		renderSidebarDoc({
			direction: 'right',
			hasOverlay: true,
			width: '360px',
			trigger: 'Filter products',
			heading: 'Filters',
			content: FILTER_FORM,
		}),
};

export const DirectionLeft: Story = {
	tags: ['docs-example'],
	name: 'Direction left',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '`Direction` = Left anchors the panel to the start edge of the screen — the usual choice for a navigation drawer.',
			},
		},
	},
	render: () =>
		renderSidebarDoc({
			direction: 'left',
			hasOverlay: true,
			width: '280px',
			trigger: 'Open navigation',
			heading: 'Navigation',
			content: NAV_LINKS,
		}),
};

/**
 * Pinned open from the right (`StartsOpen` + `Direction: 'right'`) so the
 * slid-in panel gets photographed. The aside is a fixed overlay covering the
 * preview, so one open sidebar per story.
 */
export const OpenRight: Story = {
	...Playground,
	tags: [],
	args: { direction: 'right', startsOpen: true },
	parameters: {
		controls: { disable: true },
		// Slide-in transition; wait it out so the snapshot is not mid-animation.
		chromatic: { delay: 500 },
	},
};

/** Pinned open from the left (`StartsOpen` + `Direction: 'left'`). */
export const OpenLeft: Story = {
	...OpenRight,
	args: { direction: 'left', startsOpen: true },
};

/** Pinned open without the backdrop (`HasOverlay: false`) — the page behind stays fully visible. */
export const OpenNoOverlay: Story = {
	...OpenRight,
	args: { direction: 'left', startsOpen: true, hasOverlay: false },
};
