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
		direction: { control: 'inline-radio', options: ['left', 'right'], name: 'Direction' },
		width: { control: 'text', name: 'Width' },
		hasOverlay: { control: 'boolean', name: 'HasOverlay' },
		startsOpen: { control: 'boolean', name: 'StartsOpen' },
	},
	args: { direction: 'left', width: '320px', hasOverlay: true, startsOpen: false },
};
export default meta;

type Story = StoryObj<SidebarArgs>;

export const Default: Story = {
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
