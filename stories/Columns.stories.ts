import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';
import { labeledBoard } from './_helpers/showcase';

/**
 * Columns family. Each story's controls mirror the low-code input parameters of the
 * matching OutSystemsUI block (extracted from the library OML), wired into the
 * shipped markup:
 *   Columns2..6           → equal-width columns
 *   Columns Medium L/R    → `columns-medium-{left|right}`: 1/3 + 2/3 split (small side flex:1, wide side flex:2)
 *   Columns Small L/R     → `columns-small-{left|right}`: 1/4 + 3/4 split (small side flex:1, wide side flex:3)
 *
 * Shared params: GutterSize, TabletBehavior, PhoneBehavior, ExtendedClass.
 * Class mappings come from src/scss/04-patterns/01-adaptive/_columns.scss.
 *
 * GutterSize → gutter-{key}  (keys from $osui-space-token-vars):
 *   None→gutter-none  XSmall→gutter-xs  Small→gutter-s    Base→gutter-base
 *   Medium→gutter-m   Large→gutter-l    XLarge→gutter-xl  XXLarge→gutter-xxl
 *
 * TabletBehavior / PhoneBehavior → {device}-break-{key}:
 *   None→(no class)   BreakFirst→{device}-break-first   BreakLast→{device}-break-last
 *   BreakMiddle→{device}-break-middle   BreakAll→{device}-break-all
 */
const meta: Meta = { title: 'Patterns/Adaptive/Columns' };
export default meta;

// ─── Shared enum options ───────────────────────────────────────────────────────

const GUTTER_OPTIONS = ['none', 'xs', 's', 'base', 'm', 'l', 'xl', 'xxl'] as const;
type GutterOption = (typeof GUTTER_OPTIONS)[number];

const BEHAVIOR_OPTIONS = ['', 'first', 'last', 'middle', 'all'] as const;
type BehaviorOption = (typeof BEHAVIOR_OPTIONS)[number];

const gutterArgType = {
	name: 'GutterSize',
	control: 'select',
	options: GUTTER_OPTIONS,
	description: 'Size of the gutter (gap) between columns.',
} as const;

const tabletBehaviorArgType = {
	name: 'TabletBehavior',
	control: 'select',
	options: BEHAVIOR_OPTIONS,
	description:
		'How columns stack on tablet. None = keep all columns. BreakFirst/Last/Middle/All = specific items break to full width.',
} as const;

const phoneBehaviorArgType = {
	name: 'PhoneBehavior',
	control: 'select',
	options: BEHAVIOR_OPTIONS,
	description:
		'How columns stack on phone. None = keep all columns. BreakFirst/Last/Middle/All = specific items break to full width.',
} as const;

/** Resolve a behavior option to a break class, e.g. 'all' + 'tablet' → 'tablet-break-all'. */
function breakClass(device: 'tablet' | 'phone', option: BehaviorOption): string | false {
	return option !== '' && `${device}-break-${option}`;
}

// ─── Shared inner content helpers ─────────────────────────────────────────────

function colItem(label: string): string {
	return `<div class="columns-item"><div class="card" style="padding:16px;text-align:center;">${label}</div></div>`;
}

// ─── Board stories (one row per low-code Columns block) ───────────────────────

type ColumnsArgs = {
	gutterSize: GutterOption;
	tabletBehavior: BehaviorOption;
	phoneBehavior: BehaviorOption;
	extendedClass: string;
};

function columnsMarkup(variantClass: string, labels: string[], args: ColumnsArgs): string {
	const { gutterSize, tabletBehavior, phoneBehavior, extendedClass } = args;
	return `
		<div class="${cls('columns', variantClass, `gutter-${gutterSize}`, breakClass('tablet', tabletBehavior), breakClass('phone', phoneBehavior), extendedClass)}">
			${labels.map(colItem).join('')}
		</div>`;
}

/** One labeled full-width row per variant; the controls apply to every row. */
function columnsBoard(
	variants: ReadonlyArray<[variantClass: string, labels: string[]]>,
	args: ColumnsArgs
): HTMLElement {
	return renderStatic(
		labeledBoard(
			variants.map(([variantClass, labels]) => ({
				label: variantClass,
				html: `<div style="width:720px;max-width:100%;">${columnsMarkup(variantClass, labels, args)}</div>`,
			}))
		).outerHTML
	);
}

const equalCols = (n: number): string[] => Array.from({ length: n }, (_, i) => `Column ${i + 1}`);

/** The nine Columns blocks → their variant class and demo column labels. */
const BLOCKS = {
	Columns2: ['columns2', equalCols(2)],
	Columns3: ['columns3', equalCols(3)],
	Columns4: ['columns4', equalCols(4)],
	Columns5: ['columns5', equalCols(5)],
	Columns6: ['columns6', equalCols(6)],
	ColumnsMediumLeft: ['columns-medium-left', ['Medium column', 'Wide column']],
	ColumnsMediumRight: ['columns-medium-right', ['Wide column', 'Medium column']],
	ColumnsSmallLeft: ['columns-small-left', ['Small column', 'Wide column']],
	ColumnsSmallRight: ['columns-small-right', ['Wide column', 'Small column']],
} as const satisfies Record<string, readonly [variantClass: string, labels: readonly string[]]>;
type BlockName = keyof typeof BLOCKS;

const SHARED_ARG_CONFIG = {
	args: { gutterSize: 'base', tabletBehavior: 'all', phoneBehavior: 'all', extendedClass: '' },
	argTypes: {
		gutterSize: gutterArgType,
		tabletBehavior: tabletBehaviorArgType,
		phoneBehavior: phoneBehaviorArgType,
		extendedClass: extendedClassArgType,
	},
} satisfies Pick<StoryObj<ColumnsArgs>, 'args' | 'argTypes'>;

type PlaygroundArgs = ColumnsArgs & { block: BlockName };

/** One Columns block at a time, with every shared low-code parameter as a control. */
export const Playground: StoryObj<PlaygroundArgs> = {
	args: { block: 'Columns2', ...SHARED_ARG_CONFIG.args },
	argTypes: {
		block: {
			name: 'Block',
			control: 'select',
			options: Object.keys(BLOCKS),
			description: 'Story-only: which of the nine Columns blocks to render.',
		},
		...SHARED_ARG_CONFIG.argTypes,
	},
	render: ({ block, ...args }) => {
		const [variantClass, labels] = BLOCKS[block];
		return renderStatic(
			`<div style="width:720px;max-width:100%;">${columnsMarkup(variantClass, [...labels], args)}</div>`
		);
	},
};

/** Docs-page examples: one fixed block each, same controls as the playground. */
export const Columns2: StoryObj<PlaygroundArgs> = {
	tags: ['docs-example'],
	...Playground,
	name: 'Two columns',
	args: { ...Playground.args, block: 'Columns2' },
};

export const ColumnsMediumLeft: StoryObj<PlaygroundArgs> = {
	tags: ['docs-example'],
	...Playground,
	name: 'Medium left',
	args: { ...Playground.args, block: 'ColumnsMediumLeft' },
};

export const ColumnsSmallRight: StoryObj<PlaygroundArgs> = {
	tags: ['docs-example'],
	...Playground,
	name: 'Small right',
	args: { ...Playground.args, block: 'ColumnsSmallRight' },
};

/** Columns2 through Columns6, one per line. */
export const ColumnCounts: StoryObj<ColumnsArgs> = {
	...SHARED_ARG_CONFIG,
	render: (args) =>
		columnsBoard(
			[
				['columns2', equalCols(2)],
				['columns3', equalCols(3)],
				['columns4', equalCols(4)],
				['columns5', equalCols(5)],
				['columns6', equalCols(6)],
			],
			args
		),
};

/** The four asymmetric splits (medium = 1/3 + 2/3, small = 1/4 + 3/4), one per line. */
export const AsymmetricSplits: StoryObj<ColumnsArgs> = {
	...SHARED_ARG_CONFIG,
	render: (args) =>
		columnsBoard(
			[
				['columns-medium-left', ['Medium column', 'Wide column']],
				['columns-medium-right', ['Wide column', 'Medium column']],
				['columns-small-left', ['Small column', 'Wide column']],
				['columns-small-right', ['Wide column', 'Small column']],
			],
			args
		),
};
