import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from './_helpers/lowcode';
import { createAndInit, osuiRoot, renderPattern, uid } from './_helpers/osui';

/** Search — a lightweight wrapper; its build() is a no-op stub, the markup is the search input itself. */
type SearchArgs = { extendedClass: string };

const meta: Meta<SearchArgs> = {
	title: 'Patterns/Interaction/Search',
	args: { extendedClass: '' },
	argTypes: { extendedClass: extendedClassArgType },
};
export default meta;

type Story = StoryObj<SearchArgs>;

export const Default: Story = {
	render: ({ extendedClass }) => {
		const id = uid('search');
		const template = `
			<div ${osuiRoot(id)} class="osui-search" style="max-width:280px;">
				<input class="form-control" type="search" placeholder="Search…" data-input />
			</div>`;
		return renderPattern(template, (_root, register) =>
			createAndInit('SearchAPI', id, { ExtendedClass: extendedClass }, register)
		);
	},
};
