import type { Meta, StoryObj } from '@storybook/html-vite';
import { createAndInit, osuiRoot, Patterns, renderPattern, uid, type Register } from './_helpers/osui';
import { labeledBoard } from './_helpers/showcase';

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

function overflowMenuMarkup(id: string, icon: string): string {
	// Separator sits above the last item. It has no CSS-API var (colour is a low-code
	// param), so an instance tweak goes straight on background-color.
	const items = ITEMS.map(([label, icon], i) =>
		i === ITEMS.length - 1
			? `
					<div class="separator separator-horizontal" style="background-color: var(--color-border-subtle);"></div>${itemMarkup(label, icon)}`
			: itemMarkup(label, icon)
	).join('');
	return `
		<div ${osuiRoot(id)} class="osui-overflow-menu">
			<button class="osui-overflow-menu__trigger btn" type="button" aria-label="More actions"><i class="icon ph ${icon}"></i></button>
			<div class="osui-overflow-menu__balloon osui-balloon" id="${id}-balloon">
				<div class="font-size-label font-semi-bold text-uppercase text-neutral-7 padding-x-base padding-top-base padding-bottom-xs">
					Title
				</div>${items}
			</div>
		</div>`;
}

export const Default: Story = {
	render: (args) => {
		const id = uid('overflow-menu');
		return renderPattern(overflowMenuMarkup(id, args.icon), (_root, register) =>
			createAndInit('OverflowMenuAPI', id, { Position: args.position, Shape: args.shape }, register)
		);
	},
};

/** One labeled cell per variant, each menu pinned open via `OverflowMenuAPI.Open`. */
function openMenusBoard(
	variants: Array<{ label: string; configs: { Position: string; Shape: string }; cellStyle?: string }>,
	boardOptions: { direction: 'row' | 'column'; gap?: number; wrap?: boolean } = { direction: 'row', wrap: true }
) {
	const entries = variants.map((v) => ({ ...v, id: uid('overflow-menu') }));
	const board = labeledBoard(
		entries.map(({ label, id, cellStyle }) => ({
			label,
			html: `<div style="${
				cellStyle ?? 'width:260px;height:300px;display:flex;align-items:flex-start;justify-content:flex-start;'
			}">${overflowMenuMarkup(id, 'ph-dots-three-vertical')}</div>`,
		})),
		boardOptions
	);
	const init = (_root: HTMLElement, register: Register) => {
		for (const { id, configs } of entries) {
			createAndInit('OverflowMenuAPI', id, configs, register);
			Patterns().OverflowMenuAPI.Open(id);
		}
	};
	return renderPattern(board.outerHTML, init);
}

/** The three Shape values (SoftRounded / Rounded / Sharp) with the balloon open. */
export const Shapes: Story = {
	parameters: { controls: { disable: true }, chromatic: { delay: 300 } },
	render: () =>
		openMenusBoard(
			['soft', 'rounded', 'none'].map((shape) => ({
				label: shape,
				configs: { Position: 'bottom-start', Shape: shape },
			}))
		),
};

/**
 * Every Position value with the balloon open. Cells are sized for the balloon
 * (~170x200) so neighbours never bleed into each other: wide enough for the
 * bottom-end leftward shift, tall enough for the full balloon below (or above —
 * the `top` cell bottom-aligns its trigger so the balloon opens upward in place).
 */
export const Positions: Story = {
	parameters: { controls: { disable: true }, chromatic: { delay: 300 } },
	render: () => {
		const cell = (align: 'flex-start' | 'flex-end') =>
			`width:330px;height:250px;display:flex;align-items:${align};justify-content:center;`;
		return openMenusBoard(
			['auto', 'bottom', 'bottom-start', 'bottom-end', 'top'].map((position) => ({
				label: position,
				configs: { Position: position, Shape: 'soft' },
				cellStyle: cell(position === 'top' ? 'flex-end' : 'flex-start'),
			})),
			{ direction: 'row', gap: 24, wrap: true }
		);
	},
};
