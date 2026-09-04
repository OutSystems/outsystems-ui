import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Input With Icon — CSS-only. Contract from
 * src/scss/04-patterns/03-interaction/_input-with-icon.scss:
 *
 *   .input-with-icon                    root (flex, relative)
 *   .input-with-icon-right              icon docks right instead of left
 *     .input-with-icon-content-icon     absolute icon slot; when non-empty the
 *                                       ADJACENT sibling input gains matching padding
 *     .input-with-icon-content-icon
 *       .search-actions                 second slot, docked to the opposite edge
 *     .input-with-icon-input > input    the input itself
 *
 * Sizing / state come from the Input widget (src/scss/03-widgets/_inputs-and-textareas.scss):
 *   .form-control[data-input]            40px · font-size 350   (default)
 *   .form-control.input-large[data-input] 48px · font-size 400  (also the DEFAULT inside .phone/.tablet)
 *   .form-control.input-small[data-input] 32px · font-size 300
 *   .not-valid                           error border; pair with span.validation-message
 */

interface InputWithIconArgs {
	iconPosition: 'left' | 'right';
	icon: string;
	placeholder: string;
	extendedClass: string;
}

const meta: Meta<InputWithIconArgs> = {
	title: 'Patterns/Interaction/InputWithIcon',
	argTypes: {
		iconPosition: {
			name: 'IconPosition',
			control: 'inline-radio',
			options: ['left', 'right'],
			description: 'Side of the input where the icon is rendered.',
		},
		icon: { name: 'Icon', control: 'text', description: 'Phosphor icon class (e.g. ph-magnifying-glass).' },
		placeholder: { name: 'Placeholder', control: 'text' },
		extendedClass: extendedClassArgType,
	},
	args: { iconPosition: 'left', icon: 'ph-magnifying-glass', placeholder: 'Search…', extendedClass: '' },
};
export default meta;

type Story = StoryObj<InputWithIconArgs>;

export const Default: Story = {
	render: ({ iconPosition, icon, placeholder, extendedClass }) =>
		renderStatic(`
			<div style="max-width: 320px;">
				<div class="${cls('input-with-icon', iconPosition === 'right' && 'input-with-icon-right', extendedClass)}">
					<div class="input-with-icon-content-icon" style="align-items: center; justify-content: center;">
						<i class="icon ph ${icon}"></i>
					</div>
					<div class="input-with-icon-input">
						<input type="text" class="form-control" data-input placeholder="${placeholder}" />
					</div>
				</div>
			</div>`),
};

/* ── Spec matrix ────────────────────────────────────────────────────────────── */

type Size = 'default' | 'large' | 'small';
type State = 'default' | 'hover' | 'focus' | 'filled' | 'disabled' | 'error';

const SIZES: ReadonlyArray<{ key: Size; heading: string; cls: string }> = [
	{ key: 'default', heading: 'Default / Desktop', cls: '' },
	{ key: 'large', heading: 'Large / Phone', cls: 'input-large' },
	{ key: 'small', heading: 'Small', cls: 'input-small' },
];

const STATES: readonly State[] = ['default', 'hover', 'focus', 'filled', 'disabled', 'error'];

/** One Label + Input-With-Icon (leading icon + trailing clear) + helper/error triplet. */
function field(size: Size, state: State): string {
	const sizeCls = SIZES.find((s) => s.key === size)!.cls;
	const isError = state === 'error';
	const filled = state === 'focus' || state === 'filled' || state === 'disabled' || isError;

	return `
		<div class="osui-iwi-cell" data-demo-state="${state}">
			<label data-label>Label</label>
			<div class="input-with-icon">
				<div class="input-with-icon-content-icon">
					<i class="icon ph ph-user"></i>
				</div>
				<div class="input-with-icon-input">
					<input
						type="text"
						class="${cls('form-control', sizeCls, isError && 'not-valid')}"
						data-input
						${filled ? 'value="Filled text"' : 'placeholder="Placeholder"'}
						${state === 'disabled' ? 'disabled' : ''}
					/>
				</div>
				<div class="input-with-icon-content-icon search-actions">
					<i class="icon ph ph-x"></i>
				</div>
			</div>
			${isError ? '<span class="validation-message">Error message</span>' : '<div class="input-helper">Helper message</div>'}
		</div>`;
}

/**
 * Every size × state combination from the Figma spec sheet, laid out as a matrix.
 *
 * `:hover` and `:focus` are re-declared against `[data-demo-state]` rather than
 * triggered for real — a static grid can't hold six hovers and three focuses at
 * once, and Chromatic snapshots can't hover at all. The demo rules deliberately
 * read the SAME `--osui-input-*` CSS API vars the real `:hover` / `:focus` rules
 * read, so they cannot drift from the component's actual values.
 */
export const SpecMatrix: Story = {
	name: 'Spec matrix (size × state)',
	parameters: { controls: { disable: true } },
	render: () =>
		renderStatic(`
			<style>
				.osui-iwi-matrix {
					display: grid;
					gap: 32px 40px;
					grid-template-columns: max-content repeat(3, minmax(220px, 1fr));
					align-items: start;
				}
				.osui-iwi-matrix__col-head,
				.osui-iwi-matrix__row-head {
					color: var(--color-text-subtle);
					font-family: monospace;
					font-size: 0.8125rem;
				}
				.osui-iwi-matrix__row-head { padding-top: 26px; }
				.osui-iwi-cell label[data-label] { display: block; }

				/* Simulated interaction states — mirror of the real rules in
				   _inputs-and-textareas.scss, driven by a data attribute so the
				   whole matrix can render at once. */
				.osui-iwi-cell[data-demo-state='hover'] .form-control[data-input] {
					border-color: var(--osui-input-hover-border-color);
				}
				.osui-iwi-cell[data-demo-state='focus'] .form-control[data-input] {
					border-color: var(--osui-input-focus-border-color);
					box-shadow: 0 0 0 var(--token-border-size-050, 2px) var(--osui-input-focus-ring-color);
					outline: none;
				}
			</style>
			<div class="osui-iwi-matrix">
				<div></div>
				${SIZES.map((s) => `<div class="osui-iwi-matrix__col-head">${s.heading}</div>`).join('')}
				${STATES.map(
					(state) => `
						<div class="osui-iwi-matrix__row-head">${state[0].toUpperCase()}${state.slice(1)}</div>
						${SIZES.map((s) => field(s.key, state)).join('')}`
				).join('')}
			</div>`),
};
