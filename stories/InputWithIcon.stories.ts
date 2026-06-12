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
 *                                       sibling input gains matching padding
 *     .input-with-icon-input > input    the input itself
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
		icon: { name: 'Icon', control: 'text', description: 'FontAwesome 4 icon class (e.g. fa-search).' },
		placeholder: { name: 'Placeholder', control: 'text' },
		extendedClass: extendedClassArgType,
	},
	args: { iconPosition: 'left', icon: 'fa-search', placeholder: 'Search…', extendedClass: '' },
};
export default meta;

type Story = StoryObj<InputWithIconArgs>;

export const Default: Story = {
	render: ({ iconPosition, icon, placeholder, extendedClass }) =>
		renderStatic(`
			<div style="max-width: 320px;">
				<div class="${cls('input-with-icon', iconPosition === 'right' && 'input-with-icon-right', extendedClass)}">
					<div class="input-with-icon-content-icon" style="align-items: center; justify-content: center;">
						<i class="icon fa ${icon} fa-1x"></i>
					</div>
					<div class="input-with-icon-input">
						<input type="text" class="form-control" data-input placeholder="${placeholder}" />
					</div>
				</div>
			</div>`),
};
