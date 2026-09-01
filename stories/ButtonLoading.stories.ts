import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from './_helpers/lowcode';
import { createAndInit, osuiRoot, renderPattern, uid } from './_helpers/osui';

interface ButtonLoadingArgs {
	isLoading: boolean;
	showLoadingAndLabel: boolean;
	extendedClass: string;
}

const meta: Meta<ButtonLoadingArgs> = {
	title: 'Patterns/Utilities/ButtonLoading',
	argTypes: {
		isLoading: { control: 'boolean', name: 'IsLoading' },
		showLoadingAndLabel: { control: 'boolean', name: 'ShowLoadingAndLabel' },
		extendedClass: extendedClassArgType,
	},
	args: { isLoading: true, showLoadingAndLabel: true, extendedClass: '' },
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
				{ IsLoading: args.isLoading, ShowLoadingAndLabel: args.showLoadingAndLabel, ExtendedClass: args.extendedClass },
				register
			)
		);
	},
};
