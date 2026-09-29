import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * ProviderLoginButton — static markup of the `provider-login-button` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * A `.btn.btn-provider-login` with a logo and a text slot; `btn-provider-login-logo-only`, `btn-small` / `btn-large` and the shape classes select the variant.
 *
 * CSS contract: src/scss/04-patterns/06-utilities/_provider-login-button.scss.
 */
const meta: Meta = { title: 'Patterns/Utilities/ProviderLoginButton' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<button class="btn btn-provider-login" type="button">
			<span class="btn-provider-login-logo"><img alt="" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'></svg>"></span>
			<span class="btn-provider-login-text"><span class="btn-provider-login-text-name">Log in with Provider</span></span>
			</button>`),
};

export const LogoOnlySmall: Story = {
	render: () =>
		renderStatic(`
			<button class="btn btn-provider-login btn-provider-login-logo-only btn-small" type="button" aria-label="Log in with Provider">
			<span class="btn-provider-login-logo"><img alt="" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'></svg>"></span>
			</button>`),
};
