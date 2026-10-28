import type { PatternDocMeta } from './types';

export const PASSWORD_POLICY_DOC: PatternDocMeta = {
	name: 'Password Policy',
	category: 'Utilities',
	lede: 'A live checklist of the app password rules that updates as the user types — for sign-up and change-password forms that use the OutSystems built-in identity provider.',
	overview:
		'Bind Password to the value of your password Input. The block reads the app password policy from the platform at runtime (minimum length, upper and lower case, number, special character) and, while the value is not compliant, lists each active rule with a check or cross icon; once every rule is met it collapses to a single success row. The Compliant event reports IsValid on every change so the form can gate its submit button. ODC only.',
	stylingSelector: '[data-block="Utilities.PasswordPolicy"]',
	liveStoryId: 'patterns-utilities-passwordpolicy--basic-usage',
	whenToUse: [
		'Sign-up, "set your password" and "change password" screens backed by the built-in ODC identity provider.',
		'Any password field where failing server-side validation after submit would be a poor experience.',
		'Flows where the submit button should stay disabled until the password is compliant (use the Compliant event).',
	],
	whenNotToUse: [
		'Apps that delegate authentication to an external identity provider — the policy shown would not be the one enforced; use Provider Login Button instead.',
		'Login screens — the rules only matter when a password is being created, not entered.',
	],
	anatomy: {
		tree: `<div data-block="Utilities.PasswordPolicy" class="OSBlockWidget">
  <div class="font-size-xs">
    <!-- while not compliant -->
    <div>Your password must contain:</div>
    <div class="text-green-darker"> <!-- green once the rule is met; the length row stays uncoloured -->
      <div class="password-policy_icon is-valid"></div> <!-- is-valid switches the cross for a check -->
      <div class="margin-left-s">1 uppercase letter</div>
    </div>
    <!-- once every rule is met: the single success row -->
    <div class="text-green-darker">
      <div class="password-policy_icon is-valid"></div>
      <span class="margin-left-s">Great! Your password meets all the requirements.</span>
    </div>
  </div>
</div>`,
	},
	properties: [
		{
			title: 'Password Policy',
			rows: [
				{
					name: 'Password',
					type: 'Text',
					description:
						'The password being typed (mandatory). Bind it to the variable of your password Input so the checklist re-evaluates on every keystroke.',
				},
			],
		},
	],
	events: [
		{
			name: 'Compliant',
			description:
				'Fires on every change with IsValid — True once the Password satisfies every active rule of the app policy.',
		},
	],
	accessibility: [
		'Wrap the block in a container with aria-live="polite" (as the example does) so screen readers hear each rule flip without the field losing focus.',
		'Status is conveyed by icon and colour, but every row also carries the rule as text, so the checklist reads correctly without colour.',
		'Keep the block directly below its Input and inside the same form so the rules are read in context; do not hide it until the first error.',
		'The green success text relies on the text-green-darker utility for contrast — do not override it with a lighter green in a custom theme.',
	],
	related: [
		{ name: 'Provider Login Button', storyId: 'patterns-utilities-providerloginbutton--docs' },
		{ name: 'Input With Icon', storyId: 'patterns-interaction-inputwithicon--docs' },
		{ name: 'Animated Label', storyId: 'patterns-interaction-animatedlabel--docs' },
	],
};
