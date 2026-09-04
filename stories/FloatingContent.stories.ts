import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Floating Content — CSS-only. Anchors a block to a fixed position over the
 * screen. Classes from src/scss/04-patterns/02-content/_floating-content.scss:
 *
 *   .floating-content                      root (position: fixed)
 *   .floating-content-{position}           top | top-left | top-right | left |
 *                                          center | right | bottom | bottom-left | bottom-right
 *   .floating-content-margin               adds an outer margin
 *   .floating-content-full-width / -full-height  stretch along an axis
 *
 * The demo box is a transformed containing block so `position: fixed` anchors
 * to it instead of the viewport. Top positions offset by `--size-header`, so
 * the demo box zeroes it.
 */

const POSITION_OPTIONS = [
	'top-left',
	'top',
	'top-right',
	'left',
	'center',
	'right',
	'bottom-left',
	'bottom',
	'bottom-right',
] as const;
type Position = (typeof POSITION_OPTIONS)[number];

interface FloatingContentArgs {
	position: Position;
	useMargin: boolean;
	fullWidth: boolean;
	fullHeight: boolean;
	extendedClass: string;
}

const meta: Meta<FloatingContentArgs> = {
	title: 'Patterns/Content/FloatingContent',
	argTypes: {
		position: {
			name: 'Position',
			control: 'select',
			options: POSITION_OPTIONS,
			description: 'Where the content floats over the screen.',
		},
		useMargin: {
			name: 'UseMargin',
			control: 'boolean',
			description: 'Adds an outer margin to the floating block.',
		},
		fullWidth: { name: 'FullWidth', control: 'boolean', description: 'Stretches the block across the full width.' },
		fullHeight: {
			name: 'FullHeight',
			control: 'boolean',
			description: 'Stretches the block across the full height.',
		},
		extendedClass: extendedClassArgType,
	},
	args: { position: 'bottom-right', useMargin: true, fullWidth: false, fullHeight: false, extendedClass: '' },
};
export default meta;

type Story = StoryObj<FloatingContentArgs>;

export const Default: Story = {
	render: ({ position, useMargin, fullWidth, fullHeight, extendedClass }) =>
		renderStatic(`
			<div style="position: relative; transform: translateZ(0); overflow: hidden; height: 360px; --size-header: 0px; border-radius: var(--border-radius-soft); background: var(--color-background-body);">
				<div style="padding: 16px; color: var(--color-text-subtle);">Screen content scrolls behind the floating block.</div>
				<div class="${cls(
					'floating-content',
					`floating-content-${position}`,
					useMargin && 'floating-content-margin',
					fullWidth && 'floating-content-full-width',
					fullHeight && 'floating-content-full-height',
					extendedClass
				)}">
					<div class="card" style="padding: 12px 16px;">Floating content</div>
				</div>
			</div>`),
};
