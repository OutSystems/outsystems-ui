import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/**
 * Login — static markup of the `login` styles, so the markup contract an agent must emit
 * can be read and measured from this story (see evals/ai-friendliness, E07 Markup Contract Depth).
 *
 * The login screen: logo, form and the `.login-button` slot that holds a ButtonLoading.
 *
 * CSS contract: src/scss/02-layout/_login.scss.
 */
const meta: Meta = { title: 'Layout/Login' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="login">
			<div class="login-screen">
				<img alt="" src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'></svg>">
				<form class="login-form" onsubmit="return false">
					<label for="login-user">Username</label>
					<input id="login-user" class="form-control" type="text" data-input="">
					<label for="login-pass">Password</label>
					<input id="login-pass" class="form-control" type="password" data-input="">
					<div class="login-button">
						<div class="osui-btn-loading"><button class="btn btn-primary" type="submit"><span data-expression="">Log in</span></button></div>
					</div>
				</form>
			</div>
			</div>`),
};
