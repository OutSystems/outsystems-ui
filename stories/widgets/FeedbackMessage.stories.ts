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

/**
 * Long text, including a word longer than the message is wide. The message is a flex
 * container capped at `--osui-feedback-message-max-width` (600px), so a token with no break
 * opportunity — a URL, a file path — used to keep the text item at its min-content width and
 * spill past the rounded box. `.feedback-message` sets `overflow-wrap: anywhere`, which both
 * breaks the line and lowers that min-content contribution so the item can narrow.
 *
 * Kept as the Chromatic guard for that: a regression reads as text outside the surface on the
 * first message. The other two carry ordinary break opportunities and must still wrap at them
 * — mid-word breaks there would mean someone reached for `word-break: break-all` instead.
 */
export const LongText: Story = {
	render: () =>
		renderStatic(
			msg(
				'feedback-message-info',
				'ph-info',
				"Saved to Clipboard. 'https://outsystemsui-dev.outsystemsenterprise.com/TaskSample_DEV_ROU12826/TestScreen_OSUITheme#Alert'"
			) +
				msg(
					'feedback-message-error',
					'ph-x-circle',
					'Upload failed for /mnt/shared/outsystems/development/attachments/2026/q4/quarterly-revenue-consolidated-final.xlsx — the file exceeds the configured limit.'
				) +
				msg(
					'feedback-message-success',
					'ph-check-circle',
					'Your changes to the application theme have been published and are now live for every environment in the deployment pipeline, including production.'
				)
		),
};
