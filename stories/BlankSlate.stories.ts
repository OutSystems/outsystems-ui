import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/** Blank Slate — shipped: `.blank-slate.large` > div > `.blank-slate-icon` + `.blank-slate-description` + `.blank-slate-actions`. */
const meta: Meta = { title: 'Patterns/Content/BlankSlate' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="blank-slate large" style="max-width:420px;text-align:center;">
				<div>
					<div class="blank-slate-icon"><i class="icon fa fa-inbox fa-3x"></i></div>
					<div class="blank-slate-description">No records have been added yet.</div>
					<div class="blank-slate-actions"><button class="btn btn-primary"><span>Create item</span></button></div>
				</div>
			</div>`),
};
