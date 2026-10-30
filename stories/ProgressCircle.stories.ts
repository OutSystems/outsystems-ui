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
 * Progress Circle — `Create(id, 'Circle', configs)`.
 * Markup: an SVG with trail-path and progress-path circles inside
 * `.osui-progress-circle__container > .osui-inline-svg.svg-wrapper`.
 * `auto` size follows the parent; any other size is a CSS length on `--progress-circle-size`.
 */
const meta: Meta<ProgressArgs> = {
	title: 'Patterns/Numbers/Progress Circle',
	argTypes: progressArgTypes,
	args: { ...progressDefaultArgs },
};
export default meta;

type Story = StoryObj<ProgressArgs>;

/** The circle root; `content` goes into the Content placeholder centred over the ring. */
function circleMarkup(id: string, rootStyle = '', content = ''): string {
	return `
		<div ${osuiRoot(id)} class="osui-progress-circle" role="progressbar" aria-valuemin="0" aria-valuemax="100"${rootStyle ? ` style="${rootStyle}"` : ''}>
			<div class="osui-progress-circle__container">
				<div class="osui-inline-svg svg-wrapper">
					<svg>
						<defs></defs>
						<circle class="osui-progress-circle__container__trail-path"></circle>
						<circle class="osui-progress-circle__container__progress-path"></circle>
					</svg>
				</div>
			</div>
			<div class="osui-progress-circle__content" id="${id}-label">${content}</div>
		</div>`;
}

/** The circle in a fixed square box, so `auto` size has a parent to follow. */
function boxedCircle(id: string, box = '140px'): string {
	return `<div style="height:${box};width:${box};">${circleMarkup(id)}</div>`;
}

export const Playground: Story = {
	render: (args) => {
		const id = uid('progress-circle');
		return renderPattern(circleMarkup(id, 'width:140px;height:140px;'), (_root, register) =>
			initProgress(
				id,
				'Circle',
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
				story: '<code>Progress</code> 72 at <code>Size</code> 120px with the default <code>Thickness</code> 8 and a percentage in the Content placeholder, centred over the ring. The arc animates from 0 on load.',
			},
		},
	},
	render: () => {
		const id = uid('progress-circle');
		return renderPattern(
			circleMarkup(id, '', '<span class="font-size-h4 font-semi-bold">72%</span>'),
			(_root, register) =>
				initProgress(
					id,
					'Circle',
					{ progress: 72, thickness: 8, shape: 'rounded', animate: true, size: '120px' },
					register
				)
		);
	},
};

/**
 * Auto follows a 140px parent. Explicit sizes are CSS lengths on `--progress-circle-size`
 * and must not set an inline width, which would override that variable.
 */
export const Sizes: Story = {
	tags: ['docs-example'],
	name: 'Sizes',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: '<code>Size</code> "auto" fills its parent (a 140px box here); "80px" and "200px" are written to <code>--progress-circle-size</code> and ignore the parent.',
			},
		},
	},
	render: () => {
		const sizes = [
			{ label: 'Auto', size: 'auto', box: '140px' },
			{ label: '80px', size: '80px', box: '' },
			{ label: '200px', size: '200px', box: '' },
		] as const;
		const cells = sizes.map((size) => ({ ...size, id: uid('progress-circle') }));
		const board = labeledBoard(
			cells.map((cell) => ({
				label: cell.label,
				html: cell.box ? boxedCircle(cell.id, cell.box) : circleMarkup(cell.id),
			})),
			{ direction: 'row', gap: 32 }
		);
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const cell of cells) {
				initProgress(
					cell.id,
					'Circle',
					{ progress: 60, thickness: 8, shape: 'rounded', animate: false, size: cell.size },
					register
				);
			}
		});
	},
};

/** The same arc at thickness 1, 8 and 20, so only the stroke width changes. */
export const Thickness: Story = {
	tags: ['docs-example'],
	name: 'Thickness',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: '<code>Thickness</code> 1, 8 and 20 — the stroke width of both the trail and the progress path, in pixels.',
			},
		},
	},
	render: () => {
		const cells = PROGRESS_THICKNESSES.map((thickness) => ({ thickness, id: uid('progress-circle') }));
		const board = labeledBoard(
			cells.map((cell) => ({ label: String(cell.thickness), html: boxedCircle(cell.id) })),
			{ direction: 'row' }
		);
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const cell of cells) {
				initProgress(
					cell.id,
					'Circle',
					{ progress: 60, thickness: cell.thickness, shape: 'rounded', animate: false, size: 'auto' },
					register
				);
			}
		});
	},
};

/**
 * Sharp (`none`, butt caps), Soft and Rounded (round caps) at the same arc.
 * Anything other than Sharp is stored as `stroke-linecap: round`.
 */
export const Shapes: Story = {
	tags: ['docs-example'],
	name: 'Shapes',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: '<code>OptionalConfigs.Shape</code> Sharp gives square (butt) line caps; SoftRounded and Rounded both render round caps on the arc ends.',
			},
		},
	},
	render: () => {
		const cells = PROGRESS_SHAPES.map((shape) => ({ ...shape, id: uid('progress-circle') }));
		const board = labeledBoard(
			cells.map((cell) => ({ label: cell.label, html: boxedCircle(cell.id) })),
			{ direction: 'row' }
		);
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const cell of cells) {
				initProgress(
					cell.id,
					'Circle',
					{ progress: 60, thickness: 20, shape: cell.shape, animate: false, size: 'auto' },
					register
				);
			}
		});
	},
};

/**
 * Progress color keeps the stroke on each swatch and the trail on `neutral-2`.
 * Trail color uses the same swatches on the unfilled ring, with a primary stroke.
 */
export const Colors: Story = {
	parameters: { controls: { disable: true } },
	render: () => {
		const cells = COLOR_SECTIONS.flatMap((section) =>
			COLOR_SWATCHES.map((color) => ({ ...color, ...section, id: uid('progress-circle') }))
		);
		const board = sectionedBoard(
			COLOR_SECTIONS.map((section) => ({
				title: section.title,
				board: labeledBoard(
					cells
						.filter((cell) => cell.target === section.target)
						.map((cell) => ({ label: cell.label, html: boxedCircle(cell.id) })),
					{ direction: 'row', wrap: true }
				),
			}))
		);
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const cell of cells) {
				initProgress(
					cell.id,
					'Circle',
					{
						progress: 60,
						thickness: 8,
						shape: 'rounded',
						animate: false,
						size: 'auto',
						progressColor: cell.target === 'progress' ? cell.color : 'primary',
						trailColor: cell.target === 'trail' ? cell.color : 'neutral-2',
					},
					register
				);
			}
		});
	},
};
