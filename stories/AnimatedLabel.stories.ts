import type { Meta, StoryObj } from '@storybook/html-vite';
import { createAndInit, osuiRoot, renderPattern, uid } from './_helpers/osui';

const meta: Meta = {
	title: 'Patterns/Interaction/AnimatedLabel',
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => {
		const id = uid('animated-label');
		const inputId = `${id}-input`;
		const template = `
			<div ${osuiRoot(id)} class="animated-label" style="max-width:280px;">
				<div class="animated-label-text"><label for="${inputId}" data-label>Full name</label></div>
				<div class="animated-label-input"><input id="${inputId}" class="form-control" type="text" data-input /></div>
			</div>`;
		return renderPattern(template, (_root, register) => createAndInit('AnimatedLabelAPI', id, {}, register));
	},
};
