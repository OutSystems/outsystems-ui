import type { Meta, StoryObj } from '@storybook/html-vite';
import { createAndInit, osuiRoot, renderPattern, uid } from './_helpers/osui';

/**
 * Rating — root class is `.rating` (NOT `.osui-rating`). It generates its radio
 * inputs + `.rating-item` labels dynamically from `RatingScale`, cloning the
 * children of `.icon-states` into each star. Those children must be the three
 * state templates `.rating-item-filled` / `.rating-item-half` / `.rating-item-empty`
 * (each an `<i class="icon fa fa-star…">`); the CSS shows the right one per value.
 */
interface RatingArgs {
	ratingValue: number;
	ratingScale: number;
	isEdit: boolean;
}

const ICON_STATES = `
	<div class="icon-states">
		<div class="rating-item-filled"><i class="icon fa fa-star fa-1x"></i></div>
		<div class="rating-item-half"><i class="icon fa fa-star-half-o fa-1x"></i></div>
		<div class="rating-item-empty"><i class="icon fa fa-star-o fa-1x"></i></div>
	</div>`;

const meta: Meta<RatingArgs> = {
	title: 'Patterns/Numbers/Rating',
	argTypes: {
		ratingValue: { control: { type: 'number', min: 0, max: 5, step: 0.5 }, name: 'RatingValue' },
		ratingScale: { control: { type: 'number', min: 1, max: 10 }, name: 'RatingScale' },
		isEdit: { control: 'boolean', name: 'IsEdit' },
	},
	args: { ratingValue: 3, ratingScale: 5, isEdit: true },
};
export default meta;

type Story = StoryObj<RatingArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('rating');
		const template = `
			<div ${osuiRoot(id)} class="rating">
				${ICON_STATES}
				<fieldset></fieldset>
			</div>`;
		return renderPattern(template, (_root, register) =>
			createAndInit('RatingAPI', id, { RatingValue: args.ratingValue, RatingScale: args.ratingScale, IsEdit: args.isEdit, Size: '' }, register)
		);
	},
};
