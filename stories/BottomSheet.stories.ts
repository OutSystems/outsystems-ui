import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from './_helpers/lowcode';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

interface BottomSheetArgs {
	showHandler: boolean;
	shape: string;
	extendedClass: string;
}

const meta: Meta<BottomSheetArgs> = {
	title: 'Patterns/Interaction/BottomSheet',
	tags: ['!ui-pending', 'ui-reviewed'],
	argTypes: {
		showHandler: { control: 'boolean', name: 'ShowHandler' },
		shape: { control: 'inline-radio', options: ['SoftRounded', 'Rounded', 'Sharp'], name: 'Shape' },
		extendedClass: extendedClassArgType,
	},
	args: { showHandler: true, shape: 'Rounded', extendedClass: '' },
};
export default meta;

type Story = StoryObj<BottomSheetArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('bottom-sheet');
		const template = `
			<div style="min-height:320px;">
				<button class="btn btn-primary" data-open type="button">Open bottom sheet</button>
				<div ${osuiRoot(id)} class="osui-bottom-sheet" aria-hidden="true" tabindex="-1">
					<div class="osui-bottom-sheet__header">
						<div class="osui-bottom-sheet__header__top-bar"><strong>Sheet title</strong></div>
					</div>
					<div class="osui-bottom-sheet__content" style="padding:16px;">
						<p>Bottom-sheet content slides up from the bottom edge.</p>
						<button class="btn" data-close type="button">Close</button>
					</div>
				</div>
			</div>`;
		return renderPattern(template, (root, register) => {
			const P = Patterns();
			P.BottomSheetAPI.Create(
				id,
				cfg({ ShowHandler: args.showHandler, Shape: args.shape, ExtendedClass: args.extendedClass })
			);
			P.BottomSheetAPI.Initialize(id);
			root.querySelector('[data-open]')?.addEventListener('click', () => P.BottomSheetAPI.Open(id));
			root.querySelector('[data-close]')?.addEventListener('click', () => P.BottomSheetAPI.Close(id));
			register(() => P.BottomSheetAPI.Dispose?.(id));
		});
	},
};
