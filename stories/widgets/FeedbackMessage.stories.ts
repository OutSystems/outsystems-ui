import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from '../_helpers/osui';

const meta: Meta = { title: 'Widgets/FeedbackMessage' };
export default meta;
type Story = StoryObj;

const msg = (variant: string, icon: string, text: string) => `
	<div class="feedback-message ${variant}" style="margin-bottom:8px;">
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
