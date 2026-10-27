import type { Meta, StoryObj } from '@storybook/html-vite';
import { createAndInit, osuiRoot, Patterns, renderPattern, uid, type Register } from './_helpers/osui';
import { labeledBoard, type BoardOptions } from './_helpers/showcase';

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
 * Sample menu content — mirrors what the platform renders in the `Menu` placeholder
 * (a section title, four icon + label links, and a Separator block before the last
 * one), wrapped in a `nav.display-flex.flex-direction-column`. That wrapper is
 * load-bearing in the classic theme: its CSS has no `.osui-overflow-menu__balloon
 * a { display: block }`, so without the flex column the anchors flow inline. Each
 * link holds the icon and a `.margin-left-s` span directly, as the platform emits.
 */
const ITEMS: Array<[label: string, icon: string]> = [
	['Item 1', 'ph-eye'],
	['Item 2', 'ph-file-text'],
	['Item 3', 'ph-pencil-simple'],
	['Item 4', 'ph-user'],
];

function itemMarkup(label: string, icon: string): string {
	return `
					<a role="menuitem" href="#${label.toLowerCase().replace(/\s+/g, '-')}">
						<i class="icon ph ${icon}" aria-hidden="true" style="width: 16px;"></i><span class="margin-left-s">${label}</span>
					</a>`;
}

const meta: Meta<OverflowMenuArgs> = {
	title: 'Patterns/Navigation/OverflowMenu',
	argTypes: {
		position: {
			control: 'select',
			options: ['auto', 'bottom', 'bottom-start', 'bottom-end', 'top'],
			name: 'BalloonPosition',
			description: 'Preferred placement of the menu relative to its trigger; auto picks the best fit.',
		},
		shape: {
			// `GlobalEnum.ShapeTypes` maps the low-code names onto CSS-ish VALUES:
			// SoftRounded → 'soft', Rounded → 'rounded', Sharp → 'none'. The API validates
			// against those values, and `validateInRange` silently falls back to the default
			// on a miss — so passing the enum KEY names makes every option resolve to 'soft'
			// and the control look broken. `labels` keeps the low-code names on screen.
			control: { type: 'inline-radio', labels: { soft: 'SoftRounded', rounded: 'Rounded', none: 'Sharp' } },
			options: ['soft', 'rounded', 'none'],
			name: 'BalloonShape',
			description: 'Corner shape of the menu: SoftRounded (default), Rounded or Sharp.',
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
	// The Separator block renders a padded container around the line; colour comes from
	// the `background-neutral-4` utility (present in both themes), as the platform emits.
	const items = ITEMS.map(([label, icon], i) =>
		i === ITEMS.length - 1
			? `
					<div class="padding-top-base padding-bottom-base">
						<div class="separator separator-horizontal background-neutral-4"></div>
					</div>${itemMarkup(label, icon)}`
			: itemMarkup(label, icon)
	).join('');
	return `
		<div ${osuiRoot(id)} class="osui-overflow-menu">
			<button class="osui-overflow-menu__trigger btn" type="button" aria-label="More actions"><i class="icon ph ${icon}"></i></button>
			<div class="osui-overflow-menu__balloon osui-balloon" id="${id}-balloon">
				<nav class="display-flex flex-direction-column">
					<span class="text-uppercase text-neutral-7 font-semi-bold padding-x-base padding-top-base font-size-xs margin-bottom-s" aria-hidden="true">
						Title
					</span>${items}
				</nav>
			</div>
		</div>`;
}

export const Playground: Story = {
	tags: ['docs-example'],
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
	boardOptions?: BoardOptions
) {
	const entries = variants.map((v) => ({ ...v, id: uid('overflow-menu') }));
	const board = labeledBoard(
		entries.map(({ label, id, cellStyle }) => ({
			label,
			html: `<div style="${
				cellStyle ?? 'width:260px;height:300px;display:flex;align-items:flex-start;justify-content:flex-start;'
			}">${overflowMenuMarkup(id, 'ph-dots-three-vertical')}</div>`,
		})),
		boardOptions ?? { direction: 'row', wrap: true }
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
