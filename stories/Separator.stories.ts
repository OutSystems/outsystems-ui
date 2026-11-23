import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, COLOR_OPTIONS, extendedClassArgType, SPACE_OPTIONS } from './_helpers/lowcode';
import { labeledBoard, SWATCH_COLORS } from './_helpers/showcase';

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

/** Compact horizontal demo cell for the showcase boards. */
function horizontalCell(space: string, color: string): string {
	const separator = cls('separator', 'separator-horizontal', color && `background-${color}`);
	return `
		<div style="width:220px;">
			<div>Above</div>
			<div class="${cls(`padding-top-${space}`, `padding-bottom-${space}`)}"><div class="${separator}"></div></div>
			<div>Below</div>
		</div>`;
}

export const Playground: Story = {
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

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'The defaults from Studio: horizontal (<code>IsVertical</code> False), <code>Space</code> Base above and below, <code>Color</code> Neutral4 → <code>.background-neutral-4</code> on the rule.',
			},
		},
	},
	render: () =>
		renderStatic(`
			<div style="max-width: 420px;">
				<p>Content above the separator.</p>
				<div class="padding-top-base padding-bottom-base">
					<div class="separator separator-horizontal background-neutral-4"></div>
				</div>
				<p>Content below the separator.</p>
			</div>`),
};

/** Horizontal rule next to the vertical (wrapper + full-height) variant. */
export const Orientation: Story = {
	tags: ['docs-example'],
	name: 'Orientation',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: '<code>IsVertical</code> False renders <code>.separator-horizontal</code>; True renders <code>.separator-vertical</code> inside a <code>.separator-wrapper.full-height</code> that stretches to the flex row.',
			},
		},
	},
	render: () =>
		renderStatic(
			labeledBoard(
				[
					{ label: 'horizontal', html: horizontalCell('base', '') },
					{
						label: 'vertical',
						html: `
							<div style="display:flex;align-items:center;height:64px;">
								<span>Left</span>
								<div class="separator-wrapper full-height padding-right-base padding-left-base">
									<div class="separator separator-vertical"></div>
								</div>
								<span>Right</span>
							</div>`,
					},
				],
				{ direction: 'row', gap: 48 }
			).outerHTML
		),
};

/** Every Color swatch on the rule (empty = the SCSS neutral default). */
export const Colors: Story = {
	tags: ['docs-example'],
	name: 'Colors',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: 'Every <code>Color</code> record as a <code>background-*</code> class on the rule; the first cell has no class and shows the SCSS neutral border default.',
			},
		},
	},
	render: () =>
		renderStatic(
			labeledBoard(
				['', ...SWATCH_COLORS].map((color) => ({
					label: color || 'default',
					html: horizontalCell('s', color),
				})),
				{ direction: 'row', wrap: true }
			).outerHTML
		),
};

/** The Space scale: padding around the rule from none to xxl, side by side to avoid scrolling. */
export const Spaces: Story = {
	tags: ['docs-example'],
	name: 'Spaces',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: '<code>Space</code> from None to XXLarge as <code>padding-top-*</code> / <code>padding-bottom-*</code> on the wrapper around a horizontal rule.',
			},
		},
	},
	render: () =>
		renderStatic(
			labeledBoard(
				SPACE_OPTIONS.map((space) => ({ label: space, html: horizontalCell(space, '') })),
				{ direction: 'row', gap: 24, wrap: true }
			).outerHTML
		),
};
