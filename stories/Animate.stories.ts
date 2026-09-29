import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * Animate — static markup of the `animate` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * `.animate` plus one effect class (`fade-in`, `bottom-to-top`, `scale-up`, …) and an optional speed (`slow`, `fast`); the keyframes live in 07-keyframes.
 *
 * CSS contract: src/scss/04-patterns/03-interaction/_animate.scss.
 */
const meta: Meta = { title: 'Patterns/Interaction/Animate' };
export default meta;
type Story = StoryObj;

export const FadeIn: Story = {
	render: () =>
		renderStatic(`
			<div class="animate fade-in">
			<div class="card">Fades in on render</div>
			</div>`),
};

export const BottomToTopSlow: Story = {
	render: () =>
		renderStatic(`
			<div class="animate slow bottom-to-top">
			<div class="card">Slides up slowly</div>
			</div>`),
};
