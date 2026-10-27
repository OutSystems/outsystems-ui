import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType, usePaddingArgType } from './_helpers/lowcode';

const DEMO_WRAP = 'display:flex;justify-content:center;width:100%;';

function groupSection(title: string, lines: number): string {
	const body = Array.from({ length: lines }, (_, i) => `<p>${title} content line ${i + 1}.</p>`).join('');
	return `
		<div class="section" role="region">
			<div class="section-title dividers">${title}</div>
			<div class="section-content">${body}</div>
		</div>`;
}

const meta: Meta = {
	title: 'Patterns/Content/Section',
	tags: ['!ui-pending', 'ui-reviewed'],
	parameters: { docs: { source: { disable: true }, canvas: { sourceState: 'none' } } },
};
export default meta;

type Story = StoryObj;

export const BasicUsage: Story = {
	name: 'Basic usage',
	parameters: { layout: 'padded' },
	render: () =>
		renderStatic(
			`<div style="${DEMO_WRAP}"><div class="section-group" style="max-width:480px;width:100%;">
				<div class="section" role="region">
					<div class="section-title dividers">Account settings</div>
					<div class="section-content">Grouped content sits under a section heading with a divider.</div>
				</div>
			</div></div>`
		),
};

export const StickyGroup: Story = {
	name: 'Sticky group',
	parameters: { layout: 'padded' },
	render: () =>
		renderStatic(
			`<div style="${DEMO_WRAP}"><div style="max-width:480px;width:100%;height:280px;--section-top-position:0px;padding:0 16px;">
				<div class="section-group is--sticky">
					${groupSection('Profile', 6)}
					${groupSection('Notifications', 6)}
					${groupSection('Privacy', 6)}
				</div>
			</div></div>`
		),
};

type SectionArgs = { usePadding: boolean; extendedClass: string };

export const Default: StoryObj<SectionArgs> = {
	args: { usePadding: true, extendedClass: '' },
	argTypes: { usePadding: usePaddingArgType, extendedClass: extendedClassArgType },
	render: ({ usePadding, extendedClass }) =>
		renderStatic(
			`<div style="${DEMO_WRAP}"><div class="${cls('section-group', extendedClass)}" style="max-width:480px;width:100%;">
				<div class="section" role="region">
					<div class="section-title dividers">Account settings</div>
					<div class="${cls('section-content', !usePadding && 'padding-none')}">Grouped content sits under a section heading with a divider.</div>
				</div>
			</div></div>`
		),
};

export const Group: StoryObj<{ isSticky: boolean; extendedClass: string }> = {
	name: 'Group (playground)',
	args: { isSticky: true, extendedClass: '' },
	argTypes: {
		isSticky: { name: 'IsSticky', control: 'boolean' },
		extendedClass: extendedClassArgType,
	},
	render: ({ isSticky, extendedClass }) =>
		renderStatic(
			`<div style="${DEMO_WRAP}"><div style="max-width:480px;width:100%;height:280px;--section-top-position:0px;padding:0 16px;">
				<div class="${cls('section-group', isSticky && 'is--sticky', extendedClass)}">
					${groupSection('Profile', 6)}
					${groupSection('Notifications', 6)}
					${groupSection('Privacy', 6)}
				</div>
			</div></div>`
		),
};
