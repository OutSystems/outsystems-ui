import type { Meta, StoryObj } from '@storybook/html-vite';
import { createAndInit, osuiRoot, renderPattern, uid } from './_helpers/osui';

/**
 * Rating — root class is `.rating` (NOT `.osui-rating`). It generates its radio
 * inputs + `.rating-item` labels dynamically from `RatingScale`, cloning the
 * children of `.icon-states` into each star. Those children must be the three
 * state templates `.rating-item-filled` / `.rating-item-half` / `.rating-item-empty`
 * (each an `<i class="icon ph ph-star…">`); the CSS shows the right one per value.
 */
interface RatingArgs {
	ratingValue: number;
	ratingScale: number;
	isEdit: boolean;
}

const ICON_STATES = `
	<div class="icon-states">
		<div class="rating-item-filled"><i class="icon ph-fill ph-star"></i></div>
		<div class="rating-item-half"><i class="icon ph ph-star-half"></i></div>
		<div class="rating-item-empty"><i class="icon ph ph-star"></i></div>
	</div>`;

const meta: Meta<RatingArgs> = {
	title: 'Patterns/Numbers/Rating',
	argTypes: {
		ratingValue: {
			control: { type: 'number', min: 0, max: 5, step: 0.5 },
			name: 'RatingValue',
			description: 'Current rating; a fractional part from 0.3 to 0.7 renders a half-filled item.',
		},
		ratingScale: {
			control: { type: 'number', min: 1, max: 10 },
			name: 'RatingScale',
			description: 'Number of rating items.',
		},
		isEdit: {
			control: 'boolean',
			name: 'IsEdit',
			description: 'Lets the user change the rating; when False it is read-only.',
		},
	},
	args: { ratingValue: 3, ratingScale: 5, isEdit: true },
};
export default meta;

type Story = StoryObj<RatingArgs>;

function ratingMarkup(id: string, pseudo = ''): string {
	const pseudoAttr = pseudo ? ` data-pseudo="${pseudo}"` : '';
	return `
		<div ${osuiRoot(id)} class="rating"${pseudoAttr}>
			${ICON_STATES}
			<fieldset></fieldset>
		</div>`;
}

export const Playground: Story = {
	tags: ['docs-example'],
	render: (args) => {
		const id = uid('rating');
		return renderPattern(ratingMarkup(id), (_root, register) =>
			createAndInit(
				'RatingAPI',
				id,
				{ RatingValue: args.ratingValue, RatingScale: args.ratingScale, IsEdit: args.isEdit, Size: '' },
				register
			)
		);
	},
};

/**
 * Default (no size class, 16px), Small (`.rating-small`, 12px) and Medium
 * (`.rating-medium`, 24px) at the same value, so the size difference is the only
 * thing that changes. An empty Size leaves the default; otherwise the class is
 * `rating-` plus `small` or `medium`.
 */
export const Sizes: Story = {
	parameters: { controls: { disable: true } },
	render: () => {
		const sizes = [
			{ label: 'Small', size: 'small' },
			{ label: 'Default', size: '' },
			{ label: 'Medium', size: 'medium' },
		] as const;
		const cells = sizes.map((size) => ({ ...size, id: uid('rating') }));
		const board = document.createElement('div');
		board.style.cssText = 'align-items:flex-start;display:flex;flex-wrap:wrap;gap:32px 64px;';
		for (const cell of cells) {
			const item = document.createElement('div');
			const label = document.createElement('div');
			label.textContent = cell.label;
			label.style.cssText =
				'color:var(--color-text-subtle);font-family:monospace;font-size:0.8125rem;margin-bottom:8px;';
			item.append(label);
			item.insertAdjacentHTML('beforeend', ratingMarkup(cell.id));
			board.append(item);
		}
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const cell of cells) {
				createAndInit(
					'RatingAPI',
					cell.id,
					{ RatingValue: 3, RatingScale: 5, IsEdit: false, Size: cell.size },
					register
				);
			}
		});
	},
};

/**
 * Resting value, then the same rating with the fourth star hovered.
 *
 * Hover is a preview: `.rating:hover` fills every star, then `input:hover` empties
 * the stars after the pointer. The gallery forces that on star 4 (value="4") with
 * the same opacity rules as `_rating.scss`, because a static canvas can't hold a
 * pointer. Both cells are editable so the hover styles are the interactive ones.
 */
export const States: Story = {
	parameters: {
		controls: { disable: true },
		pseudo: {
			hover: ['[data-pseudo="rating-hover"]', '[data-pseudo="rating-hover"] input[value="4"]'],
		},
	},
	render: () => {
		const cells = [
			{ label: 'Default', pseudo: '' },
			{ label: 'Hovered', pseudo: 'rating-hover' },
		] as const;
		const board = document.createElement('div');
		board.style.cssText = 'align-items:flex-start;display:flex;flex-wrap:wrap;gap:32px 64px;';
		const style = document.createElement('style');
		style.textContent = `
			[data-pseudo="rating-hover"].rating input + .rating-item .rating-item-filled {
				opacity: 1;
			}
			[data-pseudo="rating-hover"].rating input[value="4"] ~ .rating-item .rating-item-filled,
			[data-pseudo="rating-hover"].rating input[value="4"] ~ .rating-item .rating-item-half {
				opacity: 0;
			}
			[data-pseudo="rating-hover"].rating input[value="4"] ~ .rating-item .rating-item-empty {
				opacity: 1;
			}
			[data-pseudo="rating-hover"].rating input[value="4"] + .rating-item .rating-item-filled {
				opacity: 1;
			}`;
		board.append(style);
		const instances = cells.map((cell) => ({ ...cell, id: uid('rating') }));
		for (const cell of instances) {
			const item = document.createElement('div');
			const label = document.createElement('div');
			label.textContent = cell.label;
			label.style.cssText =
				'color:var(--color-text-subtle);font-family:monospace;font-size:0.8125rem;margin-bottom:8px;';
			item.append(label);
			item.insertAdjacentHTML('beforeend', ratingMarkup(cell.id, cell.pseudo));
			board.append(item);
		}
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const cell of instances) {
				createAndInit(
					'RatingAPI',
					cell.id,
					{ RatingValue: 3, RatingScale: 5, IsEdit: true, Size: '' },
					register
				);
			}
		});
	},
};
