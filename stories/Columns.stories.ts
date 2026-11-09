import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

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

// ─── Story factory (one per low-code Columns block) ──────────────────────────

type ColumnsArgs = {
	gutterSize: GutterOption;
	tabletBehavior: BehaviorOption;
	phoneBehavior: BehaviorOption;
	extendedClass: string;
};

function columnsStory(
	variantClass: string,
	labels: string[],
	defaults: Partial<ColumnsArgs> = {}
): StoryObj<ColumnsArgs> {
	return {
		args: { gutterSize: 'base', tabletBehavior: 'all', phoneBehavior: 'all', extendedClass: '', ...defaults },
		argTypes: {
			gutterSize: gutterArgType,
			tabletBehavior: tabletBehaviorArgType,
			phoneBehavior: phoneBehaviorArgType,
			extendedClass: extendedClassArgType,
		},
		render: ({ gutterSize, tabletBehavior, phoneBehavior, extendedClass }) =>
			renderStatic(`
				<div class="${cls('columns', variantClass, `gutter-${gutterSize}`, breakClass('tablet', tabletBehavior), breakClass('phone', phoneBehavior), extendedClass)}">
					${labels.map(colItem).join('')}
				</div>`),
	};
}

const equalCols = (n: number): string[] => Array.from({ length: n }, (_, i) => `Column ${i + 1}`);

export const Columns2 = columnsStory('columns2', equalCols(2));
export const Columns3 = columnsStory('columns3', equalCols(3));
export const Columns4 = columnsStory('columns4', equalCols(4), { tabletBehavior: 'middle' });
export const Columns5 = columnsStory('columns5', equalCols(5), { tabletBehavior: 'middle' });
export const Columns6 = columnsStory('columns6', equalCols(6), { tabletBehavior: 'middle' });
export const ColumnsMediumLeft = columnsStory('columns-medium-left', ['Medium column', 'Wide column']);
export const ColumnsMediumRight = columnsStory('columns-medium-right', ['Wide column', 'Medium column']);
export const ColumnsSmallLeft = columnsStory('columns-small-left', ['Small column', 'Wide column']);
export const ColumnsSmallRight = columnsStory('columns-small-right', ['Wide column', 'Small column']);
