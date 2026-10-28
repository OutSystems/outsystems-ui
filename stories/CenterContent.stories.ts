import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';
import { labeledBoard } from './_helpers/showcase';

/**
 * Center Content — CSS-only utility. Contract from
 * src/scss/04-patterns/06-utilities/_center-content.scss:
 *
 *   .center-content                full-height flex column
 *     .center-content-header       pinned top slot
 *     .center-content-container    flex: 1, centers its child both axes
 *     .center-content-bottom       pinned bottom slot
 *
 * Needs a sized parent — the demo box provides the height.
 */

interface CenterContentArgs {
	showHeader: boolean;
	showBottom: boolean;
	extendedClass: string;
}

const meta: Meta<CenterContentArgs> = {
	title: 'Patterns/Utilities/CenterContent',
	argTypes: {
		showHeader: {
			name: 'Header slot',
			control: 'boolean',
			description: 'Story-only: whether the Header placeholder has content.',
		},
		showBottom: {
			name: 'Bottom slot',
			control: 'boolean',
			description: 'Story-only: whether the Bottom placeholder has content.',
		},
		extendedClass: extendedClassArgType,
	},
	args: { showHeader: true, showBottom: true, extendedClass: '' },
};
export default meta;

type Story = StoryObj<CenterContentArgs>;

/** The sized demo box with the slots toggled on or off. */
function centerContentMarkup(showHeader: boolean, showBottom: boolean, extendedClass = ''): string {
	return `
		<div style="height: 320px; width: 420px; max-width: 100%; border: 1px dashed var(--color-border); border-radius: var(--border-radius-soft);">
			<div class="${cls('center-content', extendedClass)}">
				${showHeader ? '<div class="center-content-header" style="padding: 12px 16px; color: var(--color-text-subtle);">Header slot</div>' : ''}
				<div class="center-content-container">
					<div style="text-align: center;">
						<div class="card" style="display: inline-block; padding: 16px 24px;">Vertically + horizontally centered</div>
					</div>
				</div>
				${showBottom ? '<div class="center-content-bottom" style="padding: 12px 16px; color: var(--color-text-subtle);">Bottom slot</div>' : ''}
			</div>
		</div>`;
}

const EMPTY_STATE = `
	<div style="text-align: center; padding: 0 24px;">
		<i class="icon ph ph-tray" aria-hidden="true" style="font-size: 40px; color: var(--color-neutral-6);"></i>
		<h5 style="margin: 12px 0 4px;">Your inbox is empty</h5>
		<p style="margin: 0; color: var(--color-text-subtle);">New messages will show up here as soon as they arrive.</p>
	</div>`;

/** A Center Content block with the real slot classes; `height` is the dashed demo frame. */
function centerContentDemo(options: { top?: string; bottom?: string; center?: string; height?: number } = {}): string {
	const { top = '', bottom = '', center = EMPTY_STATE, height = 320 } = options;
	return `
		<div style="height: ${height}px; width: 420px; max-width: 100%; border: 1px dashed var(--color-border); border-radius: var(--border-radius-soft);">
			<div class="center-content">
				${top ? `<div class="center-content-header">${top}</div>` : ''}
				<div class="center-content-container">${center}</div>
				${bottom ? `<div class="center-content-bottom">${bottom}</div>` : ''}
			</div>
		</div>`;
}

export const Playground: Story = {
	render: ({ showHeader, showBottom, extendedClass }) =>
		renderStatic(centerContentMarkup(showHeader, showBottom, extendedClass)),
};

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Only the Center placeholder is filled: <code>.center-content-container</code> stretches to the parent height (the dashed frame) and centres the empty-state card on both axes.',
			},
		},
	},
	render: () => renderStatic(centerContentDemo()),
};

export const TopAndBottom: Story = {
	tags: ['docs-example'],
	name: 'Top and Bottom slots',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'The Top and Bottom placeholders pin content to the edges while the Center placeholder keeps the remaining space and stays centred in it.',
			},
		},
	},
	render: () =>
		renderStatic(
			centerContentDemo({
				top: '<div style="padding: 12px 16px; border-bottom: 1px solid var(--color-border); font-weight: 600;">Inbox</div>',
				bottom: '<div style="padding: 12px 16px; border-top: 1px solid var(--color-border); text-align: center;"><button class="btn btn-primary" type="button">Compose message</button></div>',
			})
		),
};

export const FixedHeight: Story = {
	tags: ['docs-example'],
	name: 'Fixed height',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: 'Set <code>Height</code> (in pixels) when there is no sized parent to fill — the block then sizes itself. 0 (the default) adjusts to the parent instead.',
			},
		},
	},
	render: () =>
		renderStatic(
			labeledBoard(
				[160, 280].map((height) => ({
					label: `Height = ${height}`,
					html: `
						<div style="width: 320px; max-width: 100%; border: 1px dashed var(--color-border); border-radius: var(--border-radius-soft);">
							<div class="center-content" style="height: ${height}px;">
								<div class="center-content-container">
									<div style="text-align: center;">
										<span class="tag background-primary">${height}px tall</span>
									</div>
								</div>
							</div>
						</div>`,
				})),
				{ direction: 'row', gap: 24, wrap: true }
			).outerHTML
		),
};

/** Every slot combination: both, header only, bottom only, neither. */
export const Slots: Story = {
	parameters: { controls: { disable: true } },
	render: () =>
		renderStatic(
			labeledBoard(
				[
					{ label: 'header + bottom', html: centerContentMarkup(true, true) },
					{ label: 'header only', html: centerContentMarkup(true, false) },
					{ label: 'bottom only', html: centerContentMarkup(false, true) },
					{ label: 'no slots', html: centerContentMarkup(false, false) },
				],
				{ direction: 'row', gap: 24, wrap: true }
			).outerHTML
		),
};
