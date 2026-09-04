import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, COLOR_OPTIONS, extendedClassArgType } from './_helpers/lowcode';

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

const renderTimeline: NonNullable<StoryObj<TimelineItemArgs>['render']> = ({
	isActive,
	color,
	showIcon,
	extendedClass,
}) => {
	const item = (
		left: string,
		icon: string,
		title: string,
		desc: string,
		active: boolean,
		itemColor: string,
		extra: string
	) => `
		<div class="${cls('timeline-item', active && 'is-active', extra)}" role="listitem">
			<div class="timeline-left OSInline">${left}</div>
			<div class="timeline-icon OSInline">
				<div class="timeline-icon-line OSInline"></div>
				<div class="${cls('timeline-icon-container', itemColor && `background-${itemColor}`, 'OSInline')}">${showIcon ? `<i class="icon ph ${icon}"></i>` : ''}</div>
			</div>
			<div class="timeline-content"><div>${title}</div><div class="timeline-content-inner">${desc}</div></div>
		</div>`;

	return renderStatic(`
		<div class="timeline" role="list" style="max-width:480px;">
			${item('2019', 'ph-archive', 'Pending approval', 'This request requires your approval.', false, 'primary', '')}
			${item('2020', 'ph-check', 'Approved', 'The request was approved by the manager.', isActive, color, extendedClass)}
			${item('2021', 'ph-flag', 'Closed', 'The request lifecycle is complete.', false, 'primary', '')}
		</div>`);
};

export const Default: StoryObj<TimelineItemArgs> = {
	args: {
		isActive: false,
		color: 'primary',
		showIcon: true,
		extendedClass: '',
	},
	argTypes: timelineItemArgTypes,
	render: renderTimeline,
};

/**
 * Figma `Type=No icon`. The Icon placeholder is left unfilled, so
 * `.timeline-icon-container:empty` collapses the 24px circle to an 8px dot
 * (offset 10px from the top to optically centre it on the first text line).
 * The `Color` control still paints the dot via `background-{value}`.
 */
export const NoIcon: StoryObj<TimelineItemArgs> = {
	...Default,
	args: { ...Default.args, showIcon: false },
};
