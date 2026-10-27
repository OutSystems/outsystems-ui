import type { Meta, StoryObj } from '@storybook/html-vite';
import {
	articleSectionedCardMarkup,
	profileSectionedCardMarkup,
	propertySectionedCardMarkup,
} from './_helpers/card-markup';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType, usePaddingArgType } from './_helpers/lowcode';
import { labeledBoard } from './_helpers/showcase';

/**
 * Card Sectioned — image, title, content and footer slots. Controls mirror the
 * low-code input parameters of the `CardSectioned` block (UsePadding, IsVertical,
 * ImagePadding, ExtendedClass); class mappings from
 * src/scss/04-patterns/02-content/_card-sectioned.scss.
 *
 * Layout notes (confirmed against Figma + the live TaskSample_DEV_ROU12874/Cards sample,
 * and against ticket-owner decisions for this ticket's scope):
 *  • Vertical → image always renders last, after title/content/card-bottom; enforced by
 *    `.flex-direction-column .card-image { order: 1; }` in _card-sectioned.scss, so the
 *    DOM order here doesn't need to change.
 *  • Horizontal → image always renders first (Figma's "Last"/image-on-the-right variation
 *    is explicitly out of scope for this ticket — not exposed as a story control).
 *  • card-bottom is a real footer slot (confirmed, not superseded) — its content here is
 *    a text-link CTA ("Simulate Loan"), matching what's actually shown, not a button.
 *  • UsePadding=False removes all padding, including the image's, regardless of
 *    ImagePadding's own value — enforced by `.card-sectioned.padding-none` in the SCSS.
 */
const meta: Meta = { title: 'Patterns/Content/Card Sectioned' };
export default meta;

// Static placeholder bundled under .storybook/assets (served via staticDirs at /assets/*):
// no network dependency in the preview iframe, deterministic for Chromatic.
const CARD_IMG = '/assets/placeholder-card.svg';

type SectionedArgs = { usePadding: boolean; isVertical: boolean; imagePadding: boolean; extendedClass: string };

function sectionedCardMarkup({ usePadding, isVertical, imagePadding, extendedClass }: SectionedArgs): string {
	// Vertical → image is a full-width banner with a fixed height.
	// Horizontal → image is a fixed-width column that stretches to the card's full height.
	const cardStyle = `max-width:${isVertical ? 320 : 480}px;`;
	return `
		<div class="${cls('card', 'card-sectioned', isVertical ? 'flex-direction-column' : 'flex-direction-row', !usePadding && 'padding-none', extendedClass)}" style="${cardStyle}">
			<div class="${cls('card-image', !imagePadding && 'padding-none')}"><img src="${CARD_IMG}" alt="Personal plan" /></div>
			<div class="card-sectioned-top flex-direction-column">
				<div class="card-title">Hire our personal plan</div>
				<div class="card-content">Take control with a plan made for you — manage everything in one place.</div>
				<div class="card-bottom"><a href="#">Simulate Loan</a></div>
			</div>
		</div>`;
}

export const Playground: StoryObj<SectionedArgs> = {
	args: { usePadding: true, isVertical: true, imagePadding: true, extendedClass: '' },
	argTypes: {
		usePadding: usePaddingArgType,
		isVertical: { name: 'IsVertical', control: 'boolean', description: 'Set the orientation.' },
		imagePadding: {
			name: 'ImagePadding',
			control: 'boolean',
			description: 'When true, image has 24px of padding. Has no effect while UsePadding is false.',
		},
		extendedClass: extendedClassArgType,
	},
	render: (args) => renderStatic(sectionedCardMarkup(args)),
};

type Story = StoryObj;

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Property listing with UsePadding True and ImagePadding False — content uses the pattern padding, image stays full-bleed.',
			},
		},
	},
	render: () =>
		renderStatic(
			propertySectionedCardMarkup({
				usePadding: true,
				isVertical: true,
				imagePadding: false,
			})
		),
};

export const WithPadding: Story = {
	tags: ['docs-example'],
	name: 'With padding',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Profile card with UsePadding and ImagePadding True — inset photo, name, bio, stats, and an OS UI Secondary button.',
			},
		},
	},
	render: () => renderStatic(profileSectionedCardMarkup()),
};

export const Horizontal: Story = {
	tags: ['docs-example'],
	name: 'Horizontal',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Horizontal Card Sectioned with UsePadding True and ImagePadding False — full-bleed image beside title, separator, and author row.',
			},
		},
	},
	render: () => renderStatic(articleSectionedCardMarkup()),
};

/**
 * One card per low-code control, each flipped from the defaults: the baseline
 * (vertical, padded, padded image), `IsVertical: false`, `UsePadding: false`
 * (removes ALL padding, including the image's), and `ImagePadding: false`.
 * ExtendedClass has no visual of its own.
 */
export const Variants: StoryObj = {
	parameters: { controls: { disable: true } },
	render: () => {
		const defaults: SectionedArgs = { usePadding: true, isVertical: true, imagePadding: true, extendedClass: '' };
		const variants: Array<{ label: string; overrides: Partial<SectionedArgs> }> = [
			{ label: 'default (vertical)', overrides: {} },
			{ label: 'IsVertical: false', overrides: { isVertical: false } },
			{ label: 'UsePadding: false', overrides: { usePadding: false } },
			{ label: 'ImagePadding: false', overrides: { imagePadding: false } },
		];
		const board = labeledBoard(
			variants.map(({ label, overrides }) => ({
				label,
				html: sectionedCardMarkup({ ...defaults, ...overrides }),
			})),
			{ direction: 'row', gap: 24, wrap: true }
		);
		return renderStatic(board.outerHTML);
	},
};
