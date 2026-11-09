import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { backgroundClass, cls, COLOR_OPTIONS, extendedClassArgType } from './_helpers/lowcode';

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
		const bgClass = backgroundClass(color, isLight);
		return renderStatic(`
			<div class="${cls('icon-badge', extendedClass)}">
				<div><i class="icon ph ph-bell" style="font-size: 2em;"></i></div>
				<div class="${cls('badge', 'border-radius-rounded', bgClass, 'OSInline')}"><span class="OSFillParent">${number}</span></div>
			</div>`);
	},
};
