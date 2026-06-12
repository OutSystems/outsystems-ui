import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Separator — CSS-only utility. Contract from
 * src/scss/04-patterns/06-utilities/_separator.scss:
 *
 *   .separator.separator-horizontal   1px full-width rule
 *   .separator.separator-vertical     1px full-height rule (inline-block)
 *
 * Color comes from the `--osui-separator-color` CSS-API var (defaults to
 * `--color-primary`).
 */

interface SeparatorArgs {
	orientation: 'horizontal' | 'vertical';
	color: string;
	extendedClass: string;
}

const meta: Meta<SeparatorArgs> = {
	title: 'Patterns/Utilities/Separator',
	argTypes: {
		orientation: { name: 'Orientation', control: 'inline-radio', options: ['horizontal', 'vertical'] },
		color: {
			name: '--osui-separator-color',
			control: 'color',
			description: 'Per-instance override of the component CSS-API var.',
		},
		extendedClass: extendedClassArgType,
	},
	args: { orientation: 'horizontal', color: '', extendedClass: '' },
};
export default meta;

type Story = StoryObj<SeparatorArgs>;

export const Default: Story = {
	render: ({ orientation, color, extendedClass }) => {
		const colorStyle = color ? `--osui-separator-color: ${color};` : '';
		if (orientation === 'vertical') {
			return renderStatic(`
				<div style="display: flex; align-items: center; gap: 16px; height: 64px; max-width: 420px;">
					<span>Left content</span>
					<div class="${cls('separator', 'separator-vertical', extendedClass)}" style="${colorStyle}"></div>
					<span>Right content</span>
				</div>`);
		}
		return renderStatic(`
			<div style="max-width: 420px;">
				<p>Content above the separator.</p>
				<div class="${cls('separator', 'separator-horizontal', extendedClass)}" style="${colorStyle}"></div>
				<p>Content below the separator.</p>
			</div>`);
	},
};
