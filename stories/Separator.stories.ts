import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, COLOR_OPTIONS, extendedClassArgType, SPACE_OPTIONS } from './_helpers/lowcode';

/**
 * Separator — CSS-only pattern. Low-code input parameters from the library OML wired as
 * Storybook controls; the class mapping mirrors the block's own Style Classes expression:
 *
 *   If(not IsVertical,
 *      "padding-top-" + Space + " padding-bottom-" + Space,
 *      "separator-wrapper full-height padding-right-" + Space + " padding-left-" + Space)
 *
 * on the wrapper Container, with the rule itself carrying:
 *
 *   IsVertical     → .separator-vertical (1px full-height, inline-block) vs
 *                    .separator-horizontal (1px full-width)
 *   Color          → background-{value} utility class from 05-useful/_colors-*.scss.
 *                    05-useful is imported after 04-patterns, so it always overrides the
 *                    fallback background-color set by .separator itself.
 *   ExtendedClass  → appended verbatim
 *
 * There is deliberately no `--osui-separator-*` CSS-API var: colour is already a low-code
 * parameter (see src/scss/04-patterns/06-utilities/_separator.scss).
 */

interface SeparatorArgs {
	isVertical: boolean;
	space: string;
	color: string;
	extendedClass: string;
}

const meta: Meta<SeparatorArgs> = {
	title: 'Patterns/Utilities/Separator',
	argTypes: {
		isVertical: {
			name: 'IsVertical',
			control: 'boolean',
			description: 'Set the orientation of the Separator. When true it renders as a vertical rule.',
		},
		space: {
			name: 'Space',
			control: 'select',
			options: SPACE_OPTIONS,
			description:
				'Space around the Separator — padding on the block axis when horizontal, on the inline axis when vertical.',
		},
		color: {
			name: 'Color',
			control: 'select',
			options: COLOR_OPTIONS,
			description: 'Color of the Separator. Empty falls back to the neutral border colour from the SCSS.',
		},
		extendedClass: extendedClassArgType,
	},
	args: { isVertical: false, space: 'base', color: '', extendedClass: '' },
};
export default meta;

type Story = StoryObj<SeparatorArgs>;

export const Default: Story = {
	render: ({ isVertical, space, color, extendedClass }) => {
		const separator = cls(
			'separator',
			isVertical ? 'separator-vertical' : 'separator-horizontal',
			color && `background-${color}`,
			extendedClass
		);

		if (isVertical) {
			const wrapper = cls('separator-wrapper', 'full-height', `padding-right-${space}`, `padding-left-${space}`);
			return renderStatic(`
				<div style="display: flex; align-items: center; height: 64px; max-width: 420px;">
					<span>Left content</span>
					<div class="${wrapper}">
						<div class="${separator}"></div>
					</div>
					<span>Right content</span>
				</div>`);
		}

		const wrapper = cls(`padding-top-${space}`, `padding-bottom-${space}`);
		return renderStatic(`
			<div style="max-width: 420px;">
				<p>Content above the separator.</p>
				<div class="${wrapper}">
					<div class="${separator}"></div>
				</div>
				<p>Content below the separator.</p>
			</div>`);
	},
};
