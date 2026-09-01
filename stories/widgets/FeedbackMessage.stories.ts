import type { Meta, StoryObj } from '@storybook/html-vite';
import { cls, styleClassesArgType } from '../_helpers/lowcode';
import { renderStatic } from '../_helpers/osui';

type WidgetArgs = { styleClasses: string };

const meta: Meta<WidgetArgs> = {
	title: 'Widgets/FeedbackMessage',
	args: { styleClasses: '' },
	argTypes: { styleClasses: styleClassesArgType },
};
export default meta;
type Story = StoryObj<WidgetArgs>;

const msg = (variant: string, icon: string, text: string, styleClasses = '') => `
	<div class="${cls('feedback-message', variant, styleClasses)}" style="margin-bottom:50px;">
		<i class="ph ${icon}"></i>
		<span class="feedback-message-text">${text}</span>
	</div>`;

export const Default: Story = {
	render: ({ styleClasses }) =>
		renderStatic(
			msg('feedback-message-success', 'ph-check-circle', 'Operation completed successfully.', styleClasses) +
				msg('feedback-message-error', 'ph-x-circle', 'Something went wrong.', styleClasses) +
				msg('feedback-message-warning', 'ph-warning', 'Please review before proceeding.', styleClasses) +
				msg('feedback-message-info', 'ph-info', "Here's some useful information.", styleClasses)
		),
};
