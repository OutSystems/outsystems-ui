import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Blank Slate — shipped: `.blank-slate[.large]` > div > `.blank-slate-icon` + `.blank-slate-description` + `.blank-slate-actions`.
 *
 * Controls mirror the low-code input parameters of the `BlankSlate` block:
 *   FullHeight    → when True adds `.large` to root (sets height:100% and larger icon size)
 *   ExtendedClass → extra classes on the root
 * Class mappings from src/scss/04-patterns/02-content/_blank-slate.scss.
 */
const meta: Meta = { title: 'Patterns/Content/BlankSlate' };
export default meta;

type BlankSlateArgs = { fullHeight: boolean; extendedClass: string };

export const Default: StoryObj<BlankSlateArgs> = {
	args: { fullHeight: true, extendedClass: '' },
	argTypes: {
		fullHeight: {
			name: 'FullHeight',
			control: 'boolean',
			description:
				'When True, displays a larger BlankSlate taking full page height. Maps to `.large` on the root element.',
		},
		extendedClass: extendedClassArgType,
	},
	render: ({ fullHeight, extendedClass }) =>
		renderStatic(`
			<div class="${cls('blank-slate', fullHeight && 'large', extendedClass)}" style="max-width:420px;text-align:center;">
				<div>
					<div class="blank-slate-icon"><i class="icon fa fa-inbox fa-3x"></i></div>
					<div class="blank-slate-description">No records have been added yet.</div>
					<div class="blank-slate-actions"><button class="btn btn-primary"><span>Create item</span></button></div>
				</div>
			</div>`),
};
