import type { Meta, StoryObj } from '@storybook/html-vite';
import { createAndInit, osuiRoot, Patterns, renderPattern, renderStatic, uid } from './_helpers/osui';

/**
 * Submenu — header + a panel of links.
 *
 * The last item carries `.is-disabled`, the pattern's CSS-only disabled state
 * (there is no `DisableItem` API): muted text, no hover/pressed feedback and
 * `pointer-events: none`. `aria-disabled` is authored in the markup — note the
 * pattern still sets `tabindex="0"` on every link when the panel opens, so a
 * disabled item stays keyboard-reachable.
 */

interface SubmenuArgs {
	openOnHover: boolean;
}

const meta: Meta<SubmenuArgs> = {
	title: 'Patterns/Navigation/Submenu',
	argTypes: { openOnHover: { control: 'boolean', name: 'OpenOnHover' } },
	args: { openOnHover: false },
};
export default meta;

type Story = StoryObj<SubmenuArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('submenu');
		const template = `
			<div ${osuiRoot(id)} class="osui-submenu" style="width:220px;">
				<div class="osui-submenu__header" id="${id}-header" type="button">
					<div class="osui-submenu__header__item" id="b3-b13-Menu">Products</div>
					<span class="osui-submenu__header__icon"></span>
				</div>
				<div class="osui-submenu__items" id="${id}-items">
					<a href="#one">Analytics</a>
					<a class="active" href="#two">Automation</a>
					<a href="#three">Integrations</a>
					<a aria-disabled="true" class="is-disabled" href="#four">Reports</a>
				</div>
			</div>`;
		return renderPattern(template, (_root, register) => {
			const instance = createAndInit('SubmenuAPI', id, { OpenOnHover: args.openOnHover }, register);
			// Submenu only wires its click/hover listeners once `_hasValidChildren()` can
			// see a built pattern — `setHtmlElements()` runs before `finishBuild()`, so the
			// check always fails at init. The platform recovers by calling UpdateOnRender on
			// every render; Storybook has to do the same or the panel never opens.
			Patterns().SubmenuAPI.UpdateOnRender(id);
			return instance;
		});
	},
};

export const InPageHeader: Story = {
	name: 'In page header',
	parameters: {
		controls: { disable: true },
		pseudo: { hover: ['[data-pseudo="header-hover"] .osui-submenu__header'] },
	},
	render: () =>
		renderStatic(`
			<style>
				.osui-submenu-header-states {
					display: flex;
					flex-direction: column;
					gap: 32px;
				}
				.osui-submenu-header-states__label {
					color: var(--color-text-subtle);
					font-family: monospace;
					font-size: 0.8125rem;
					margin-bottom: 8px;
				}
				/* Room for the (absolutely positioned) open dropdown before the next header. */
				.osui-submenu-header-states__cell--open {
					padding-bottom: 150px;
				}
				/* The real .layout is a min-height:100vh page root; in the gallery each
				   cell only needs its header bar. Layout-only override, no state CSS. */
				.osui-submenu-header-states .layout {
					min-height: 0;
				}
			</style>
			<div class="osui-submenu-header-states">
				<div class="osui-submenu-header-states__cell">
					<div class="osui-submenu-header-states__label">Default — closed, not selected</div>
					<div class="layout layout-top"><div class="main"><header class="header" role="banner">
						<div class="header-top">
							<div class="header-content display-flex">
								<div class="header-navigation OSInline">
									<div class="app-menu-links" role="menubar">
										<div class="osui-submenu osui-submenu--is-dropdown">
											<div class="osui-submenu__header">
												<div class="osui-submenu__header__item">Products</div>
												<div class="osui-submenu__header__icon"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</header></div></div>
				</div>
				<div class="osui-submenu-header-states__cell">
					<div class="osui-submenu-header-states__label">Hovered — real :hover forced on the header</div>
					<div class="layout layout-top"><div class="main"><header class="header" role="banner">
						<div class="header-top">
							<div class="header-content display-flex">
								<div class="header-navigation OSInline">
									<div class="app-menu-links" role="menubar">
										<div class="osui-submenu osui-submenu--is-dropdown" data-pseudo="header-hover">
											<div class="osui-submenu__header">
												<div class="osui-submenu__header__item">Products</div>
												<div class="osui-submenu__header__icon"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</header></div></div>
				</div>
				<div class="osui-submenu-header-states__cell">
					<div class="osui-submenu-header-states__label">Selected (.active) — the current screen is under this submenu</div>
					<div class="layout layout-top"><div class="main"><header class="header" role="banner">
						<div class="header-top">
							<div class="header-content display-flex">
								<div class="header-navigation OSInline">
									<div class="app-menu-links" role="menubar">
										<div class="osui-submenu osui-submenu--is-dropdown active">
											<div class="osui-submenu__header">
												<div class="osui-submenu__header__item">Products</div>
												<div class="osui-submenu__header__icon"></div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</header></div></div>
				</div>
				<div class="osui-submenu-header-states__cell osui-submenu-header-states__cell--open">
					<div class="osui-submenu-header-states__label">Open (--is-open) — dropdown over the page</div>
					<div class="layout layout-top"><div class="main"><header class="header" role="banner">
						<div class="header-top">
							<div class="header-content display-flex">
								<div class="header-navigation OSInline">
									<div class="app-menu-links" role="menubar">
										<div class="osui-submenu osui-submenu--is-dropdown osui-submenu--is-open">
											<div class="osui-submenu__header">
												<div class="osui-submenu__header__item">Products</div>
												<div class="osui-submenu__header__icon"></div>
											</div>
											<div class="osui-submenu__items">
												<a data-link="" href="#" tabindex="-1" role="menuitem">Analytics</a>
												<a data-link="" href="#" tabindex="-1" role="menuitem">Automation</a>
												<a data-link="" href="#" tabindex="-1" role="menuitem">Integrations</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</header></div></div>
				</div>
				<div class="osui-submenu-header-states__cell osui-submenu-header-states__cell--open">
					<div class="osui-submenu-header-states__label">Selected + open — with the current screen's item marked</div>
					<div class="layout layout-top"><div class="main"><header class="header" role="banner">
						<div class="header-top">
							<div class="header-content display-flex">
								<div class="header-navigation OSInline">
									<div class="app-menu-links" role="menubar">
										<div class="osui-submenu osui-submenu--is-dropdown active osui-submenu--is-open">
											<div class="osui-submenu__header">
												<div class="osui-submenu__header__item">Products</div>
												<div class="osui-submenu__header__icon"></div>
											</div>
											<div class="osui-submenu__items">
												<a data-link="" class="active" href="#" tabindex="-1" role="menuitem">Analytics</a>
												<a data-link="" href="#" tabindex="-1" role="menuitem">Automation</a>
												<a data-link="" href="#" tabindex="-1" role="menuitem">Integrations</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</header></div></div>
				</div>
			</div>`),
};

export const States: Story = {
	name: 'Submenu States ',
	parameters: {
		controls: { disable: true },
		pseudo: {
			hover: ['[data-pseudo="header-hover"] .osui-submenu__header', 'a[data-pseudo="item-hover"]'],
			active: ['a[data-pseudo="item-pressed"]'],
		},
	},
	render: () => {
		const id = uid('submenu-states');
		return renderStatic(`
			<style>
				.osui-submenu-states {
					align -items: flex-start;
					display: flex;
					flex-wrap: wrap;
					gap: 40px 48px;
				}
				.osui-submenu-states__label {
					color: var(--color-text-subtle);
					font-family: monospace;
					font-size: 0.8125rem;
					margin-bottom: 8px;
				}
				/* Open panels are position:absolute in the component; lay them out
				   in-flow so the gallery cells don't overlap. */
				.osui-submenu-states .osui-submenu--is-open {
					flex-direction: column;
				}
				.osui-submenu-states .osui-submenu--is-open .osui-submenu__items {
					margin-top: 8px;
					position: static;
				}
			</style>
			<div class="osui-submenu-states">
				<div class="osui-submenu-states__cell">
					<div class="osui-submenu-states__label">Default (closed)</div>
					<div data-block="Navigation.Submenu" class="OSBlockWidget" id="${id}-default-block">
						<div data-container="" class="osui-submenu osui-submenu--is-dropdown" name="${id}-default" id="${id}-default">
							<div data-container="" class="osui-submenu__header needsclick" id="${id}-default-header" aria-haspopup="true" tabindex="0" aria-controls="${id}-default-items" role="menuitem" default-tabindex-element="" aria-expanded="false">
								<div class="osui-submenu__header__item" id="${id}-default-menu">Products</div>
								<div data-container="" class="osui-submenu__header__icon"></div>
							</div>
							<div class="osui-submenu__items" id="${id}-default-items">
								<span class="focus-trap-top wcag-hide-text" tabindex="-1" aria-hidden="true"></span>
								<a data-link="" class="ThemeGrid_MarginGutter" href="#" tabindex="-1" role="menuitem">Analytics</a>
								<a data-link="" class="ThemeGrid_MarginGutter" href="#" tabindex="-1" role="menuitem">Automation</a>
								<span class="focus-trap-bottom wcag-hide-text" tabindex="-1" aria-hidden="true"></span>
							</div>
						</div>
					</div>
				</div>
				<div class="osui-submenu-states__cell">
					<div class="osui-submenu-states__label">Header hovered</div>
					<div data-block="Navigation.Submenu" class="OSBlockWidget" id="${id}-hover-block">
						<div data-container="" class="osui-submenu osui-submenu--is-dropdown" name="${id}-hover" id="${id}-hover" data-pseudo="header-hover">
							<div data-container="" class="osui-submenu__header needsclick" id="${id}-hover-header" aria-haspopup="true" tabindex="0" aria-controls="${id}-hover-items" role="menuitem" default-tabindex-element="" aria-expanded="false">
								<div class="osui-submenu__header__item" id="${id}-hover-menu">Products</div>
								<div data-container="" class="osui-submenu__header__icon"></div>
							</div>
							<div class="osui-submenu__items" id="${id}-hover-items">
								<span class="focus-trap-top wcag-hide-text" tabindex="-1" aria-hidden="true"></span>
								<a data-link="" class="ThemeGrid_MarginGutter" href="#" tabindex="-1" role="menuitem">Analytics</a>
								<a data-link="" class="ThemeGrid_MarginGutter" href="#" tabindex="-1" role="menuitem">Automation</a>
								<span class="focus-trap-bottom wcag-hide-text" tabindex="-1" aria-hidden="true"></span>
							</div>
						</div>
					</div>
				</div>
				<div class="osui-submenu-states__cell">
					<div class="osui-submenu-states__label">Active (.active)</div>
					<div data-block="Navigation.Submenu" class="OSBlockWidget" id="${id}-active-block">
						<div data-container="" class="osui-submenu osui-submenu--is-dropdown active" name="${id}-active" id="${id}-active">
							<div data-container="" class="osui-submenu__header needsclick" id="${id}-active-header" aria-haspopup="true" tabindex="0" aria-controls="${id}-active-items" role="menuitem" default-tabindex-element="" aria-expanded="false">
								<div class="osui-submenu__header__item" id="${id}-active-menu">Products</div>
								<div data-container="" class="osui-submenu__header__icon"></div>
							</div>
							<div class="osui-submenu__items" id="${id}-active-items">
								<span class="focus-trap-top wcag-hide-text" tabindex="-1" aria-hidden="true"></span>
								<a data-link="" class="active" href="#" tabindex="-1" role="menuitem">Analytics</a>
								<a data-link="" class="ThemeGrid_MarginGutter" href="#" tabindex="-1" role="menuitem">Automation</a>
								<span class="focus-trap-bottom wcag-hide-text" tabindex="-1" aria-hidden="true"></span>
							</div>
						</div>
					</div>
				</div>
				<div class="osui-submenu-states__cell">
					<div class="osui-submenu-states__label">Open (--is-open)</div>
					<div data-block="Navigation.Submenu" class="OSBlockWidget" id="${id}-open-block">
						<div data-container="" class="osui-submenu osui-submenu--is-dropdown osui-submenu--is-open" name="${id}-open" id="${id}-open">
							<div data-container="" class="osui-submenu__header needsclick" id="${id}-open-header" aria-haspopup="true" tabindex="0" aria-controls="${id}-open-items" role="menuitem" default-tabindex-element="" aria-expanded="true">
								<div class="osui-submenu__header__item" id="${id}-open-menu">Products</div>
								<div data-container="" class="osui-submenu__header__icon"></div>
							</div>
							<div class="osui-submenu__items" id="${id}-open-items">
								<span class="focus-trap-top wcag-hide-text" tabindex="-1" aria-hidden="true"></span>
								<a data-link="" class="ThemeGrid_MarginGutter" href="#" tabindex="-1" role="menuitem">Analytics</a>
								<a data-link="" class="ThemeGrid_MarginGutter" href="#" tabindex="-1" role="menuitem">Automation</a>
								<a data-link="" class="ThemeGrid_MarginGutter" href="#" tabindex="-1" role="menuitem">Integrations</a>
								<a data-link="" class="ThemeGrid_MarginGutter" href="#" tabindex="-1" role="menuitem">Reports</a>
								<span class="focus-trap-bottom wcag-hide-text" tabindex="-1" aria-hidden="true"></span>
							</div>
						</div>
					</div>
				</div>
				<div class="osui-submenu-states__cell">
					<div class="osui-submenu-states__label">Active + open</div>
					<div data-block="Navigation.Submenu" class="OSBlockWidget" id="${id}-active-open-block">
						<div data-container="" class="osui-submenu osui-submenu--is-dropdown active osui-submenu--is-open" name="${id}-active-open" id="${id}-active-open">
							<div data-container="" class="osui-submenu__header needsclick" id="${id}-active-open-header" aria-haspopup="true" tabindex="0" aria-controls="${id}-active-open-items" role="menuitem" default-tabindex-element="" aria-expanded="true">
								<div class="osui-submenu__header__item" id="${id}-active-open-menu">Products</div>
								<div data-container="" class="osui-submenu__header__icon"></div>
							</div>
							<div class="osui-submenu__items" id="${id}-active-open-items">
								<span class="focus-trap-top wcag-hide-text" tabindex="-1" aria-hidden="true"></span>
								<a data-link="" class="active" href="#" tabindex="-1" role="menuitem">Analytics</a>
								<a data-link="" class="ThemeGrid_MarginGutter" href="#" tabindex="-1" role="menuitem">Automation</a>
								<span class="focus-trap-bottom wcag-hide-text" tabindex="-1" aria-hidden="true"></span>
							</div>
						</div>
					</div>
				</div>
				<div class="osui-submenu-states__cell">
					<div class="osui-submenu-states__label">Item states</div>
					<div data-block="Navigation.Submenu" class="OSBlockWidget" id="${id}-items-block">
						<div data-container="" class="osui-submenu osui-submenu--is-dropdown osui-submenu--is-open" name="${id}-items" id="${id}-items">
							<div data-container="" class="osui-submenu__header needsclick" id="${id}-items-header" aria-haspopup="true" tabindex="0" aria-controls="${id}-items-items" role="menuitem" default-tabindex-element="" aria-expanded="true">
								<div class="osui-submenu__header__item" id="${id}-items-menu">Products</div>
								<div data-container="" class="osui-submenu__header__icon"></div>
							</div>
							<div class="osui-submenu__items" id="${id}-items-items">
								<span class="focus-trap-top wcag-hide-text" tabindex="-1" aria-hidden="true"></span>
								<a data-link="" class="ThemeGrid_MarginGutter" href="#" tabindex="-1" role="menuitem">Item — default</a>
								<a data-link="" class="ThemeGrid_MarginGutter" href="#" tabindex="-1" role="menuitem" data-pseudo="item-hover">Item — hovered</a>
								<a data-link="" class="active" href="#" tabindex="-1" role="menuitem">Item — selected (.active)</a>
								<a data-link="" class="ThemeGrid_MarginGutter" href="#" tabindex="-1" role="menuitem" data-pseudo="item-pressed">Item — pressed</a>
								<a data-link="" class="ThemeGrid_MarginGutter is-disabled" href="#" tabindex="-1" role="menuitem" aria-disabled="true">Item — disabled (.is-disabled)</a>
								<span class="focus-trap-bottom wcag-hide-text" tabindex="-1" aria-hidden="true"></span>
							</div>
						</div>
					</div>
				</div>
			</div>`);
	},
};
