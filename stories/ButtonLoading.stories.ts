import type { Meta, StoryObj } from '@storybook/html-vite';
import { createAndInit, osuiRoot, renderPattern, uid } from './_helpers/osui';
import { labeledBoard } from './_helpers/showcase';

interface ButtonLoadingArgs {
	isLoading: boolean;
	showLoadingAndLabel: boolean;
}

const meta: Meta<ButtonLoadingArgs> = {
	title: 'Patterns/Utilities/ButtonLoading',
	argTypes: {
		isLoading: { control: 'boolean', name: 'IsLoading' },
		showLoadingAndLabel: { control: 'boolean', name: 'ShowLoadingAndLabel' },
	},
	args: { isLoading: true, showLoadingAndLabel: true },
};
export default meta;

type Story = StoryObj<ButtonLoadingArgs>;

function buttonLoadingMarkup(id: string): string {
	return `
		<div ${osuiRoot(id)} class="osui-btn-loading">
			<button class="btn btn-primary" type="button">
				<span class="osui-btn-loading__spinner-animation"></span>
				Save changes
			</button>
		</div>`;
}

export const Default: Story = {
	render: (args) => {
		const id = uid('btn-loading');
		return renderPattern(buttonLoadingMarkup(id), (_root, register) =>
			createAndInit(
				'ButtonLoadingAPI',
				id,
				{ IsLoading: args.isLoading, ShowLoadingAndLabel: args.showLoadingAndLabel },
				register
			)
		);
	},
};

/** Idle, spinner + label, and spinner-only (`ShowLoadingAndLabel: false`) side by side. */
export const States: Story = {
	parameters: { controls: { disable: true } },
	render: () => {
		const entries = [
			{ label: 'idle', configs: { IsLoading: false, ShowLoadingAndLabel: true } },
			{ label: 'loading + label', configs: { IsLoading: true, ShowLoadingAndLabel: true } },
			{ label: 'loading only', configs: { IsLoading: true, ShowLoadingAndLabel: false } },
		].map((v) => ({ ...v, id: uid('btn-loading') }));
		const board = labeledBoard(
			entries.map(({ label, id }) => ({ label, html: buttonLoadingMarkup(id) })),
			{ direction: 'row', wrap: true }
		);
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const { id, configs } of entries) {
				createAndInit('ButtonLoadingAPI', id, configs, register);
			}
		});
	},
};
