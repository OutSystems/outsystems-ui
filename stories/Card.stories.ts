import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/** Card family — shipped markup mirrors the OUI website examples. */
const meta: Meta = { title: 'Patterns/Content/Card' };
export default meta;
type Story = StoryObj;

export const Basic: Story = {
	render: () => renderStatic(`<div class="card card-content" style="max-width:320px;">A simple card surface with border, radius, shadow and padding.</div>`),
};

export const Sectioned: Story = {
	render: () =>
		renderStatic(`
			<div class="card card-sectioned flex-direction-column" style="max-width:320px;">
				<div class="card-image"><div style="height:140px;background:linear-gradient(135deg,#3b5bdb,#1098ad);"></div></div>
				<div class="card-sectioned-top flex-direction-column">
					<div class="card-title">Hire our personal plan</div>
					<div class="card-content">Take control with a plan made for you — manage everything in one place.</div>
				</div>
				<div class="card-bottom"><button class="btn btn-primary btn-small"><span>Learn more</span></button></div>
			</div>`),
};

export const Background: Story = {
	render: () =>
		renderStatic(`
			<div class="card-background" style="max-width:320px;min-height:200px;">
				<div class="card-background-content"><div style="text-align:center;"><span class="heading2 text-neutral-0">Take control with a plan made for you</span></div></div>
				<div class="card-background-image"><div style="width:100%;height:100%;background:linear-gradient(135deg,#3b5bdb,#1098ad);"></div></div>
				<div class="card-background-color background-primary"></div>
			</div>`),
};

export const Detail: Story = {
	render: () =>
		renderStatic(`
			<div class="card-detail" style="max-width:360px;">
				<div class="card-detail-left"><div class="avatar avatar-small border-radius-rounded background-primary" role="img" aria-label="user initials, JD"><span class="OSFillParent">JD</span></div></div>
				<div class="card-detail-center">
					<div class="card-detail-title">Jane Doe</div>
					<div class="card-detail-text">Product designer</div>
				</div>
				<div class="card-detail-right"><div class="badge border-radius-rounded background-primary OSInline"><span class="OSFillParent">3</span></div></div>
			</div>`),
};
