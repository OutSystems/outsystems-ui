/**
 * Shared markup and wiring for the Layouts group.
 *
 * The four layout blocks (LayoutBlank, LayoutTopMenu, LayoutSideMenu, Layout) are
 * low-code blocks, so there is no `*API.Create` to drive. The DOM below is transcribed
 * from the rendered runtime of the ROU-13043 reference app (eng-starter-apps-dev,
 * BCA_ROU13043, 2026-10-02), one screen per layout, including the app's Menu,
 * MenuIcon, ApplicationTitle and UserInfo blocks. Element order, tags, roles and
 * classes are kept as rendered; only ids and text are the story's own.
 *
 *   .layout.layout-{side|top}[.fixed-header][.aside-*][.has-accessible-features]
 *     a.skip-nav                                       side layouts (TopMenu puts it in the header)
 *     aside.aside-navigation[role=complementary]       side layouts
 *       div > div[data-block=Common.Menu].OSBlockWidget
 *         nav.app-menu-content.display-flex > .header-logo + .app-menu-links + .app-login-info
 *         div.app-menu-overlay                         sibling of the nav, not inside it
 *     .main
 *       header.header[role=banner] > .header-top > .header-content.display-flex
 *         [MenuIcon] [ApplicationTitle] .header-navigation.OSInline (TopMenu: the Menu block)
 *       #OnlyInMobileView > [MenuIcon]                  Layout (header-less) only
 *       .content > .main-content[role=main] > .content-breadcrumbs + .content-top + .content-middle
 *                + footer.content-bottom[role=contentinfo] > .footer
 *
 * The side menu opens and closes with the same class mutations OutSystems UI's
 * `Menu` helper applies at runtime: `menu-visible` on the layout root and `is--open`
 * on `.app-menu-content`. The story applies them itself rather than calling the helper,
 * because the helper caches the layout and menu elements in module state across story
 * switches, which makes its first toggle after a re-render act on a detached DOM.
 */
import { renderPattern, type Register } from '../_helpers/osui';
import { cls } from '../_helpers/lowcode';

export type Device = 'desktop' | 'tablet' | 'phone';
export type MenuBehavior = 'Visible' | 'Overlay' | 'Expandable';

export const DEVICE_OPTIONS: Device[] = ['desktop', 'tablet', 'phone'];
export const MENU_BEHAVIOR_OPTIONS: MenuBehavior[] = ['Visible', 'Overlay', 'Expandable'];

/** `SideMenuBehavior` static entity record → the class the SideMenu block puts on `.layout`. */
export const MENU_BEHAVIOR_CLASS: Record<MenuBehavior, string> = {
	Visible: 'aside-visible',
	Overlay: 'aside-overlay',
	Expandable: 'aside-expandable',
};

// ─── Controls ──────────────────────────────────────────────────────────────────

export const deviceArgType = {
	name: 'Device (story)',
	control: 'inline-radio',
	options: DEVICE_OPTIONS,
	description:
		'Story-only. Sets the `desktop` / `tablet` / `phone` body class the OutSystems UI breakpoints key off, and frames the canvas to a matching width.',
} as const;

export const menuVisibleArgType = {
	name: 'Menu open (story)',
	control: 'boolean',
	description:
		'Story-only. Starts with the side menu open (`menu-visible` on the layout, `is--open` on the menu). Only meaningful where the menu is collapsed: tablet, phone, or the Overlay / Expandable behaviours on desktop.',
} as const;

export const enableA11yArgType = {
	name: 'EnableAccessibilityFeatures',
	control: 'boolean',
	description:
		'Adds `has-accessible-features` to the layout root (focus states, skip-to-content link, enhanced contrast).',
} as const;

export const hasFixedHeaderArgType = {
	name: 'HasFixedHeader',
	control: 'boolean',
	description: 'Adds `fixed-header` to the layout root; the header becomes sticky.',
} as const;

export const menuBehaviorArgType = {
	name: 'MenuBehavior',
	control: 'inline-radio',
	options: MENU_BEHAVIOR_OPTIONS,
	description:
		'`SideMenuBehavior` record → `aside-visible` (always shown on desktop), `aside-overlay` (slides over the content), `aside-expandable` (pushes the content).',
} as const;

// ─── Blocks ────────────────────────────────────────────────────────────────────

export const MENU_LINKS = ['Home', 'Orders', 'Customers', 'Reports', 'Settings'];
const APP_NAME = 'Northwind';
const MAIN_ID = 'MainContentWrapper';

// A neutral mark for the app logo, inline so the story has no asset dependency.
const LOGO_SRC =
	'data:image/svg+xml;utf8,' +
	encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#1a5fb4"/><path d="M9 21 16 9l7 12H9z" fill="#fff"/></svg>'
	);

function applicationTitle(): string {
	return `
		<div data-block="Common.ApplicationTitle" class="OSBlockWidget">
			<div data-container class="application-name display-flex align-items-center full-height" role="button" tabindex="0" style="cursor: pointer;">
				<img class="app-logo" src="${LOGO_SRC}" alt="" style="height: 32px;" />
				<span>${APP_NAME}</span>
			</div>
		</div>`;
}

function menuIcon(open: boolean): string {
	return `
		<div data-block="Common.MenuIcon" class="OSBlockWidget">
			<div data-container class="menu-icon" aria-label="Toggle the Menu" role="button" tabindex="0" aria-expanded="${open}" style="cursor: pointer;">
				<i class="icon ph-list ph ph-2x" aria-hidden="true"></i>
			</div>
		</div>`;
}

/** The app's `Menu` block: nav plus the overlay as its sibling. */
function menuBlock(open: boolean, activeIndex = 0): string {
	return `
		<div data-block="Common.Menu" class="OSBlockWidget">
			<nav data-advancedhtml class="${cls('app-menu-content display-flex', open && 'is--open')}" role="navigation" aria-label="Main navigation" aria-expanded="${open}">
				<div data-container class="header-logo placeholder-empty">${applicationTitle()}</div>
				<div data-container class="app-menu-links" role="menubar">
					${MENU_LINKS.map(
						(label, i) =>
							`<a class="${cls(i === activeIndex && 'active')}" href="#" role="menuitem" tabindex="0" onclick="return false">${label}</a>`
					).join('')}
				</div>
				<div data-container class="app-login-info placeholder-empty">
					<div data-block="Common.UserInfo" class="OSBlockWidget">
						<div data-container class="user-info">
							<a class="OSFillParent" href="#" tabindex="0" onclick="return false"><i class="icon ph-sign-in ph ph-1x" aria-hidden="true"></i><span class="margin-left-s">Login</span></a>
						</div>
					</div>
				</div>
			</nav>
			<div data-container class="app-menu-overlay" role="button" style="cursor: pointer;"></div>
		</div>`;
}

function skipNav(): string {
	return `<a class="skip-nav" href="#${MAIN_ID}" aria-label="Skip to Content (Press Enter)">Skip to Content (Press Enter)</a>`;
}

function aside(open: boolean): string {
	return `
		<aside data-advancedhtml role="complementary" class="aside-navigation">
			<div>${menuBlock(open)}</div>
		</aside>`;
}

/** `header.header` as rendered inside `.main`. TopMenu nests the skip link and the Menu block here. */
function header(open: boolean, opts: { skipNav?: boolean; navigation?: string } = {}): string {
	return `
		<header data-advancedhtml role="banner" class="header">
			${opts.skipNav ? skipNav() : ''}
			<div data-container class="header-top">
				<div data-container class="header-content display-flex">
					${menuIcon(open)}
					${applicationTitle()}
					<div class="header-navigation OSInline">${opts.navigation ?? ''}</div>
				</div>
			</div>
		</header>`;
}

/** Filler for the MainContent placeholder — shipped classes only. */
function sampleContent(): string {
	const card = (title: string, body: string) =>
		`<div class="card" style="flex: 1 1 240px;"><div class="heading5" style="margin-block-end: var(--token-scale-200, 8px);">${title}</div><p style="margin: 0">${body}</p></div>`;
	return `
		<div class="display-flex" style="flex-wrap: wrap; gap: var(--token-scale-400, 16px);">
			${card('Open orders', '128 awaiting fulfilment, 12 flagged for review.')}
			${card('Revenue', 'Up 4.2% week over week across all regions.')}
			${card('Customers', '3 new accounts today, 41 this month.')}
		</div>
		<p style="margin-block: var(--token-scale-600, 24px) 0; max-width: 72ch;">
			The page gutter around this content comes from <code>--osui-layout-gutter</code>: 40px on desktop, 16px on tablet and phone, plus the safe area on the inline sides. Switch the story's Device control to see it change.
		</p>`;
}

/** `.content` with the main-content placeholders and the footer, as every menu layout renders it. */
function content(title = 'Dashboard'): string {
	return `
		<div data-container class="content">
			<div data-container class="main-content" role="main" id="${MAIN_ID}">
				<div class="content-breadcrumbs placeholder-empty">
					<nav class="breadcrumbs" aria-label="Breadcrumbs">
						<div class="breadcrumbs-content">
							<div class="breadcrumbs-item"><div class="title"><a href="#" onclick="return false">Home</a></div></div>
							<i class="icon ph ph-caret-right" aria-hidden="true"></i>
							<div class="breadcrumbs-item"><div class="title">${title}</div></div>
						</div>
					</nav>
				</div>
				<div data-container class="content-top display-flex align-items-center">
					<div class="content-top-title heading1 placeholder-empty">${title}</div>
					<div class="content-top-actions placeholder-empty"><button type="button" class="btn btn-primary">New order</button></div>
				</div>
				<div class="content-middle">${sampleContent()}</div>
			</div>
			<footer data-advancedhtml role="contentinfo" class="content-bottom">
				<div class="footer placeholder-empty">© Northwind Traders · Footer placeholder</div>
			</footer>
		</div>`;
}

// ─── Layouts ───────────────────────────────────────────────────────────────────

interface CommonOpts {
	enableAccessibilityFeatures: boolean;
	extendedClass: string;
}

/** Layouts with a menu also take the story's initial open state. */
interface MenuOpts extends CommonOpts {
	menuVisible?: boolean;
}

/**
 * The open state is rendered into the markup rather than toggled after mount: links carry
 * `transition: all 180ms`, so adding `menu-visible` after the first paint animates their
 * border and radius, and a snapshot taken during that (Chromatic, headless capture) shows
 * the links mid-transition. In the markup, the first paint is already the final state.
 */
function rootClass(
	base: string,
	opts: CommonOpts & { menuVisible?: boolean },
	...extra: Array<string | false>
): string {
	return cls(
		base,
		...extra,
		opts.menuVisible === true && 'menu-visible',
		opts.enableAccessibilityFeatures && 'has-accessible-features',
		opts.extendedClass
	);
}

export function layoutBlank(opts: CommonOpts): string {
	return `
		<div data-container class="${rootClass('layout blank', opts)}" style="min-height: 100%;">
			<div data-container class="main">
				<div data-container class="content">
					<div data-container class="main-content" role="main" id="${MAIN_ID}">
						<h1 class="heading1" style="margin-block: 0 var(--token-scale-400, 16px);">Blank layout</h1>
						${sampleContent()}
					</div>
				</div>
			</div>
		</div>`;
}

export function layoutTopMenu(opts: MenuOpts & { hasFixedHeader: boolean }): string {
	const open = opts.menuVisible === true;
	return `
		<div data-container class="${rootClass('layout layout-top', opts, opts.hasFixedHeader && 'fixed-header')}" style="min-height: 100%;">
			<div data-container class="main">
				${header(open, { skipNav: true, navigation: menuBlock(open) })}
				${content()}
			</div>
		</div>`;
}

export function layoutSideMenu(opts: MenuOpts & { hasFixedHeader: boolean; menuBehavior: MenuBehavior }): string {
	const open = opts.menuVisible === true;
	return `
		<div data-container class="${rootClass('layout layout-side', opts, opts.hasFixedHeader && 'fixed-header', MENU_BEHAVIOR_CLASS[opts.menuBehavior])}" style="min-height: 100%;">
			${skipNav()}
			${aside(open)}
			<div data-container class="main">
				${header(open)}
				${content()}
			</div>
		</div>`;
}

export function layoutNoHeader(opts: MenuOpts): string {
	const open = opts.menuVisible === true;
	return `
		<div data-container class="${rootClass('layout layout-side layout-side-no-header aside-visible', opts)}" style="min-height: 100%;">
			${skipNav()}
			${aside(open)}
			<div data-container class="main">
				<div data-container id="OnlyInMobileView">${menuIcon(open)}</div>
				${content()}
			</div>
		</div>`;
}

// ─── Rendering ─────────────────────────────────────────────────────────────────

const DEVICE_CLASSES = ['desktop', 'tablet', 'phone', 'portrait', 'landscape'];

/** Frame geometry per device. Desktop fills the canvas; the others get a device-sized box. */
function frameStyle(device: Device): string {
	const common =
		'position: relative; transform: translateZ(0); overflow: auto; background: var(--color-background-body);';
	if (device === 'phone')
		return `${common} width: 390px; height: 780px; max-width: 100%; border: 1px solid var(--color-border);`;
	if (device === 'tablet')
		return `${common} width: 834px; height: 900px; max-width: 100%; border: 1px solid var(--color-border);`;
	return `${common} min-height: 720px;`;
}

export interface ShellOptions {
	device: Device;
}

/**
 * Render a layout inside a device frame and wire the side menu.
 *
 * - The body gets the device class (and `portrait` / `landscape`) synchronously, before
 *   the first paint. Applying it later would re-style an already painted desktop layout,
 *   and the menu (`transition: transform`) and links (`transition: all`) would animate
 *   from their desktop values; a snapshot taken during that shows them mid-transition.
 *   The class is restored to `desktop` when the next story renders.
 * - `transform: translateZ(0)` on the frame makes it the containing block for the
 *   `position: fixed` menu, overlay and aside, so they stay inside the device box.
 * - Hamburger, overlay and Escape toggle the menu with OutSystems UI's own classes. The
 *   initial state comes from the markup (see `rootClass`).
 */
export function renderLayout(template: string, opts: ShellOptions): HTMLElement {
	// renderPattern flushes the previous story's teardowns first (which reset the body to
	// desktop), so the device class is applied after it returns and before the paint.
	const root = renderPattern(
		`<div class="osui-layout-frame" style="${frameStyle(opts.device)}">${template}</div>`,
		(mounted, register) => {
			register(() => setBodyDevice('desktop'));
			wireMenu(mounted, register);
		}
	);
	setBodyDevice(opts.device);
	return root;
}

function setBodyDevice(device: Device): void {
	const body = document.body;
	body.classList.remove(...DEVICE_CLASSES);
	body.classList.add(device, device === 'desktop' ? 'landscape' : 'portrait');
}

function wireMenu(root: HTMLElement, register: Register): void {
	const layout = root.querySelector<HTMLElement>('.layout');
	const menu = root.querySelector<HTMLElement>('.app-menu-content');
	if (!layout || !menu) return;

	const icons = Array.from(root.querySelectorAll<HTMLElement>('.menu-icon'));
	const overlay = root.querySelector<HTMLElement>('.app-menu-overlay');

	const setOpen = (open: boolean): void => {
		layout.classList.toggle('menu-visible', open);
		menu.classList.toggle('is--open', open);
		menu.setAttribute('aria-expanded', String(open));
		icons.forEach((i) => i.setAttribute('aria-expanded', String(open)));
	};
	const toggle = (): void => setOpen(!layout.classList.contains('menu-visible'));
	const onKey = (e: KeyboardEvent): void => {
		if (e.key === 'Escape' && layout.classList.contains('menu-visible')) setOpen(false);
	};

	icons.forEach((i) => {
		i.addEventListener('click', toggle);
		i.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				toggle();
			}
		});
	});
	overlay?.addEventListener('click', () => setOpen(false));
	document.addEventListener('keydown', onKey);
	register(() => document.removeEventListener('keydown', onKey));
}
