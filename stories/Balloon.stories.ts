import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * Balloon — static markup of the `balloon` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * The shared floating layer behind OverflowMenu and similar patterns: `.osui-balloon` opens with `--is-open` and takes a position class (`bottom`, `top-left`, `right-start`, …). Shown open and statically positioned.
 *
 * CSS contract: src/scss/04-patterns/03-interaction/balloon/_balloon.scss.
 */
const meta: Meta = { title: 'Patterns/Interaction/Balloon' };
export default meta;
type Story = StoryObj;

export const OpenBottom: Story = {
	render: () =>
		renderStatic(`
			<div style="position: relative; height: 200px;">
			<button class="btn" type="button">Trigger</button>
			<div class="osui-balloon osui-balloon--is-open bottom" role="dialog" style="position: absolute; top: 48px; left: 0;">
				<ul class="list" role="menu">
					<li class="list-item" role="menuitem">Edit</li>
					<li class="list-item" role="menuitem">Duplicate</li>
					<li class="list-item" role="menuitem">Delete</li>
				</ul>
			</div>
			</div>`),
};
