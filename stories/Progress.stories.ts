import type { Meta, StoryObj } from '@storybook/html-vite';
import { osuiRoot, renderPattern, uid } from './_helpers/osui';
import {
	COLOR_SECTIONS,
	COLOR_SWATCHES,
	initProgress,
	PROGRESS_SHAPES,
	PROGRESS_THICKNESSES,
	progressArgTypes,
	progressDefaultArgs,
	type ProgressArgs,
} from './_helpers/progress';
import { labeledBoard, sectionedBoard } from './_helpers/showcase';

/**
 * Progress Bar — `Create(id, 'Bar', configs)`.
 * Markup: `.osui-progress-bar__container > .osui-progress-bar__value`.
 * Thickness is the `--thickness` inline length, in pixels.
 */
const meta: Meta<ProgressArgs> = {
	title: 'Patterns/Numbers/Progress Bar',
	argTypes: progressArgTypes,
	args: { ...progressDefaultArgs },
};
export default meta;

type Story = StoryObj<ProgressArgs>;

function barMarkup(id: string): string {
	return `
		<div ${osuiRoot(id)} class="osui-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width:360px;">
			<div class="osui-progress-bar__container">
				<div class="osui-progress-bar__value"></div>
			</div>
			<div class="osui-progress-bar__content" id="${id}-label"></div>
		</div>`;
}

export const Default: Story = {
	render: (args) => {
		const id = uid('progress-bar');
		return renderPattern(barMarkup(id), (_root, register) =>
			initProgress(
				id,
				'Bar',
				{ progress: args.progress, thickness: args.thickness, shape: args.shape, animate: true },
				register
			)
		);
	},
};

/** The same fill at thickness 1, 8 and 20, so only the track height changes. */
export const Thickness: Story = {
	parameters: { controls: { disable: true } },
	render: () => {
		const cells = PROGRESS_THICKNESSES.map((thickness) => ({ thickness, id: uid('progress-bar') }));
		const board = labeledBoard(cells.map((cell) => ({ label: String(cell.thickness), html: barMarkup(cell.id) })));
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const cell of cells) {
				initProgress(
					cell.id,
					'Bar',
					{ progress: 60, thickness: cell.thickness, shape: 'rounded', animate: false },
					register
				);
			}
		});
	},
};

/**
 * Sharp (`none`, square ends), Soft and Rounded (pill) at the same fill.
 * Shape is read from `--border-radius-{shape}` and applied as `--shape`.
 */
export const Shapes: Story = {
	parameters: { controls: { disable: true } },
	render: () => {
		const cells = PROGRESS_SHAPES.map((shape) => ({ ...shape, id: uid('progress-bar') }));
		const board = labeledBoard(cells.map((cell) => ({ label: cell.label, html: barMarkup(cell.id) })));
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const cell of cells) {
				initProgress(
					cell.id,
					'Bar',
					{ progress: 60, thickness: 20, shape: cell.shape, animate: false },
					register
				);
			}
		});
	},
};

/**
 * Progress color keeps the fill on each swatch and the trail on `border-subtle`.
 * Trail color uses the same swatches on the unfilled track, with a primary fill.
 */
export const Colors: Story = {
	parameters: { controls: { disable: true } },
	render: () => {
		const cells = COLOR_SECTIONS.flatMap((section) =>
			COLOR_SWATCHES.map((color) => ({ ...color, ...section, id: uid('progress-bar') }))
		);
		const board = sectionedBoard(
			COLOR_SECTIONS.map((section) => ({
				title: section.title,
				board: labeledBoard(
					cells
						.filter((cell) => cell.target === section.target)
						.map((cell) => ({ label: cell.label, html: barMarkup(cell.id) }))
				),
			}))
		);
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const cell of cells) {
				initProgress(
					cell.id,
					'Bar',
					{
						progress: 60,
						thickness: 8,
						shape: 'rounded',
						animate: false,
						progressColor: cell.target === 'progress' ? cell.color : 'primary',
						trailColor: cell.target === 'trail' ? cell.color : 'border-subtle',
					},
					register
				);
			}
		});
	},
};
