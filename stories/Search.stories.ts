import type { Meta, StoryObj } from '@storybook/html-vite';
import { createAndInit, osuiRoot, renderPattern, uid } from './_helpers/osui';

/** Search — a lightweight wrapper; its build() is a no-op stub, the markup is the search input itself. */
const meta: Meta = {
	title: 'Patterns/Interaction/Search',
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => {
		const id = uid('search');
		const template = `
			<div ${osuiRoot(id)} class="osui-search" style="max-width:280px;">
				<input class="form-control" type="search" placeholder="Search…" data-input />
			</div>`;
		return renderPattern(template, (_root, register) => createAndInit('SearchAPI', id, {}, register));
	},
};
