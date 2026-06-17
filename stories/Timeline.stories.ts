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
	extendedClass: string;
};

export const Default: StoryObj<TimelineItemArgs> = {
	args: {
		isActive: false,
		color: 'primary',
		extendedClass: '',
	},
	argTypes: {
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
	},
	render: ({ isActive, color, extendedClass }) => {
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
					<div class="${cls('timeline-icon-container', itemColor && `background-${itemColor}`, 'OSInline')}"><i class="icon ph ph-check"></i></div>
				</div>
				<div class="timeline-content"><div>${title}</div><div class="timeline-content-inner">${desc}</div></div>
			</div>`;

		return renderStatic(`
			<div class="timeline" role="list" style="max-width:480px;">
				<div class="timeline-item" role="listitem">
					<div class="timeline-left OSInline">2019</div>
					<div class="timeline-icon OSInline">
						<div class="timeline-icon-line OSInline"></div>
						<div class="timeline-icon-container background-primary OSInline"><i class="icon ph ph-archive"></i></div>
					</div>
					<div class="timeline-content"><div>Pending approval</div><div class="timeline-content-inner">This request requires your approval.</div></div>
				</div>
				${item('2020', 'ph-check', 'Approved', 'The request was approved by the manager.', isActive, color, extendedClass)}
				<div class="timeline-item" role="listitem">
					<div class="timeline-left OSInline">2021</div>
					<div class="timeline-icon OSInline">
						<div class="timeline-icon-line OSInline"></div>
						<div class="timeline-icon-container background-primary OSInline"><i class="icon ph ph-flag"></i></div>
					</div>
					<div class="timeline-content"><div>Closed</div><div class="timeline-content-inner">The request lifecycle is complete.</div></div>
				</div>
			</div>`);
	},
};
