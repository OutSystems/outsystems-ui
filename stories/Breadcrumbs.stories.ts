import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';
import { cls, extendedClassArgType } from './_helpers/lowcode';

/**
 * Breadcrumbs — controls mirror the low-code input parameters of the `Breadcrumbs`
 * block in the OutSystemsUI library OML.
 *   ExtendedClass :: Text :: ""
 *
 * Class mappings come from src/scss/04-patterns/04-navigation/_breadcrumbs.scss.
 * Shipped: `nav.breadcrumbs > .breadcrumbs-content > .breadcrumbs-item > .title > a` +
 * separator `i.icon.fa.fa-angle-right.fa-1x`.
 */
const meta: Meta = { title: 'Patterns/Navigation/Breadcrumbs' };
export default meta;

type BreadcrumbsArgs = { extendedClass: string };

const sep = `<div aria-hidden="true"><i class="icon fa fa-angle-right fa-1x"></i></div>`;

export const Default: StoryObj<BreadcrumbsArgs> = {
	args: { extendedClass: '' },
	argTypes: { extendedClass: extendedClassArgType },
	render: ({ extendedClass }) =>
		renderStatic(`
			<nav aria-label="breadcrumb" class="${cls('breadcrumbs', extendedClass)}">
				<div class="breadcrumbs-content">
					<div class="breadcrumbs-item"><div class="title"><a href="#dashboard">Dashboard</a></div>${sep}</div>
					<div class="breadcrumbs-item"><div class="title"><a href="#list">List</a></div>${sep}</div>
					<div class="breadcrumbs-item"><div class="title"><span>Detail</span></div></div>
				</div>
			</nav>`),
};
