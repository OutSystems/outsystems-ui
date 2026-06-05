import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * Alert — shipped markup: `.alert.alert-{status}` (role/aria) > empty `.alert-icon`
 * + `.alert-message > span`. The status icon is drawn by `.alert-{status} .alert-icon:after`
 * via `content: var(--osui-icon-{status})` (icon-library var → respects the FA/Phosphor toggle),
 * so NO inner `<i>` is needed.
 */
const meta: Meta = { title: 'Patterns/Content/Alert', tags: ['!ui-pending', 'ui-reviewed'] };
export default meta;
type Story = StoryObj;

const alert = (variant: string, msg: string) => `
	<div class="alert alert-${variant}" role="alert" aria-live="polite" aria-atomic="true" tabindex="0" style="margin-bottom:12px;">
		<div class="alert-icon OSInline" aria-hidden="true"></div>
		<div class="alert-message"><span>${msg}</span></div>
	</div>`;

export const AllVariants: Story = {
	render: () =>
		renderStatic(
			alert('info', 'Heads up — this is an informational alert.') +
				alert('success', 'Success! Your changes were saved.') +
				alert('warning', 'Warning — double-check this before continuing.') +
				alert('error', 'Something went wrong. Please try again.')
		),
};
