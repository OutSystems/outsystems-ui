import type { Meta, StoryObj } from '@storybook/html-vite';
import { createAndInit, osuiRoot, renderPattern, uid } from './_helpers/osui';

/**
 * OverflowMenu — the low-code block exposes a `Trigger` placeholder where an Icon
 * widget is dropped; that's what renders inside `.osui-overflow-menu__trigger`.
 * `_overflowmenu.scss` sets `.osui-overflow-menu__trigger * { pointer-events: none }`
 * so the icon never swallows the click that toggles the balloon.
 */
interface OverflowMenuArgs {
	position: string;
	shape: string;
	icon: string;
}

/**
 * Sample menu content — the low-code `Content` placeholder takes whatever the dev
 * drops in it (here: a section title, four icon + label links, and a Separator
 * before the last one). Icon and label are wrapped in a flex span rather than
 * classed on the `<a>` itself: `.osui-overflow-menu__balloon a { display: block }`
 * (specificity 0,1,1) outweighs the `.display-flex` utility (0,1,0).
 */
const ITEMS: Array<[label: string, icon: string]> = [
	['Item 1', 'ph-eye'],
	['Item 2', 'ph-file-text'],
	['Item 3', 'ph-pencil-simple'],
	['Item 4', 'ph-user'],
];

function itemMarkup(label: string, icon: string): string {
	return `
					<a href="#${label.toLowerCase().replace(/\s+/g, '-')}">
						<span class="display-flex align-items-center gap-s">
							<i class="icon ph ${icon}"></i>
							<span>${label}</span>
						</span>
					</a>`;
}

const meta: Meta<OverflowMenuArgs> = {
	title: 'Patterns/Navigation/OverflowMenu',
	argTypes: {
		position: {
			control: 'select',
			options: ['auto', 'bottom', 'bottom-start', 'bottom-end', 'top'],
			name: 'Position',
		},
		shape: {
			// `GlobalEnum.ShapeTypes` maps the low-code names onto CSS-ish VALUES:
			// SoftRounded → 'soft', Rounded → 'rounded', Sharp → 'none'. The API validates
			// against those values, and `validateInRange` silently falls back to the default
			// on a miss — so passing the enum KEY names makes every option resolve to 'soft'
			// and the control look broken. `labels` keeps the low-code names on screen.
			control: { type: 'inline-radio', labels: { soft: 'SoftRounded', rounded: 'Rounded', none: 'Sharp' } },
			options: ['soft', 'rounded', 'none'],
			name: 'Shape',
		},
		icon: {
			name: 'Trigger (Icon)',
			control: 'text',
			description: 'Phosphor icon class for the Icon widget in the Trigger placeholder.',
		},
	},
	args: { position: 'bottom-start', shape: 'soft', icon: 'ph-dots-three-vertical' },
};
export default meta;

type Story = StoryObj<OverflowMenuArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('overflow-menu');
		// Separator sits above the last item; its default color is --color-primary,
		// so the instance override dials it down to the subtle border role.
		const items = ITEMS.map(([label, icon], i) =>
			i === ITEMS.length - 1
				? `
					<div class="separator separator-horizontal" style="--osui-separator-color: var(--color-border-subtle);"></div>${itemMarkup(label, icon)}`
				: itemMarkup(label, icon)
		).join('');
		const template = `
			<div ${osuiRoot(id)} class="osui-overflow-menu">
				<button class="osui-overflow-menu__trigger btn" type="button" aria-label="More actions"><i class="icon ph ${args.icon}"></i></button>
				<div class="osui-overflow-menu__balloon osui-balloon" id="${id}-balloon">
					<div class="font-size-label font-semi-bold text-uppercase text-neutral-7 padding-x-base padding-top-base padding-bottom-xs">
						Title
					</div>${items}
				</div>
			</div>`;
		return renderPattern(template, (_root, register) =>
			createAndInit('OverflowMenuAPI', id, { Position: args.position, Shape: args.shape }, register)
		);
	},
};
