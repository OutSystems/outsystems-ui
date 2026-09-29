import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * AlignCenter — static markup of the `align-center` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * `.vertical-align` centres its content vertically inside a container of known height; the text-align of the wrapper drives the horizontal alignment.
 *
 * CSS contract: src/scss/04-patterns/06-utilities/_align-center.scss.
 */
const meta: Meta = { title: 'Patterns/Utilities/AlignCenter' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div style="height: 160px; border: 1px dashed var(--color-border);">
			<div class="vertical-align">
				<span>Vertically centred content</span>
			</div>
			</div>`),
};

export const CenteredText: Story = {
	render: () =>
		renderStatic(`
			<div style="height: 160px; text-align: center; border: 1px dashed var(--color-border);">
			<div class="vertical-align">
				<span>Centred on both axes</span>
			</div>
			</div>`),
};
