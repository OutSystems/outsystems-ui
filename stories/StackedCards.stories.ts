import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

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

const CARDS = [
	['Aurora Station', 'https://picsum.photos/seed/osui-stack1/480/280'],
	['Basalt Cliffs', 'https://picsum.photos/seed/osui-stack2/480/280'],
	['Cedar Valley', 'https://picsum.photos/seed/osui-stack3/480/280'],
];

// Runtime-equivalent stack transforms (back cards peek out behind the front one).
const STACK_TRANSFORMS = ['', 'transform: translateY(12px) scale(0.96);', 'transform: translateY(24px) scale(0.92);'];

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

export const Default: Story = {
	render: ({ overlay, extendedClass }) => {
		const cards = CARDS.map(
			([title, img], i) => `
				<div style="${STACK_TRANSFORMS[i]} z-index: ${CARDS.length - i};">
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
		return renderStatic(`
			<div class="${cls('stackedcards', 'stackedcards-origin-bottom', extendedClass)}" style="max-width: 320px; padding-bottom: 24px;">
				<div class="stackedcards-container">${cards}</div>
			</div>`);
	},
};
