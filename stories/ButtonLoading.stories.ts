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
		isLoading: {
			control: 'boolean',
			name: 'IsLoading',
			description: 'If True, the button shows the loading spinner.',
		},
		showLoadingAndLabel: {
			control: 'boolean',
			name: 'ShowLabelOnLoading',
			description:
				'If True, the loading spinner displays beside the label. Runtime config: `ShowLoadingAndLabel`.',
		},
	},
	args: { isLoading: true, showLoadingAndLabel: true },
};
export default meta;

type Story = StoryObj<ButtonLoadingArgs>;

function buttonLoadingMarkup(id: string, label = 'Save changes'): string {
	return `
		<div ${osuiRoot(id)} class="osui-btn-loading">
			<button class="btn btn-primary" type="button">
				<span class="osui-btn-loading__spinner-animation"></span>
				${label}
			</button>
		</div>`;
}

export const Playground: Story = {
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

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'A primary button wrapped in Button Loading with <code>IsLoading</code> True and <code>ShowLabelOnLoading</code> True — the spinner appears beside the label and the button is disabled while loading.',
			},
		},
	},
	render: () => {
		const id = uid('btn-loading');
		return renderPattern(buttonLoadingMarkup(id), (_root, register) =>
			createAndInit('ButtonLoadingAPI', id, { IsLoading: true, ShowLoadingAndLabel: true }, register)
		);
	},
};

/** Idle, spinner + label, and spinner-only (`ShowLoadingAndLabel: false`) side by side. */
export const States: Story = {
	tags: ['docs-example'],
	name: 'Loading states',
	parameters: {
		layout: 'padded',
		controls: { disable: true },
		docs: {
			description: {
				story: 'The same button in its three states: idle (<code>IsLoading</code> False), loading with the label kept, and loading with the spinner only (<code>ShowLabelOnLoading</code> False).',
			},
		},
	},
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

export const SpinnerOnly: Story = {
	tags: ['docs-example'],
	name: 'Spinner only',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'With <code>ShowLabelOnLoading</code> False the label collapses while loading and only the spinner is shown, so the button keeps its footprint without the text.',
			},
		},
	},
	render: () => {
		const id = uid('btn-loading');
		return renderPattern(buttonLoadingMarkup(id, 'Submit order'), (_root, register) =>
			createAndInit('ButtonLoadingAPI', id, { IsLoading: true, ShowLoadingAndLabel: false }, register)
		);
	},
};
