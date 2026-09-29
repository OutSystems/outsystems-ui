import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * PullToRefresh — static markup of the `pull-to-refresh` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * The pull indicator above the content of a native layout; `.ptr-loading` on the layout shows the loading state.
 *
 * CSS contract: src/scss/04-patterns/06-utilities/_pull-to-refresh.scss.
 */
const meta: Meta = { title: 'Patterns/Interaction/PullToRefresh' };
export default meta;
type Story = StoryObj;

export const Loading: Story = {
	render: () =>
		renderStatic(`
			<div class="layout layout-native ptr ptr-loading">
			<div class="pull-to-refresh">
				<span class="genericon" aria-hidden="true"></span>
				<div class="pull-to-refresh-loading" role="status" aria-label="Refreshing"></div>
			</div>
			<div class="content"><div class="content-middle">List content</div></div>
			</div>`),
};
