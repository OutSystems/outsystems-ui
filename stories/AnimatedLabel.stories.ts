import type { Meta, StoryObj } from '@storybook/html-vite';
import { createAndInit, osuiRoot, renderPattern, uid } from './_helpers/osui';

const meta: Meta = {
	title: 'Patterns/Interaction/AnimatedLabel',
};
export default meta;

type Story = StoryObj;

// Builds a single Animated Label skeleton + boots the pattern.
// `value`/`disabled`/`invalid` drive the Figma v3.0.0 states:
//   - empty            → Default (resting label)
//   - value            → Filled (floating label, .active added on build)
//   - disabled         → Disabled (muted surface + label)
//   - invalid + value  → Error (danger border + message)
// Hover and Focus are pure pseudo-states (:hover / :focus-within) — verify them
// interactively on any story by hovering / clicking into the input.
type AnimatedLabelArgs = {
	label?: string;
	value?: string;
	disabled?: boolean;
	invalid?: boolean;
};

function animatedLabel({
	label = 'Label',
	value = '',
	disabled = false,
	invalid = false,
}: AnimatedLabelArgs): HTMLElement {
	const id = uid('animated-label');
	const inputId = `${id}-input`;
	const controlClass = invalid ? 'form-control not-valid' : 'form-control';
	const template = `
		<div ${osuiRoot(id)} class="animated-label" style="max-width:280px;">
			<div class="animated-label-text"><label for="${inputId}" data-label>${label}</label></div>
			<div class="animated-label-input">
				<input id="${inputId}" class="${controlClass}" type="text" data-input value="${value}" ${disabled ? 'disabled' : ''} />
				${invalid ? '<span class="validation-message feedback-message-error">Error message</span>' : ''}
			</div>
		</div>`;
	return renderPattern(template, (_root, register) => {
		const instance = createAndInit('AnimatedLabelAPI', id, {}, register);
		// A pre-filled input only floats once the framework calls updateOnRender():
		// build() runs _inputStateToggle() before `isBuilt` is set, so it no-ops.
		// Service Studio calls updateOnRender() after render; mirror that here.
		instance?.updateOnRender?.();
	});
}

type DefaultArgs = {
	disabled: boolean;
};

export const Default: StoryObj<DefaultArgs> = {
	args: {
		disabled: false,
	},
	argTypes: {
		disabled: {
			name: 'Disabled',
			control: 'boolean',
			description: 'Disables the input and mutes the field surface + label.',
		},
	},
	render: ({ disabled }) => animatedLabel({ label: 'Full name', disabled }),
};

export const ErrorState: Story = {
	render: () => animatedLabel({ label: 'Full name', value: 'Filled text', invalid: true }),
};

// Renders every state stacked for a side-by-side comparison against Figma.
export const AllStates: Story = {
	render: () => {
		const wrapper = document.createElement('div');
		wrapper.style.cssText = 'display:flex;flex-direction:column;gap:32px;padding:24px;';
		[
			animatedLabel({ label: 'Default' }),
			animatedLabel({ label: 'Filled', value: 'Filled text' }),
			animatedLabel({ label: 'Disabled', disabled: true }),
			animatedLabel({ label: 'Error', value: 'Filled text', invalid: true }),
		].forEach((el) => wrapper.appendChild(el));
		return wrapper;
	},
};
