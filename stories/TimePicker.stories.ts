import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from './_helpers/lowcode';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

/**
 * TimePicker — Flatpickr provider. `Create(id, configs, 'flatpickr')`.
 * Needs an `input.form-control` (no a11y sibling required). Requires `window.flatpickr`.
 */
interface TimePickerArgs {
	is24Hours: boolean;
	timeFormat: string;
	extendedClass: string;
}

const meta: Meta<TimePickerArgs> = {
	title: 'Patterns/Interaction/TimePicker',
	argTypes: {
		is24Hours: { control: 'boolean', name: 'Is24Hours' },
		timeFormat: { control: 'text', name: 'TimeFormat' },
		extendedClass: extendedClassArgType,
	},
	args: { is24Hours: true, timeFormat: 'HH:mm', extendedClass: '' },
};
export default meta;

type Story = StoryObj<TimePickerArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('timepicker');
		const template = `
			<div ${osuiRoot(id)} class="osui-timepicker" style="max-width:280px;">
				<label for="${id}-input">Pick a time</label>
				<input id="${id}-input" class="form-control" type="text" placeholder="Select a time" />
			</div>`;
		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			P.TimePickerAPI.Create(
				id,
				cfg({ Is24Hours: args.is24Hours, TimeFormat: args.timeFormat, ExtendedClass: args.extendedClass }),
				'flatpickr'
			);
			P.TimePickerAPI.Initialize(id);
			register(() => P.TimePickerAPI.Dispose?.(id));
		});
	},
};
