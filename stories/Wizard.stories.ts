import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from './_helpers/osui';

/** Wizard — shipped: `.wizard-wrapper.display-flex.flex-direction-row` (role=tablist) > `.wizard-wrapper-item.{state}.label-bottom` (role=tab) > `.wizard-item-icon-wrapper > .wizard-item-icon` + `.wizard-item-label`. States: past / active / (upcoming). */
const meta: Meta = { title: 'Patterns/Navigation/Wizard' };
export default meta;
type Story = StoryObj;

const step = (state: string, n: string, label: string) => `
	<div class="wizard-wrapper-item ${state} label-bottom OSInline" role="tab" tabindex="0" aria-label="${label}">
		<div class="wizard-item-icon-wrapper OSInline"><div class="wizard-item-icon">${n}</div></div>
		<div class="wizard-item-label">${label}</div>
	</div>`;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div class="wizard-wrapper display-flex flex-direction-row OSInline" role="tablist" aria-orientation="horizontal">
				${step('past', '1', 'Account')}
				${step('active', '2', 'Profile')}
				${step('', '3', 'Confirm')}
			</div>`),
};
