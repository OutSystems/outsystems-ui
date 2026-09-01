import type { Meta, StoryObj } from '@storybook/html-vite';
import { cls, styleClassesArgType } from '../_helpers/lowcode';
import { renderStatic } from '../_helpers/osui';

/**
 * Popup — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17. The live
 * widget renders through a React portal, so the markup landed on `document.body`
 * rather than inside the story root:
 *
 *   `div.portal-class[style="display: inline"]`
 *     > `div`                                    ← portal's own wrapper
 *       > `div.popup-backdrop[data-popup-backdrop]`
 *         > `div[data-popup].popup-dialog[role=dialog][aria-modal=true]`
 *           > `div.popup-content` > the popup's children
 *
 * Transcribed here it nests inside the story root instead — visually identical,
 * because the platform base layer gives `[data-popup-backdrop]`
 * `position: fixed; inset: 0`, so it covers the viewport from wherever it sits in
 * the tree. The `.portal-class` wrapper is kept so the DOM still matches.
 *
 * CSS contract: src/scss/03-widgets/_popup.scss — `[data-popup-backdrop]` z-index
 * and the `.popup-dialog` component CSS API (`--osui-popup-*`).
 */
type WidgetArgs = { styleClasses: string };

const meta: Meta<WidgetArgs> = {
	title: 'Widgets/Popup',
	args: { styleClasses: '' },
	argTypes: { styleClasses: styleClassesArgType },
};
export default meta;
type Story = StoryObj<WidgetArgs>;

export const Default: Story = {
	render: ({ styleClasses }) =>
		renderStatic(`
			<div class="${cls('portal-class', styleClasses)}" style="display: inline;">
				<div>
					<div class="popup-backdrop" data-popup-backdrop="">
						<div data-popup="" class="popup-dialog " role="dialog" aria-modal="true">
							<div class="popup-content">
								<h2 style="margin-top:0;">Confirm action</h2>
								<p>The platform Popup widget renders a centered dialog over a backdrop.</p>
							</div>
						</div>
					</div>
				</div>
			</div>`),
};
