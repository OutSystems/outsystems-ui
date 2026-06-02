import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from '../_helpers/osui';

const meta: Meta = { title: 'Widgets/FeedbackMessage' };
export default meta;
type Story = StoryObj;

const msg = (variant: string, icon: string, text: string) => `
	<div class="feedback-message ${variant}" style="margin-bottom:8px;">
		<i class="fa ${icon}"></i>
		<span class="feedback-message-text">${text}</span>
	</div>`;

export const Default: Story = {
	render: () =>
		renderStatic(
			msg('feedback-message-success', 'fa-check-circle', 'Operation completed successfully.') +
				msg('feedback-message-error', 'fa-times-circle', 'Something went wrong.') +
				msg('feedback-message-warning', 'fa-exclamation-triangle', 'Please review before proceeding.') +
				msg('feedback-message-info', 'fa-info-circle', "Here's some useful information.")
		),
};
