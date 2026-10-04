import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic, uid } from './_helpers/osui';

/**
 * Password Policy — mirrors the `PasswordPolicy` block in the OutSystemsUI library OML
 * (ODC). Its one input parameter is
 *   Password :: Text :: (mandatory)
 * and it checks that value against the app's built-in password complexity policy, which
 * the block reads from the platform at runtime. The policy is not a block parameter; the
 * `Policy:` controls below stand in for it (defaults: the ODC default policy, as seen on a
 * live app — 12 characters, upper case, lower case and a number; no special character).
 *
 * The story is a form with a "New password" field (the Input widget, as in Widgets/Input) and
 * the block under it, bound to the field's value. **Type in the field** and the block
 * re-evaluates on every keystroke, as it does at runtime; the `Password` control sets the
 * initial value.
 *
 * The markup is the DOM the block renders at runtime (OutSystems UI 3.0.0):
 *   • while the password is not compliant — "Your password must contain:" and one row per
 *     active rule: `.password-policy_icon.OSInline` (+ `.is-valid` once the rule is met)
 *     next to a `.margin-left-s.OSInline` label. A met rule's row also turns
 *     `.text-green-darker` — except the length row, which the block never colours.
 *   • once every rule is met — a single `.text-green-darker` row with a valid icon and
 *     "Great! Your password meets all the requirements."
 *   • with no active rule — nothing at all.
 *
 * The length row is shown when the policy requires a *number* — that is how the block is
 * wired (the row's Visible reads NumberRequired, not MinimumLength), reproduced as is.
 *
 * The icon is drawn by `.password-policy_icon::after` (circle-x, or a green circle-check
 * with `.is-valid`) in src/scss/01-foundations/_icon-library-odc.scss — there is no O11
 * equivalent; the block is ODC-only.
 */
type PasswordPolicyArgs = {
	password: string;
	minimumLength: number;
	upperCaseLetterRequired: boolean;
	lowerCaseLetterRequired: boolean;
	numberRequired: boolean;
	specialCharacterRequired: boolean;
};

type Policy = Omit<PasswordPolicyArgs, 'password'>;

const icon = (valid: boolean): string =>
	`<div data-container="" class="password-policy_icon OSInline${valid ? ' is-valid' : ''}"></div>`;

const label = (content: string): string => `<div data-container="" class="margin-left-s OSInline">${content}</div>`;

/** A rule row; `colour` is false for the length row, which the block leaves uncoloured. */
const row = (valid: boolean, content: string, colour = true): string =>
	`<div data-container=""${colour ? ` class="${valid ? 'text-green-darker' : ''}"` : ''}>${icon(valid)}${label(content)}</div>`;

/** The block's content for a given password — what goes inside its OSBlockWidget wrapper. */
const policyContent = (password: string, policy: Policy): string => {
	const policyActive =
		policy.minimumLength > 0 ||
		policy.upperCaseLetterRequired ||
		policy.lowerCaseLetterRequired ||
		policy.numberRequired ||
		policy.specialCharacterRequired;
	if (!policyActive) {
		return '';
	}

	const has = {
		length: password.length >= policy.minimumLength,
		upper: /[A-Z]/.test(password),
		lower: /[a-z]/.test(password),
		number: /\d/.test(password),
		special: /[^A-Za-z0-9]/.test(password),
	};
	const isValid =
		has.length &&
		(!policy.upperCaseLetterRequired || has.upper) &&
		(!policy.lowerCaseLetterRequired || has.lower) &&
		(!policy.numberRequired || has.number) &&
		(!policy.specialCharacterRequired || has.special);

	const content = isValid
		? `<div data-container="" class="text-green-darker">${icon(true)}<span class="margin-left-s">Great! Your password meets all the requirements.</span></div>`
		: `<div data-container=""><div data-container="">Your password must contain:</div>${ruleRows(has, policy)}</div>`;

	return `<div data-container="" class="font-size-xs">${content}</div>`;
};

/** The rule rows in block order, each shown when its policy flag is on. */
const ruleRows = (has: Record<'length' | 'upper' | 'lower' | 'number' | 'special', boolean>, policy: Policy): string =>
	[
		// The length row's visibility reads NumberRequired — the block's own wiring.
		{
			on: policy.numberRequired,
			html: row(
				has.length,
				`At least <span data-expression="" style="margin-left: 0px;">${policy.minimumLength}</span>&nbsp;characters`,
				false
			),
		},
		{ on: policy.upperCaseLetterRequired, html: row(has.upper, '1 uppercase letter') },
		{ on: policy.lowerCaseLetterRequired, html: row(has.lower, '1 lowercase letter') },
		{ on: policy.numberRequired, html: row(has.number, '1 number') },
		{ on: policy.specialCharacterRequired, html: row(has.special, '1 special character (ex: !, @, #, $, %)') },
	]
		.filter((r) => r.on)
		.map((r) => r.html)
		.join('');

const escapeAttr = (value: string): string => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/**
 * A form with a "New password" field — the Label and Input widgets as Widgets/Input renders
 * them (`span.input-password > input.form-control[data-input][type=password]`) — and the block
 * under it, bound to the field's value.
 */
const render = ({ password, ...policy }: PasswordPolicyArgs): HTMLElement => {
	const inputId = uid('password-policy-input');
	const root = renderStatic(`
		<form data-form="" action="" novalidate="" class="form" style="max-width:360px;">
			<label data-label="" class="mandatory OSFillParent" for="${inputId}">New password</label>
			<span class="input-password">
				<input data-input="" class="form-control" type="password" placeholder="Enter your password"
					required="" aria-required="true" maxlength="256" autocomplete="new-password" id="${inputId}" value="${escapeAttr(password ?? '')}">
			</span>
			<div data-block="Utilities.PasswordPolicy" class="OSBlockWidget" aria-live="polite">${policyContent(password ?? '', policy)}</div>
		</form>`);

	const input = root.querySelector<HTMLInputElement>(`#${inputId}`);
	const block = root.querySelector<HTMLElement>('[data-block="Utilities.PasswordPolicy"]');
	// The block's Password input is bound to the field: re-evaluate on every keystroke.
	input.addEventListener('input', () => {
		block.innerHTML = policyContent(input.value, policy);
	});
	root.querySelector('form').addEventListener('submit', (e) => e.preventDefault());
	return root;
};

const meta: Meta<PasswordPolicyArgs> = {
	title: 'Patterns/Utilities/PasswordPolicy',
	args: {
		password: '',
		minimumLength: 12,
		upperCaseLetterRequired: true,
		lowerCaseLetterRequired: true,
		numberRequired: true,
		specialCharacterRequired: false,
	},
	argTypes: {
		password: { name: 'Password', control: 'text', description: 'User password (initial value of the field).' },
		minimumLength: {
			name: 'Policy: MinimumLength',
			control: { type: 'number', min: 0, step: 1 },
			description: 'Not a block parameter — the app password policy the block reads at runtime.',
		},
		upperCaseLetterRequired: { name: 'Policy: UpperCaseLetterRequired', control: 'boolean' },
		lowerCaseLetterRequired: { name: 'Policy: LowerCaseLetterRequired', control: 'boolean' },
		numberRequired: { name: 'Policy: NumberRequired', control: 'boolean' },
		specialCharacterRequired: { name: 'Policy: SpecialCharacterRequired', control: 'boolean' },
	},
	render,
};
export default meta;

type Story = StoryObj<PasswordPolicyArgs>;

/** Empty field — every rule unmet. Type a password to watch the rules turn green. */
export const Default: Story = {};

/** Some rules met: the met rows get `.is-valid` icons and (except length) turn green. */
export const PartiallyValid: Story = {
	args: { password: 'password1' },
};

/** Every rule met — the list collapses to the single success row. */
export const Compliant: Story = {
	args: { password: 'CorrectHorse42' },
};
