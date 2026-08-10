import type { Meta, StoryObj } from '@storybook/html-vite';
import { createAndInit, osuiRoot, renderPattern, uid } from './_helpers/osui';

interface OverflowMenuArgs {
	position: string;
	shape: string;
}

const meta: Meta<OverflowMenuArgs> = {
	title: 'Patterns/Navigation/OverflowMenu',
	argTypes: {
		position: {
			control: 'select',
			options: ['auto', 'bottom', 'bottom-start', 'bottom-end', 'top'],
			name: 'Position',
		},
		shape: {
			// `GlobalEnum.ShapeTypes` maps the low-code names onto CSS-ish VALUES:
			// SoftRounded → 'soft', Rounded → 'rounded', Sharp → 'none'. The API validates
			// against those values, and `validateInRange` silently falls back to the default
			// on a miss — so passing the enum KEY names makes every option resolve to 'soft'
			// and the control look broken. `labels` keeps the low-code names on screen.
			control: { type: 'inline-radio', labels: { soft: 'SoftRounded', rounded: 'Rounded', none: 'Sharp' } },
			options: ['soft', 'rounded', 'none'],
			name: 'Shape',
		},
	},
	args: { position: 'bottom-start', shape: 'soft' },
};
export default meta;

type Story = StoryObj<OverflowMenuArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('overflow-menu');
		const template = `
			<div ${osuiRoot(id)} class="osui-overflow-menu">
				<button class="osui-overflow-menu__trigger btn" type="button" aria-label="More actions">⋯</button>
				<div class="osui-overflow-menu__balloon osui-balloon" id="${id}-balloon">
					<a href="#edit">Edit</a>
					<a href="#duplicate">Duplicate</a>
					<a href="#delete">Delete</a>
				</div>
			</div>`;
		return renderPattern(template, (_root, register) =>
			createAndInit('OverflowMenuAPI', id, { Position: args.position, Shape: args.shape }, register)
		);
	},
};
