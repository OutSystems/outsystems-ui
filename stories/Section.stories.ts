import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType, usePaddingArgType } from './_helpers/lowcode';

/**
 * Section (Group) — shipped: `.section-group` > `.section` (role=region) > `.section-title.dividers` + `.section-content`.
 *
 * Controls mirror the low-code input parameters of the `Section` block:
 *   UsePadding   → when False adds `padding-none` to `.section-content` (suppresses its top padding)
 *   ExtendedClass → extra classes on `.section-group` root
 * Class mappings from src/scss/04-patterns/02-content/_section.scss.
 */
const meta: Meta = { title: 'Patterns/Content/Section' };
export default meta;

type SectionArgs = { usePadding: boolean; extendedClass: string };

export const Playground: StoryObj<SectionArgs> = {
	args: { usePadding: true, extendedClass: '' },
	argTypes: {
		usePadding: usePaddingArgType,
		extendedClass: extendedClassArgType,
	},
	render: ({ usePadding, extendedClass }) =>
		renderStatic(`
			<div class="${cls('section-group', extendedClass)}" style="max-width:480px;">
				<div class="section" role="region">
					<div class="section-title dividers">Account settings</div>
					<div class="${cls('section-content', !usePadding && 'padding-none')}">Grouped content sits under a section heading with a divider.</div>
				</div>
			</div>`),
};

// ─── Docs-page stories ────────────────────────────────────────────────────────

type Story = StoryObj;

const DEMO_WRAP = 'display:flex;justify-content:center;width:100%;';

export const BasicUsage: Story = {
	tags: ['docs-example'],
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
	tags: ['docs-example'],
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

// ─── Section Group ────────────────────────────────────────────────────────────

type SectionGroupArgs = { isSticky: boolean; extendedClass: string };

function groupSection(title: string, lines: number): string {
	const body = Array.from({ length: lines }, (_, i) => `<p>${title} content line ${i + 1}.</p>`).join('');
	return `
		<div class="section" role="region">
			<div class="section-title dividers">${title}</div>
			<div class="section-content">${body}</div>
		</div>`;
}

/**
 * Section Group — several Sections in one `.section-group`. With `is--sticky`
 * each `.section-title` sticks below `--section-top-position` while its
 * section scrolls (the var is set by the layout at runtime; the demo box pins
 * it to 0). Scroll inside the box to see the titles take over.
 */
export const Group: StoryObj<SectionGroupArgs> = {
	args: { isSticky: true, extendedClass: '' },
	argTypes: {
		isSticky: {
			name: 'IsSticky',
			control: 'boolean',
			description: 'Section titles stick while their section scrolls.',
		},
		extendedClass: extendedClassArgType,
	},
	render: ({ isSticky, extendedClass }) =>
		renderStatic(`
			<div style="max-width:480px; height:280px; --section-top-position: 0px; padding: 0 16px;">
				<div class="${cls('section-group', isSticky && 'is--sticky', extendedClass)}">
					${groupSection('Profile', 6)}
					${groupSection('Notifications', 6)}
					${groupSection('Privacy', 6)}
				</div>
			</div>`),
};
