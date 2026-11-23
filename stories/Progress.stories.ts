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

/** The bar root; `content` goes into the Content placeholder below the track. */
function barMarkup(id: string, content = ''): string {
	return `
		<div ${osuiRoot(id)} class="osui-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width:360px;">
			<div class="osui-progress-bar__container">
				<div class="osui-progress-bar__value"></div>
			</div>
			<div class="osui-progress-bar__content" id="${id}-label">${content}</div>
		</div>`;
}

export const Playground: Story = {
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

// ─── Docs-page examples ──────────────────────────────────────────────────────

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Studio defaults — <code>Progress</code> 60, <code>Thickness</code> 12, Rounded <code>Shape</code> — with a label in the Content placeholder. The fill animates from 0 on load (<code>AnimateInitialProgress</code>).',
			},
		},
	},
	render: () => {
		const id = uid('progress-bar');
		return renderPattern(
			barMarkup(id, '<span class="font-size-label text-neutral-7">Storage used · 60% of 50 GB</span>'),
			(_root, register) =>
				initProgress(id, 'Bar', { progress: 60, thickness: 12, shape: 'rounded', animate: true }, register)
		);
	},
};

/** The same fill at thickness 1, 8 and 20, so only the track height changes. */
export const Thickness: Story = {
	tags: ['docs-example'],
	name: 'Thickness',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: '<code>Thickness</code> 1, 8 and 20 — the pixel height of the track, written to <code>--thickness</code>. The fill stays at 60%.',
			},
		},
	},
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
	tags: ['docs-example'],
	name: 'Shapes',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: '<code>OptionalConfigs.Shape</code> Sharp, SoftRounded and Rounded at Thickness 20 — the end caps follow the theme radius of the matching shape.',
			},
		},
	},
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

/** `ProgressColor` on three palette families; the trail keeps its default. */
const DOC_PROGRESS_COLORS = [
	{ label: 'Green', color: 'green' },
	{ label: 'Orange', color: 'orange' },
	{ label: 'Red', color: 'red' },
] as const;

export const ProgressColors: Story = {
	tags: ['docs-example'],
	name: 'Progress colors',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '<code>ProgressColor</code> Green, Orange and Red — any Color entity record resolves through its <code>--color-*</code> role; a <code>TextToIdentifier("#hex")</code> value is used as-is.',
			},
		},
	},
	render: () => {
		const cells = DOC_PROGRESS_COLORS.map((swatch) => ({ ...swatch, id: uid('progress-bar') }));
		const board = labeledBoard(cells.map((cell) => ({ label: cell.label, html: barMarkup(cell.id) })));
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const cell of cells) {
				initProgress(
					cell.id,
					'Bar',
					{ progress: 60, thickness: 8, shape: 'rounded', animate: false, progressColor: cell.color },
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
