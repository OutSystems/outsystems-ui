import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { extendedClassArgType } from './_helpers/lowcode';

/**
 * Provider Login Button — controls mirror the low-code input parameters of the
 * `ProviderLoginButton` block in the OutSystemsUI library OML.
 *   IdentityProvider :: IdentityProvider Identifier :: (mandatory) — apple | facebook | google
 *   IconOnly         :: Boolean                     :: False
 *   Shape            :: Shape Identifier            :: Entities.Shape.SoftRounded
 *   ExtendedClass    :: Text                        :: ""
 *
 * The markup is the DOM the block renders at runtime (OutSystems UI 3.0.0, ODC), down to
 * the class string, which the block builds as
 *   "btn btn-provider-login " + Provider + " " + Shape + " " + (IconOnly ? "btn-provider-login-logo-only" : "") + " " + ExtendedClass
 * with `Provider` from the IdentityProvider record (`apple` / `facebook` / `google`) and
 * `Shape` from the Shape record (`rounded` / `soft` / `none`). The shape class matters:
 * `.btn.btn-provider-login` resets `border-radius` to 0, and only `.soft` / `.rounded`
 * give it back.
 *
 * The logo is an InlineSVG block holding the provider's brand mark; the label is
 * "Continue with " followed by the provider name in `.btn-provider-login-text-name`.
 * There is no size parameter: `.btn-small` / `.btn-large` exist in the CSS and are reached
 * through ExtendedClass.
 *
 * CSS contract: src/scss/04-patterns/06-utilities/_provider-login-button.scss.
 */
type Provider = 'apple' | 'facebook' | 'google';
type Shape = 'soft' | 'rounded' | 'none';

type ProviderLoginButtonArgs = {
	identityProvider: Provider;
	iconOnly: boolean;
	shape: Shape;
	extendedClass: string;
};

/** Brand marks exactly as the block's InlineSVG instances carry them. */
const LOGOS: Record<Provider, string> = {
	google: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M20 10.2274C20 9.51826 19.9351 8.83643 19.8145 8.18188H10.2041V12.0501H15.6958C15.4592 13.3001 14.7403 14.3592 13.6596 15.0683V17.5774H16.9573C18.8868 15.8365 20 13.2728 20 10.2274Z" fill="#4285F4"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.2042 20C12.9593 20 15.2691 19.1045 16.9574 17.5772L13.6597 15.0681C12.7459 15.6681 11.5771 16.0227 10.2042 16.0227C7.54649 16.0227 5.29695 14.2636 4.49454 11.8999H1.08545V14.4908C2.76448 17.759 6.21532 20 10.2042 20Z" fill="#34A853"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4.49443 11.9001C4.29035 11.3001 4.1744 10.6592 4.1744 10.0001C4.1744 9.341 4.29035 8.70009 4.49443 8.10008V5.50916H1.08534C0.394249 6.85917 0 8.38645 0 10.0001C0 11.6137 0.394249 13.141 1.08534 14.491L4.49443 11.9001Z" fill="#FBBC05"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M10.2042 3.9773C11.7023 3.9773 13.0474 4.48185 14.1049 5.47277L17.0317 2.60456C15.2645 0.990916 12.9547 0 10.2042 0C6.21532 0 2.76449 2.24093 1.08545 5.50913L4.49454 8.10006C5.29695 5.7364 7.54649 3.9773 10.2042 3.9773Z" fill="#EA4335"></path></svg>',
	facebook:
		'<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 10.0611C20 4.50451 15.5229 0 10 0C4.47715 0 0 4.50451 0 10.0611C0 15.0829 3.65686 19.2452 8.4375 20V12.9694H5.89844V10.0611H8.4375V7.84452C8.4375 5.32296 9.93043 3.93012 12.2146 3.93012C13.3087 3.93012 14.4531 4.12663 14.4531 4.12663V6.6026H13.1921C11.9499 6.6026 11.5625 7.37815 11.5625 8.17381V10.0611H14.3359L13.8926 12.9694H11.5625V20C16.3431 19.2452 20 15.0829 20 10.0611Z" fill="#1877F2"></path></svg>',
	apple: '<svg width="16" height="19" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.6647 14.8068C15.3774 15.4706 15.0374 16.0816 14.6434 16.6434C14.1064 17.4092 13.6667 17.9393 13.3279 18.2337C12.8026 18.7169 12.2398 18.9644 11.6371 18.9784C11.2045 18.9784 10.6827 18.8553 10.0753 18.6055C9.46598 18.3568 8.906 18.2337 8.39396 18.2337C7.85696 18.2337 7.28102 18.3568 6.66499 18.6055C6.04801 18.8553 5.55099 18.9855 5.17098 18.9984C4.59305 19.023 4.017 18.7685 3.442 18.2337C3.07501 17.9135 2.61598 17.3647 2.06607 16.5871C1.47607 15.7567 0.991001 14.7939 0.610992 13.6961C0.204016 12.5104 0 11.3622 0 10.2507C0 8.97735 0.27507 7.87913 0.82603 6.95883C1.25904 6.21962 1.83509 5.6365 2.55606 5.20842C3.27703 4.78035 4.05605 4.56221 4.89497 4.54825C5.35401 4.54825 5.95597 4.69028 6.70403 4.96941C7.44998 5.24947 7.92895 5.3915 8.13894 5.3915C8.29594 5.3915 8.82802 5.22543 9.73003 4.89435C10.583 4.58731 11.3029 4.46018 11.8927 4.51025C13.4908 4.63926 14.6915 5.26941 15.49 6.40468C14.0607 7.27092 13.3537 8.48418 13.3677 10.0406C13.3806 11.2529 13.8203 12.2618 14.6845 13.0628C15.0761 13.4346 15.5134 13.7219 16 13.926C15.8945 14.2321 15.7831 14.5253 15.6647 14.8068ZM11.9994 0.380108C11.9994 1.33033 11.6524 2.21754 10.9606 3.03874C10.1258 4.01498 9.11599 4.5791 8.02099 4.49008C8.00704 4.37609 7.99894 4.25611 7.99894 4.13003C7.99894 3.21782 8.39596 2.24158 9.10098 1.44337C9.45297 1.03922 9.90063 0.70318 10.4435 0.435112C10.9852 0.171044 11.4976 0.025008 11.9795 0C11.9936 0.127029 11.9994 0.254079 11.9994 0.380108Z" fill="black"></path></svg>',
};

const NAMES: Record<Provider, string> = { apple: 'Apple', facebook: 'Facebook', google: 'Google' };

/** One block instance, as rendered at runtime (OSBlockWidget wrapper included). */
const button = ({ identityProvider, iconOnly, shape, extendedClass }: ProviderLoginButtonArgs): string => `
	<div data-block="Utilities.ProviderLoginButton" class="OSBlockWidget">
		<button data-button="" class="btn btn-provider-login ${identityProvider} ${shape} ${iconOnly ? 'btn-provider-login-logo-only' : ''} ${extendedClass}" type="button">
			<div data-container="" class="btn-provider-login-logo">
				<div data-block="Utilities.InlineSVG" class="OSBlockWidget">
					<div data-container="" class="osui-inline-svg svg-wrapper" style="height: 100%;">${LOGOS[identityProvider]}</div>
				</div>
			</div>
			<div data-container="" class="btn-provider-login-text">Continue with&nbsp;<div data-container="" class="btn-provider-login-text-name"><span data-expression="">${NAMES[identityProvider]}</span></div></div>
		</button>
	</div>`;

const meta: Meta<ProviderLoginButtonArgs> = {
	title: 'Patterns/Utilities/ProviderLoginButton',
	args: {
		identityProvider: 'google',
		iconOnly: false,
		shape: 'soft',
		extendedClass: '',
	},
	argTypes: {
		identityProvider: {
			name: 'IdentityProvider',
			control: 'select',
			options: ['apple', 'facebook', 'google'],
			description: "Select Facebook, Google or Apple to configure the button's UI according to brand guidelines.",
		},
		iconOnly: {
			name: 'IconOnly',
			control: 'boolean',
			description: 'Set true to provide a button with an icon only and no label.',
		},
		shape: {
			name: 'Shape',
			control: 'select',
			options: ['soft', 'rounded', 'none'],
			description: "Set the button's shape (SoftRounded → soft, Rounded → rounded, Sharp → none).",
		},
		extendedClass: extendedClassArgType,
	},
	render: (args) => renderStatic(button(args)),
};
export default meta;

type Story = StoryObj<ProviderLoginButtonArgs>;

export const Default: Story = {};

/** The three providers stacked, as on a Login screen. */
export const AllProviders: Story = {
	render: (args) =>
		renderStatic(`
			<div style="display:flex; flex-direction:column; align-items:center; gap:24px;">
				${(['google', 'facebook', 'apple'] as Provider[]).map((p) => button({ ...args, identityProvider: p })).join('')}
			</div>`),
};

/** `IconOnly = True` — adds `.btn-provider-login-logo-only`, which hides the label. */
export const IconOnly: Story = {
	args: { iconOnly: true },
};
