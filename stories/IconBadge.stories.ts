import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, COLOR_OPTIONS, extendedClassArgType } from './_helpers/lowcode';

/**
 * IconBadge — low-code input parameters from the library OML wired as Storybook controls.
 * Class mappings come from src/scss/04-patterns/05-numbers/_icon-badge.scss and _badge.scss.
 *
 *   Number   → text content of the inner badge span
 *   Color    → background-{value} on the inner .badge (or background-{value}-light(est) when IsLight=true)
 *   IsLight  → appends -lightest for palette colors; -light for semantic colors (success/warning/error/info)
 */
const meta: Meta = { title: 'Patterns/Numbers/IconBadge' };
export default meta;

const SEMANTIC_LIGHT_COLORS = new Set(['success', 'warning', 'error', 'info']);
function lightBgSuffix(color: string): string {
	return SEMANTIC_LIGHT_COLORS.has(color) ? '-light' : '-lightest';
}

type IconBadgeArgs = {
	number: number;
	color: string;
	isLight: boolean;
	extendedClass: string;
};

export const Default: StoryObj<IconBadgeArgs> = {
	args: {
		number: 3,
		color: 'primary',
		isLight: false,
		extendedClass: '',
	},
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
	render: ({ number, color, isLight, extendedClass }) => {
		const bgClass = color ? `background-${color}${isLight ? lightBgSuffix(color) : ''}` : '';
		return renderStatic(`
			<div class="${cls('icon-badge', extendedClass)}">
				<div><i class="icon fa fa-bell fa-2x"></i></div>
				<div class="${cls('badge', 'border-radius-rounded', bgClass, 'OSInline')}"><span class="OSFillParent">${number}</span></div>
			</div>`);
	},
};
