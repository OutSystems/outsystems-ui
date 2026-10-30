import type { PatternDocMeta } from './types';

export const PROVIDER_LOGIN_BUTTON_DOC: PatternDocMeta = {
	name: 'Provider Login Button',
	category: 'Utilities',
	lede: 'A "Continue with …" button that already follows the Apple, Facebook and Google brand guidelines — drop one per external identity provider on your login screen and wire its OnClick.',
	overview:
		'The block renders a .btn.btn-provider-login with the provider class (apple, facebook or google), the brand mark as an inline SVG and the "Continue with <Provider>" label. Shape picks the corner radius, IconOnly drops the label for a square mark-only button, and OnClick is where you start the external login flow. The block is CSS-only and ODC only.',
	stylingSelector: '.btn.btn-provider-login',
	liveStoryId: 'patterns-utilities-providerloginbutton--basic-usage',
	cssApiSlug: 'patterns-utilities-provider-login-button',
	whenToUse: [
		'Login and sign-up screens that offer Apple, Facebook or Google as external identity providers.',
		'Account settings where users link an external provider to an existing account.',
		'A compact row of providers under the main form — set IconOnly to True on each.',
	],
	whenNotToUse: [
		'Providers other than Apple, Facebook and Google — use a regular Button with your own icon so you are not implying a brand you do not render.',
		'Primary actions unrelated to authentication; the styling is reserved by the providers for sign-in.',
	],
	anatomy: {
		tree: `<div data-block="Utilities.ProviderLoginButton" class="OSBlockWidget">
  <button class="btn btn-provider-login google soft" type="button"> <!-- apple | facebook | google · soft | rounded | none -->
    <!-- IconOnly adds btn-provider-login-logo-only, which hides the text -->
    <div class="btn-provider-login-logo">
      <div class="osui-inline-svg svg-wrapper"> <!-- Inline SVG block with the brand mark -->
        <svg>…</svg>
      </div>
    </div>
    <div class="btn-provider-login-text">
      Continue with&nbsp;<div class="btn-provider-login-text-name">Google</div>
    </div>
  </button>
</div>`,
	},
	properties: [
		{
			title: 'Provider Login Button',
			rows: [
				{
					name: 'IdentityProvider',
					type: 'IdentityProvider Identifier',
					description:
						"Apple, Facebook or Google (mandatory) — configures the button's mark, label and colours according to that provider's brand guidelines.",
				},
				{
					name: 'IconOnly',
					type: 'Boolean',
					defaultValue: 'False',
					description: 'When True, hides the label and renders a square button with only the brand mark.',
				},
				{
					name: 'Shape',
					type: 'Shape Identifier',
					defaultValue: 'SoftRounded',
					description: 'SoftRounded (token radius), Rounded (pill) or Sharp (square corners).',
				},
				{
					name: 'ExtendedClass',
					type: 'Text',
					description:
						'Extra CSS classes on the button. Example: btn-small or btn-large for the other button sizes; OutSystems UI utility classes are supported.',
				},
			],
		},
	],
	events: [
		{
			name: 'OnClick',
			description:
				'Fires when the button is clicked (mandatory) — start the external login flow for the provider here.',
		},
	],
	accessibility: [
		'The block renders a real <button type="button">, so it is focusable and activates with Enter and Space with no extra wiring.',
		'With IconOnly the visible label is gone — add an aria-label such as "Continue with Google" through the button attributes so the mark-only button still has an accessible name.',
		'The brand SVGs are decorative; the accessible name comes from the "Continue with <Provider>" text, so do not override that label with an icon-only Expression.',
		"Keep the provider colours as shipped: the button background and border are CSS API knobs, but the marks must stay on a contrasting surface to meet the providers' guidelines.",
	],
	related: [
		{ name: 'Password Policy', storyId: 'patterns-utilities-passwordpolicy--docs' },
		{ name: 'Button Loading', storyId: 'patterns-utilities-buttonloading--docs' },
		{ name: 'Inline SVG', storyId: 'patterns-utilities-inlinesvg--docs' },
	],
};
