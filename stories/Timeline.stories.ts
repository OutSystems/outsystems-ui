import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, COLOR_OPTIONS, extendedClassArgType } from './_helpers/lowcode';
import { labeledBoard, SWATCH_COLORS } from './_helpers/showcase';

/**
 * Timeline family. Controls mirror the low-code input parameters of the
 * `TimelineItem` block (extracted from the library OML), wired into the shipped markup.
 *
 * Class mappings from src/scss/04-patterns/04-navigation/_timeline.scss:
 *   IsActive → `.is-active` on `.timeline-item`
 *              NOTE: no explicit `.timeline-item.is-active` rule exists in the compiled
 *              CSS — the class is a standard OUI state marker but the timeline SCSS
 *              does not define distinct active styling; the control is wired in case a
 *              theme or future update targets it.
 *   Color    → `background-{value}` on `.timeline-icon-container`
 *              (matches the pattern's color API: background utility classes on the icon circle)
 */
const meta: Meta = { title: 'Patterns/Navigation/Timeline' };
export default meta;

// ─── TimelineItem args ────────────────────────────────────────────────────────

type TimelineItemArgs = {
	isActive: boolean;
	color: string;
	showIcon: boolean;
	extendedClass: string;
};

const timelineItemArgTypes: StoryObj<TimelineItemArgs>['argTypes'] = {
	showIcon: {
		name: 'Icon',
		control: 'boolean',
		description:
			'Fills the Icon placeholder. When empty, `.timeline-icon-container:empty` collapses to the 8px dot (Figma `Type=No icon`).',
	},
	isActive: {
		name: 'IsActive',
		control: 'boolean',
		description: 'Set item as active in the timeline. Adds `.is-active` to `.timeline-item`.',
	},
	color: {
		name: 'Color',
		control: 'select',
		options: COLOR_OPTIONS,
		description: 'Color of the icon circle. Maps to `background-{value}` on `.timeline-icon-container`.',
	},
	extendedClass: extendedClassArgType,
};

interface TimelineItemOptions {
	left: string;
	icon: string;
	title: string;
	desc: string;
	active?: boolean;
	color?: string;
	extra?: string;
	showIcon?: boolean;
}

const timelineItem = ({
	left,
	icon,
	title,
	desc,
	active = false,
	color = 'primary',
	extra = '',
	showIcon = true,
}: TimelineItemOptions) => `
	<div class="${cls('timeline-item', active && 'is-active', extra)}" role="listitem">
		<div class="timeline-left OSInline">${left}</div>
		<div class="timeline-icon OSInline">
			<div class="timeline-icon-line OSInline"></div>
			<div class="${cls('timeline-icon-container', color && `background-${color}`, 'OSInline')}">${showIcon ? `<i class="icon ph ${icon}"></i>` : ''}</div>
		</div>
		<div class="timeline-content"><div>${title}</div><div class="timeline-content-inner">${desc}</div></div>
	</div>`;

const renderTimeline: NonNullable<StoryObj<TimelineItemArgs>['render']> = ({
	isActive,
	color,
	showIcon,
	extendedClass,
}) =>
	renderStatic(`
		<div class="timeline" role="list" style="max-width:480px;">
			${timelineItem({ left: '2019', icon: 'ph-archive', title: 'Pending approval', desc: 'This request requires your approval.', showIcon })}
			${timelineItem({ left: '2020', icon: 'ph-check', title: 'Approved', desc: 'The request was approved by the manager.', active: isActive, color, extra: extendedClass, showIcon })}
			${timelineItem({ left: '2021', icon: 'ph-flag', title: 'Closed', desc: 'The request lifecycle is complete.', showIcon })}
		</div>`);

export const Playground: StoryObj<TimelineItemArgs> = {
	args: {
		isActive: false,
		color: 'primary',
		showIcon: true,
		extendedClass: '',
	},
	argTypes: timelineItemArgTypes,
	render: renderTimeline,
};

// ─── Docs examples ───────────────────────────────────────────────────────────

/** Order-tracking history: one Timeline Item per event, newest last, the current step active. */
export const BasicUsage: StoryObj = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Timeline Items stacked inside a Container with role="list". Each item fills the Left (date), Icon, Title and Content placeholders; `Color` defaults to Primary and `IsActive` marks the current step.',
			},
		},
	},
	render: () =>
		renderStatic(`
			<div class="timeline" role="list" style="max-width:520px;">
				${timelineItem({ left: '12 Mar', icon: 'ph-shopping-cart', title: 'Order placed', desc: 'Order #10482 confirmed — 3 items, € 214,90.' })}
				${timelineItem({ left: '12 Mar', icon: 'ph-credit-card', title: 'Payment received', desc: 'Visa ending 4421 charged successfully.' })}
				${timelineItem({ left: '14 Mar', icon: 'ph-package', title: 'Shipped', desc: 'Handed to DHL Express. Tracking 4821 0093 17.' })}
				${timelineItem({ left: '16 Mar', icon: 'ph-truck', title: 'Out for delivery', desc: 'Expected today between 13:00 and 17:00.', active: true, color: 'green' })}
			</div>`),
};

/**
 * Figma `Type=No icon`. The Icon placeholder is left unfilled, so
 * `.timeline-icon-container:empty` collapses the 24px circle to an 8px dot
 * (offset 10px from the top to optically centre it on the first text line).
 * The `Color` control still paints the dot via `background-{value}`.
 */
export const NoIcon: StoryObj<TimelineItemArgs> = {
	tags: ['docs-example'],
	name: 'No icon',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Leave the Icon placeholder empty and the 24px circle collapses to an 8px dot; `Color` still paints it.',
			},
		},
	},
	args: { ...Playground.args, showIcon: false },
	argTypes: timelineItemArgTypes,
	render: renderTimeline,
};

/** Every Color swatch painted on the icon circle (`background-{value}` on `.timeline-icon-container`). */
export const Colors: StoryObj = {
	tags: ['docs-example'],
	name: 'Colors',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: 'Every `Color` entity value applied to the icon circle through the matching `background-{value}` utility class.',
			},
		},
	},
	render: () =>
		renderStatic(
			labeledBoard(
				SWATCH_COLORS.map((color) => ({
					label: color,
					html: `
						<div class="timeline" role="list" style="width:220px;">
							${timelineItem({ left: '2020', icon: 'ph-check', title: 'Approved', desc: `background-${color}`, color })}
						</div>`,
				})),
				{ direction: 'row', wrap: true }
			).outerHTML
		),
};
