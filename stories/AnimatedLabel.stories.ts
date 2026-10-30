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

export const Playground: StoryObj<DefaultArgs> = {
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

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'An empty field: the label rests inside the input and floats to the top edge on focus or as soon as a value is typed.',
			},
		},
	},
	render: () => animatedLabel({ label: 'Full name' }),
};

export const PrefilledValue: Story = {
	tags: ['docs-example'],
	name: 'Pre-filled value',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'When the Input already holds a value on render, the runtime adds the `active` class and the label starts floating — no focus needed.',
			},
		},
	},
	render: () => animatedLabel({ label: 'Email address', value: 'ana.silva@example.com' }),
};

export const ErrorState: Story = {
	tags: ['docs-example'],
	name: 'Error state',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Validation comes from the Input widget: when it is not valid the platform adds `not-valid` and the validation message, and the Animated Label colours the label and border to match.',
			},
		},
	},
	render: () => animatedLabel({ label: 'Full name', value: 'Filled text', invalid: true }),
};

export const Disabled: Story = {
	tags: ['docs-example'],
	name: 'Disabled',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'A disabled Input mutes the field surface and the floating label together, so the read-only value still reads as part of the form.',
			},
		},
	},
	render: () => animatedLabel({ label: 'Employee ID', value: 'EMP-10482', disabled: true }),
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
