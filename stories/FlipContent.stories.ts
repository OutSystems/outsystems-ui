import type { Meta, StoryObj } from '@storybook/html-vite';
import { flipContentMarkup } from './_helpers/flip-content-markup';
import { createAndInit, osuiRoot, renderPattern, uid } from './_helpers/osui';

const meta: Meta = {
	title: 'Patterns/Content/FlipContent',
	tags: ['!ui-pending', 'ui-reviewed'],
	parameters: { docs: { source: { disable: true }, canvas: { sourceState: 'none' } } },
};
export default meta;

type Story = StoryObj;

export const BasicUsage: Story = {
	name: 'Basic usage',
	parameters: { layout: 'padded' },
	render: () => {
		const id = uid('flip');
		return renderPattern(flipContentMarkup(osuiRoot(id)), (_root, register) =>
			createAndInit('FlipContentAPI', id, { FlipSelf: true, IsFlipped: false }, register)
		);
	},
};

export const StartsFlipped: Story = {
	name: 'Starts flipped',
	parameters: { layout: 'padded' },
	render: () => {
		const id = uid('flip');
		return renderPattern(flipContentMarkup(osuiRoot(id)), (_root, register) =>
			createAndInit('FlipContentAPI', id, { FlipSelf: true, IsFlipped: true }, register)
		);
	},
};
