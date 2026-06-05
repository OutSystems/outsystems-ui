import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Columns family. Each story's controls mirror the low-code input parameters of the
 * matching OutSystemsUI block (extracted from the library OML), wired into the
 * shipped markup:
 *   Columns2  → two equal-width columns
 *   Columns3  → three equal-width columns
 *   Columns4  → four equal-width columns
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

// ─── Columns2 ─────────────────────────────────────────────────────────────────

type Columns2Args = {
	gutterSize: GutterOption;
	tabletBehavior: BehaviorOption;
	phoneBehavior: BehaviorOption;
	extendedClass: string;
};

export const Columns2: StoryObj<Columns2Args> = {
	args: { gutterSize: 'base', tabletBehavior: 'all', phoneBehavior: 'all', extendedClass: '' },
	argTypes: {
		gutterSize: gutterArgType,
		tabletBehavior: tabletBehaviorArgType,
		phoneBehavior: phoneBehaviorArgType,
		extendedClass: extendedClassArgType,
	},
	render: ({ gutterSize, tabletBehavior, phoneBehavior, extendedClass }) =>
		renderStatic(`
			<div class="${cls('columns', 'columns2', `gutter-${gutterSize}`, breakClass('tablet', tabletBehavior), breakClass('phone', phoneBehavior), extendedClass)}">
				${colItem('Column 1')}
				${colItem('Column 2')}
			</div>`),
};

// ─── Columns3 ─────────────────────────────────────────────────────────────────

type Columns3Args = {
	gutterSize: GutterOption;
	tabletBehavior: BehaviorOption;
	phoneBehavior: BehaviorOption;
	extendedClass: string;
};

export const Columns3: StoryObj<Columns3Args> = {
	args: { gutterSize: 'base', tabletBehavior: 'all', phoneBehavior: 'all', extendedClass: '' },
	argTypes: {
		gutterSize: gutterArgType,
		tabletBehavior: tabletBehaviorArgType,
		phoneBehavior: phoneBehaviorArgType,
		extendedClass: extendedClassArgType,
	},
	render: ({ gutterSize, tabletBehavior, phoneBehavior, extendedClass }) =>
		renderStatic(`
			<div class="${cls('columns', 'columns3', `gutter-${gutterSize}`, breakClass('tablet', tabletBehavior), breakClass('phone', phoneBehavior), extendedClass)}">
				${colItem('Column 1')}
				${colItem('Column 2')}
				${colItem('Column 3')}
			</div>`),
};

// ─── Columns4 ─────────────────────────────────────────────────────────────────

type Columns4Args = {
	gutterSize: GutterOption;
	tabletBehavior: BehaviorOption;
	phoneBehavior: BehaviorOption;
	extendedClass: string;
};

export const Columns4: StoryObj<Columns4Args> = {
	args: { gutterSize: 'base', tabletBehavior: 'middle', phoneBehavior: 'all', extendedClass: '' },
	argTypes: {
		gutterSize: gutterArgType,
		tabletBehavior: tabletBehaviorArgType,
		phoneBehavior: phoneBehaviorArgType,
		extendedClass: extendedClassArgType,
	},
	render: ({ gutterSize, tabletBehavior, phoneBehavior, extendedClass }) =>
		renderStatic(`
			<div class="${cls('columns', 'columns4', `gutter-${gutterSize}`, breakClass('tablet', tabletBehavior), breakClass('phone', phoneBehavior), extendedClass)}">
				${colItem('Column 1')}
				${colItem('Column 2')}
				${colItem('Column 3')}
				${colItem('Column 4')}
			</div>`),
};
