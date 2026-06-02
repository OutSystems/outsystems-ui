import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/** Popup — CSS-only dialog surface (the JS open/close is platform-driven; here we show the static dialog). */
const meta: Meta = { title: 'Patterns/Interaction/Popup' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div style="position:relative;min-height:240px;background:rgba(0,0,0,.4);border-radius:8px;display:flex;align-items:center;justify-content:center;">
				<dialog class="popup-dialog" open style="position:static;max-width:420px;border:none;border-radius:8px;padding:24px;box-shadow:0 12px 32px rgba(0,0,0,.2);">
					<h2 style="margin-top:0;">Confirm action</h2>
					<p>This is a centered popup dialog rendered over a dimmed backdrop.</p>
					<div style="display:flex;gap:8px;justify-content:flex-end;">
						<button class="btn btn-cancel">Cancel</button>
						<button class="btn btn-primary">Confirm</button>
					</div>
				</dialog>
			</div>`),
};
