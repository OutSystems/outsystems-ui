import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from '../_helpers/osui';

const meta: Meta = { title: 'Widgets/FeedbackMessage' };
export default meta;
type Story = StoryObj;

// At runtime the platform base layer (.storybook/platform/platform-basic.css, the
// platform's `_Basic.css`) fixes a feedback message to the top of the screen and slides it
// in; OUI only themes it. One message at a time is the real behaviour. To show the four
// variants side by side, each example opts out of the fixed position and the animation.
const msg = (variant: string, icon: string, text: string) => `
	<div class="feedback-message ${variant}" style="position: relative; inset: auto; transform: none; animation: none; margin: 0 0 50px;">
		<i class="ph ${icon}"></i>
		<span class="feedback-message-text">${text}</span>
	</div>`;

export const Default: Story = {
	render: () =>
		renderStatic(
			msg('feedback-message-success', 'ph-check-circle', 'Operation completed successfully.') +
				msg('feedback-message-error', 'ph-x-circle', 'Something went wrong.') +
				msg('feedback-message-warning', 'ph-warning', 'Please review before proceeding.') +
				msg('feedback-message-info', 'ph-info', "Here's some useful information.")
		),
};
