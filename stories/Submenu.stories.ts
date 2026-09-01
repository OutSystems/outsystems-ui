import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from './_helpers/lowcode';
import { createAndInit, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

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
	extendedClass: string;
}

const meta: Meta<SubmenuArgs> = {
	title: 'Patterns/Navigation/Submenu',
	argTypes: {
		openOnHover: { control: 'boolean', name: 'OpenOnHover' },
		extendedClass: extendedClassArgType,
	},
	args: { openOnHover: false, extendedClass: '' },
};
export default meta;

type Story = StoryObj<SubmenuArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('submenu');
		const template = `
			<div ${osuiRoot(id)} class="osui-submenu" style="width:220px;">
				<button class="osui-submenu__header" id="${id}-header" type="button">
					<span class="osui-submenu__header__item">Products</span>
					<span class="osui-submenu__header__icon"></span>
				</button>
				<div class="osui-submenu__items" id="${id}-items">
					<a href="#one">Analytics</a>
					<a class="active" href="#two">Automation</a>
					<a href="#three">Integrations</a>
					<a aria-disabled="true" class="is-disabled" href="#four">Reports</a>
				</div>
			</div>`;
		return renderPattern(template, (_root, register) => {
			const instance = createAndInit(
				'SubmenuAPI',
				id,
				{ OpenOnHover: args.openOnHover, ExtendedClass: args.extendedClass },
				register
			);
			// Submenu only wires its click/hover listeners once `_hasValidChildren()` can
			// see a built pattern — `setHtmlElements()` runs before `finishBuild()`, so the
			// check always fails at init. The platform recovers by calling UpdateOnRender on
			// every render; Storybook has to do the same or the panel never opens.
			Patterns().SubmenuAPI.UpdateOnRender(id);
			return instance;
		});
	},
};
