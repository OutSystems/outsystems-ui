import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { backgroundClass, cls, COLOR_OPTIONS, extendedClassArgType } from './_helpers/lowcode';
import { colorBoard, labeledBoard } from './_helpers/showcase';

/**
 * IconBadge — low-code input parameters from the library OML wired as Storybook controls.
 * Class mappings come from src/scss/04-patterns/05-numbers/_icon-badge.scss and _badge.scss.
 *
 *   Number   → text content of the inner badge span
 *   Color    → background-{value} on the inner .badge (or background-{value}-lightest when IsLight=true)
 *   IsLight  → appends -lightest to the background class (`transparent` has no variant)
 */
const meta: Meta = { title: 'Patterns/Numbers/IconBadge' };
export default meta;

type IconBadgeArgs = {
	number: number;
	color: string;
	isLight: boolean;
	extendedClass: string;
};

function iconBadgeMarkup({ number, color, isLight, extendedClass }: IconBadgeArgs): string {
	const bgClass = backgroundClass(color, isLight);
	return `
		<div class="${cls('icon-badge', extendedClass)}">
			<div><i class="icon ph ph-bell" style="font-size: 2em;"></i></div>
			<div class="${cls('badge', 'border-radius-rounded', bgClass, 'OSInline')}"><span class="OSFillParent">${number}</span></div>
		</div>`;
}

const baseArgs: IconBadgeArgs = { number: 3, color: 'primary', isLight: false, extendedClass: '' };

export const Playground: StoryObj<IconBadgeArgs> = {
	args: { ...baseArgs },
	argTypes: {
		number: {
			name: 'Number',
			control: { type: 'number', min: 0, step: 1 },
			description: 'Number to be displayed.',
		},
		color: {
			name: 'Color',
			control: 'select',
			options: COLOR_OPTIONS,
			description: 'Background color of the Badge.',
		},
		isLight: {
			name: 'IsLight',
			control: 'boolean',
			description: 'Use the lightest color version for the background and the darker color version for text.',
		},
		extendedClass: extendedClassArgType,
	},
	render: (args) => renderStatic(iconBadgeMarkup(args)),
};

// ─── Docs-page examples ──────────────────────────────────────────────────────

export const BasicUsage: StoryObj = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'A bell icon in the Icon placeholder with <code>Number</code> 3 on its top-right corner, in the Primary <code>Color</code>.',
			},
		},
	},
	render: () => renderStatic(iconBadgeMarkup({ ...baseArgs })),
};

export const Counts: StoryObj = {
	tags: ['docs-example'],
	name: 'Counts',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'The badge keeps a 16px minimum and grows with the <code>Number</code>; the ring (<code>--osui-icon-badge-ring-color</code>) separates it from the icon.',
			},
		},
	},
	render: () =>
		renderStatic(
			labeledBoard(
				[7, 42, 128].map((number) => ({
					label: String(number),
					html: iconBadgeMarkup({ ...baseArgs, number }),
				})),
				{ direction: 'row', gap: 32 }
			).outerHTML
		),
};

export const LightStyle: StoryObj = {
	tags: ['docs-example'],
	name: 'Light style',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '<code>IsLight</code> True on three <code>Color</code> families — the badge takes the subtle tint and the darker text of the same colour.',
			},
		},
	},
	render: () =>
		renderStatic(
			labeledBoard(
				['primary', 'green', 'red'].map((color) => ({
					label: color,
					html: iconBadgeMarkup({ ...baseArgs, color, isLight: true }),
				})),
				{ direction: 'row', gap: 32 }
			).outerHTML
		),
};

/** Every Color swatch on the inner badge, solid and IsLight. */
export const Colors: StoryObj = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderStatic(colorBoard((color, isLight) => iconBadgeMarkup({ ...baseArgs, color, isLight })).outerHTML),
};
