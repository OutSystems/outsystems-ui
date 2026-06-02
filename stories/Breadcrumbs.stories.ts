import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/** Breadcrumbs — shipped: `nav.breadcrumbs > .breadcrumbs-content > .breadcrumbs-item > .title > a` + separator `i.icon.fa.fa-angle-right.fa-1x`. */
const meta: Meta = { title: 'Patterns/Navigation/Breadcrumbs' };
export default meta;
type Story = StoryObj;

const sep = `<div aria-hidden="true"><i class="icon fa fa-angle-right fa-1x"></i></div>`;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<nav aria-label="breadcrumb" class="breadcrumbs">
				<div class="breadcrumbs-content">
					<div class="breadcrumbs-item"><div class="title"><a href="#dashboard">Dashboard</a></div>${sep}</div>
					<div class="breadcrumbs-item"><div class="title"><a href="#list">List</a></div>${sep}</div>
					<div class="breadcrumbs-item"><div class="title"><span>Detail</span></div></div>
				</div>
			</nav>`),
};
