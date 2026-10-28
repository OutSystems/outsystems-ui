import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';
import { labeledBoard } from './_helpers/showcase';

/**
 * Stacked Cards — Tinder-style swipeable card stack. The TS behavior was
 * removed from the library together with FloatingActions (v2.12.0, 09b65010c);
 * the swipe transforms are driven from low-code now. Shipped CSS contract
 * (src/scss/04-patterns/03-interaction/_stacked-cards.scss):
 *
 *   .stackedcards > .stackedcards-container        cards host; children are
 *                                                  absolutely stacked (first child relative)
 *   .stackedcards-overlay.{left|right|top}         swipe-direction feedback layers
 *   .stackedcards-origin-{bottom|top}              transform origin of the stack
 *
 * The runtime positions the back cards with JS transforms; the story applies
 * equivalent inline transforms as sample state so the stack is visible.
 */

interface StackedCardsArgs {
	overlay: 'none' | 'left' | 'right' | 'top';
	extendedClass: string;
}

// Static placeholders bundled under .storybook/assets (served via staticDirs at /assets/*):
// no network dependency in the preview iframe, deterministic for Chromatic.
const CARDS = [
	['Aurora Station', '/assets/placeholder-stack-1.svg'],
	['Basalt Cliffs', '/assets/placeholder-stack-2.svg'],
	['Cedar Valley', '/assets/placeholder-stack-3.svg'],
];

// Runtime-equivalent stack transforms (back cards peek out behind the front one):
// below it for StackedOptions = Bottom, above it for Top.
const STACK_TRANSFORMS = {
	bottom: ['', 'transform: translateY(12px) scale(0.96);', 'transform: translateY(24px) scale(0.92);'],
	top: ['', 'transform: translateY(-12px) scale(0.96);', 'transform: translateY(-24px) scale(0.92);'],
};
type StackOrigin = keyof typeof STACK_TRANSFORMS;

const meta: Meta<StackedCardsArgs> = {
	title: 'Patterns/Interaction/StackedCards',
	argTypes: {
		overlay: {
			name: 'Overlay preview',
			control: 'inline-radio',
			options: ['none', 'left', 'right', 'top'],
			description:
				'Shows one of the swipe-feedback overlays (left = reject/error, right = accept/success, top = info).',
		},
		extendedClass: extendedClassArgType,
	},
	args: { overlay: 'none', extendedClass: '' },
};
export default meta;

type Story = StoryObj<StackedCardsArgs>;

function stackedCardsMarkup({ overlay, extendedClass }: StackedCardsArgs, origin: StackOrigin = 'bottom'): string {
	const cards = CARDS.map(
		([title, img], i) => `
			<div style="${STACK_TRANSFORMS[origin][i]} z-index: ${CARDS.length - i};">
				<div class="card padding-none" style="overflow: hidden;">
					<img src="${img}" alt="${title}" style="width: 100%; display: block;" />
					<div style="padding: 12px 16px;">${title}</div>
					${
						overlay !== 'none' && i === 0
							? `<div class="stackedcards-overlay ${overlay}" style="opacity: 0.85;"><div>${
									overlay === 'right' ? 'Like' : overlay === 'left' ? 'Pass' : 'Info'
								}</div></div>`
							: ''
					}
				</div>
			</div>`
	).join('');
	return `
		<div class="${cls('stackedcards', `stackedcards-origin-${origin}`, extendedClass)}" style="max-width: 320px; padding-${origin}: 24px;">
			<div class="stackedcards-container">${cards}</div>
		</div>`;
}

export const Playground: Story = {
	render: (args) => renderStatic(stackedCardsMarkup(args)),
};

// ─── Docs-page examples ──────────────────────────────────────────────────────

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Block defaults — <code>StackedOptions</code> Bottom, <code>Rotate</code> True, <code>Items</code> 5, <code>ElementsMargin</code> 5. The front card is the active record; the next ones peek out below it.',
			},
		},
	},
	render: () => renderStatic(stackedCardsMarkup({ overlay: 'none', extendedClass: '' })),
};

export const StackOrigin: Story = {
	tags: ['docs-example'],
	name: 'Stack origin',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: '<code>StackedOptions</code> Bottom versus Top — the back cards peek out below or above the active card (<code>.stackedcards-origin-bottom</code> / <code>-top</code>). None hides them altogether.',
			},
		},
	},
	render: () =>
		renderStatic(
			labeledBoard(
				[
					{
						label: 'Bottom',
						html: `<div style="width: 280px;">${stackedCardsMarkup({ overlay: 'none', extendedClass: '' }, 'bottom')}</div>`,
					},
					{
						label: 'Top',
						html: `<div style="width: 280px;">${stackedCardsMarkup({ overlay: 'none', extendedClass: '' }, 'top')}</div>`,
					},
				],
				{ direction: 'row', wrap: true }
			).outerHTML
		),
};

/** The three swipe-feedback overlays: left = reject, right = accept, top = info. */
export const Overlays: Story = {
	tags: ['docs-example'],
	name: 'Swipe overlays',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: 'With <code>UseOverlays</code> True the OverlayLeft, OverlayRight and OverlayTop placeholders fade in over the active card as it is dragged: left = reject (error colour), right = accept (success), top = info.',
			},
		},
	},
	render: () =>
		renderStatic(
			labeledBoard(
				(['left', 'right', 'top'] as const).map((overlay) => ({
					label: overlay,
					html: `<div style="width: 280px;">${stackedCardsMarkup({ overlay, extendedClass: '' })}</div>`,
				})),
				{ direction: 'row', wrap: true }
			).outerHTML
		),
};
