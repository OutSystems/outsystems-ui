import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, createAndInit, osuiRoot, renderPattern, uid } from './_helpers/osui';

interface FlipContentArgs {
	flipSelf: boolean;
	isFlipped: boolean;
}

const meta: Meta<FlipContentArgs> = {
	title: 'Patterns/Content/FlipContent',
	argTypes: {
		flipSelf: { control: 'boolean', name: 'FlipSelf (click to flip)' },
		isFlipped: { control: 'boolean', name: 'IsFlipped' },
	},
	args: { flipSelf: true, isFlipped: false },
};
export default meta;

type Story = StoryObj<FlipContentArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('flip');
		const face = 'display:flex;align-items:center;justify-content:center;min-height:160px;border-radius:8px;';
		const template = `
			<div ${osuiRoot(id)} class="osui-flip-content" style="max-width:280px;">
				<div class="osui-flip-content__container">
					<div class="osui-flip-content__container__front" style="${face}background:var(--osui-bg-surface-hover,#eef);">Front — click to flip</div>
					<div class="osui-flip-content__container__back" style="${face}background:var(--osui-bg-surface-active,#dde);">Back side</div>
				</div>
			</div>`;
		return renderPattern(template, (_root, register) =>
			createAndInit('FlipContentAPI', id, { FlipSelf: args.flipSelf, IsFlipped: args.isFlipped }, register)
		);
	},
};
