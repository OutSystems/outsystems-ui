import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, COLOR_OPTIONS, extendedClassArgType, usePaddingArgType } from './_helpers/lowcode';

/**
 * Card family. Each story's controls mirror the low-code input parameters of the
 * matching OutSystemsUI block (extracted from the library OML), wired into the
 * shipped markup:
 *   Basic       → `Card`           (UsePadding, ExtendedClass)
 *   Sectioned   → `CardSectioned`  (UsePadding, IsVertical, ImagePadding, ExtendedClass)
 *   Background  → `CardBackground` (Color, MinHeight, ExtendedClass)
 *   Detail      → `CardItem`       (ExtendedClass)
 * Class mappings come from src/scss/04-patterns/02-content/_card*.scss.
 */
const meta: Meta = { title: 'Patterns/Content/Card' };
export default meta;

// Real sample photo (seeded → deterministic). Remote URL: needs network in the preview
// iframe; swap for a bundled asset under .storybook if you need offline / Chromatic stability.
const CARD_IMG = 'https://picsum.photos/seed/osui-card/640/360';

// ─── Card ──────────────────────────────────────────────────────────────────────
type CardArgs = { usePadding: boolean; extendedClass: string };
export const Basic: StoryObj<CardArgs> = {
	args: { usePadding: true, extendedClass: '' },
	argTypes: { usePadding: usePaddingArgType, extendedClass: extendedClassArgType },
	render: ({ usePadding, extendedClass }) =>
		renderStatic(
			`<div class="${cls('card', !usePadding && 'padding-none', extendedClass)}" style="max-width:320px;">A simple card surface with border, radius, shadow and padding.</div>`
		),
};

// ─── CardSectioned ───────────────────────────────────────────────────────────────
type SectionedArgs = { usePadding: boolean; isVertical: boolean; imagePadding: boolean; extendedClass: string };
export const Sectioned: StoryObj<SectionedArgs> = {
	args: { usePadding: true, isVertical: true, imagePadding: true, extendedClass: '' },
	argTypes: {
		usePadding: usePaddingArgType,
		isVertical: { name: 'IsVertical', control: 'boolean', description: 'Set the orientation.' },
		imagePadding: { name: 'ImagePadding', control: 'boolean', description: 'When true, image has 24px of padding.' },
		extendedClass: extendedClassArgType,
	},
	render: ({ usePadding, isVertical, imagePadding, extendedClass }) => {
		// Vertical → image is a full-width banner with a fixed height.
		// Horizontal → image is a fixed-width column that stretches to the card's full height.
		const cardStyle = `max-width:${isVertical ? 320 : 480}px;`;
		const imgStyle = isVertical
			? 'display:block;width:100%;height:160px;object-fit:cover;'
			: 'display:block;width:180px;height:100%;min-height:100%;object-fit:cover;';
		return renderStatic(`
			<div class="${cls('card', 'card-sectioned', isVertical ? 'flex-direction-column' : 'flex-direction-row', !usePadding && 'padding-none', extendedClass)}" style="${cardStyle}">
				<div class="${cls('card-image', !imagePadding && 'padding-none')}"><img src="${CARD_IMG}" alt="Personal plan" style="${imgStyle}" /></div>
				<div class="card-sectioned-top flex-direction-column">
					<div class="card-title">Hire our personal plan</div>
					<div class="card-content">Take control with a plan made for you — manage everything in one place.</div>
					<div class="card-bottom"><button class="btn btn-primary btn-small"><span>Learn more</span></button></div>
				</div>
			</div>`);
	},
};

// ─── CardBackground ──────────────────────────────────────────────────────────────
type BackgroundArgs = { color: string; minHeight: number; extendedClass: string };
export const Background: StoryObj<BackgroundArgs> = {
	args: { color: 'primary', minHeight: 200, extendedClass: '' },
	argTypes: {
		color: { name: 'Color', control: 'select', options: COLOR_OPTIONS, description: 'Background color of the Block.' },
		minHeight: { name: 'MinHeight', control: { type: 'number', min: 0, step: 10 }, description: 'Minimum height of the Card, in pixels.' },
		extendedClass: extendedClassArgType,
	},
	render: ({ color, minHeight, extendedClass }) =>
		renderStatic(`
			<div class="${cls('card-background', extendedClass)}" style="max-width:320px;min-height:${minHeight}px;">
				<div class="card-background-content"><div style="text-align:center;"><span class="heading2 text-neutral-0">Take control with a plan made for you</span></div></div>
				<div class="card-background-image"><div style="width:100%;height:100%;background:linear-gradient(135deg,#3b5bdb,#1098ad);"></div></div>
				<div class="${cls('card-background-color', color && `background-${color}`)}"></div>
			</div>`),
};

// ─── CardItem ────────────────────────────────────────────────────────────────────
type ItemArgs = { extendedClass: string };
export const Item: StoryObj<ItemArgs> = {
	args: { extendedClass: '' },
	argTypes: { extendedClass: extendedClassArgType },
	render: ({ extendedClass }) =>
		renderStatic(`
			<div class="${cls('card card-detail', extendedClass)}" style="max-width:360px;">
				<div class="card-detail-left"><div class="avatar avatar-small border-radius-rounded background-primary" role="img" aria-label="user initials, JD"><span class="OSFillParent">JD</span></div></div>
				<div class="card-detail-center">
					<div class="card-detail-title">Jane Doe</div>
					<div class="card-detail-text">Product designer</div>
				</div>
				<div class="card-detail-right"><div class="badge border-radius-rounded background-primary OSInline"><span class="OSFillParent">3</span></div></div>
			</div>`),
};
