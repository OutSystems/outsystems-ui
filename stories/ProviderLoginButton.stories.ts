import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * Provider Login Button — a `.btn.btn-provider-login` with a logo slot and a text slot, used on the
 * Login common screen for external identity providers. The button itself has a shape of its own, so
 * it is measured here even though the screen around it is template-owned.
 *
 *   `.btn-provider-login-logo-only` hides the text; `.btn-small` / `.btn-large` size it;
 *   the shape classes (`soft`, `rounded`) follow the Button widget.
 *
 * CSS contract: src/scss/04-patterns/06-utilities/_provider-login-button.scss.
 */
const meta: Meta = { title: 'Patterns/Utilities/ProviderLoginButton' };
export default meta;
type Story = StoryObj;

const logo = `<span class="btn-provider-login-logo" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.2"></circle></svg></span>`;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<button class="btn btn-provider-login" type="button">
				${logo}
				<span class="btn-provider-login-text"><span class="btn-provider-login-text-name">Log in with Provider</span></span>
			</button>`),
};

export const LogoOnlySmall: Story = {
	render: () =>
		renderStatic(`
			<button class="btn btn-provider-login btn-provider-login-logo-only btn-small" type="button" aria-label="Log in with Provider">
				${logo}
			</button>`),
};
