import type { Meta, StoryObj } from '@storybook/html-vite';
import { createAndInit, osuiRoot, renderPattern, uid } from './_helpers/osui';

interface ButtonLoadingArgs {
	isLoading: boolean;
	showLoadingAndLabel: boolean;
}

const meta: Meta<ButtonLoadingArgs> = {
	title: 'Patterns/Interaction/ButtonLoading',
	argTypes: {
		isLoading: { control: 'boolean', name: 'IsLoading' },
		showLoadingAndLabel: { control: 'boolean', name: 'ShowLoadingAndLabel' },
	},
	args: { isLoading: true, showLoadingAndLabel: true },
};
export default meta;

type Story = StoryObj<ButtonLoadingArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('btn-loading');
		const template = `
			<div ${osuiRoot(id)} class="osui-btn-loading">
				<button class="btn btn-primary" type="button">
					<span class="osui-btn-loading__spinner-animation"></span>
					Save changes
				</button>
			</div>`;
		return renderPattern(template, (_root, register) =>
			createAndInit(
				'ButtonLoadingAPI',
				id,
				{ IsLoading: args.isLoading, ShowLoadingAndLabel: args.showLoadingAndLabel },
				register
			)
		);
	},
};
