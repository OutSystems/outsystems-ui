import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Bottom Bar (+ Bottom Bar Item) — CSS-only mobile navigation bar. Contract
 * from src/scss/04-patterns/04-navigation/_bottom-bar-item.scss:
 *
 *   .bottom-bar-wrapper                    surface + top border (height: 100%)
 *     .bottom-bar > a[.active]             one anchor per item (flex: 1)
 *       .bottom-bar-item                   column layout
 *         .bottom-bar-item-icon            icon slot
 *         .bottom-bar-item-text            ellipsized label
 *
 * In the native layout the wrapper lives in a `.footer` sized by
 * `--size-bottom-bar`; the demo box reproduces that height.
 */

interface BottomBarArgs {
	activeIndex: number;
	extendedClass: string;
}

const ITEMS: Array<[label: string, icon: string]> = [
	['Home', 'ph-house'],
	['Search', 'ph-magnifying-glass'],
	['Alerts', 'ph-bell'],
	['Profile', 'ph-user'],
];

const meta: Meta<BottomBarArgs> = {
	title: 'Patterns/Navigation/BottomBar',
	argTypes: {
		activeIndex: {
			name: 'Active item',
			control: { type: 'number', min: 0, max: ITEMS.length - 1 },
			description: 'Which item carries the `.active` class.',
		},
		extendedClass: extendedClassArgType,
	},
	args: { activeIndex: 0, extendedClass: '' },
};
export default meta;

type Story = StoryObj<BottomBarArgs>;

export const Default: Story = {
	render: ({ activeIndex, extendedClass }) =>
		renderStatic(`
			<div style="max-width: 420px; height: var(--size-bottom-bar, 56px);">
				<div class="${cls('bottom-bar-wrapper', extendedClass)}">
					<div class="bottom-bar" style="height: 100%;">
						${ITEMS.map(
							([label, icon], i) => `
							<a href="#" class="${cls(i === activeIndex && 'active')}" style="text-align: center;" onclick="return false">
								<div class="bottom-bar-item">
									<div class="bottom-bar-item-icon"><i class="icon ph ${icon}"></i></div>
									<div class="bottom-bar-item-text">${label}</div>
								</div>
							</a>`
						).join('')}
					</div>
				</div>
			</div>`),
};
