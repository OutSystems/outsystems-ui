import type { Meta, StoryObj } from '@storybook/html-vite';
import { flipContentMarkup as flipContentMarkupDoc } from './_helpers/flip-content-markup';
import { createAndInit, osuiRoot, renderPattern, uid } from './_helpers/osui';
import { labeledBoard } from './_helpers/showcase';

interface FlipContentArgs {
	flipSelf: boolean;
	isFlipped: boolean;
}

const meta: Meta<FlipContentArgs> = {
	title: 'Patterns/Content/FlipContent',
	argTypes: {
		flipSelf: {
			control: 'boolean',
			name: 'FlipOnClick',
			description:
				'Flips the content when it is clicked; otherwise flipping happens only through the API. Runtime config: `FlipSelf`.',
		},
		isFlipped: {
			control: 'boolean',
			name: 'StartsFlipped',
			description: 'Starts with the back face visible. Runtime config: `IsFlipped`.',
		},
	},
	args: { flipSelf: true, isFlipped: false },
};
export default meta;

type Story = StoryObj<FlipContentArgs>;

function flipContentMarkup(id: string): string {
	const face = 'display:flex;align-items:center;justify-content:center;min-height:160px;border-radius:8px;';
	return `
		<div ${osuiRoot(id)} class="osui-flip-content" style="max-width:280px;">
			<div class="osui-flip-content__container">
				<div class="osui-flip-content__container__front" style="${face}background:var(--osui-bg-surface-hover,#eef);">Front — click to flip</div>
				<div class="osui-flip-content__container__back" style="${face}background:var(--osui-bg-surface-active,#dde);">Back side</div>
			</div>
		</div>`;
}

export const Playground: Story = {
	render: (args) => {
		const id = uid('flip');
		return renderPattern(flipContentMarkup(id), (_root, register) =>
			createAndInit('FlipContentAPI', id, { FlipSelf: args.flipSelf, IsFlipped: args.isFlipped }, register)
		);
	},
};

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: { layout: 'padded' },
	render: () => {
		const id = uid('flip');
		return renderPattern(flipContentMarkupDoc(osuiRoot(id)), (_root, register) =>
			createAndInit('FlipContentAPI', id, { FlipSelf: true, IsFlipped: false }, register)
		);
	},
};

export const StartsFlipped: Story = {
	tags: ['docs-example'],
	name: 'Starts flipped',
	parameters: { layout: 'padded' },
	render: () => {
		const id = uid('flip');
		return renderPattern(flipContentMarkupDoc(osuiRoot(id)), (_root, register) =>
			createAndInit('FlipContentAPI', id, { FlipSelf: true, IsFlipped: true }, register)
		);
	},
};

/** Front face next to the flipped (`IsFlipped: true`) back face. */
export const Faces: Story = {
	parameters: { controls: { disable: true }, chromatic: { delay: 600 } },
	render: () => {
		const entries = [
			{ label: 'front', isFlipped: false, id: uid('flip') },
			{ label: 'flipped (IsFlipped)', isFlipped: true, id: uid('flip') },
		];
		const board = labeledBoard(
			entries.map(({ label, id }) => ({
				label,
				html: `<div style="width:280px;">${flipContentMarkup(id)}</div>`,
			})),
			{ direction: 'row', wrap: true }
		);
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const { id, isFlipped } of entries) {
				createAndInit('FlipContentAPI', id, { FlipSelf: false, IsFlipped: isFlipped }, register);
			}
		});
	},
};
