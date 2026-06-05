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

export const Default: StoryObj<SectionArgs> = {
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
