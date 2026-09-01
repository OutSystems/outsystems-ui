import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from './_helpers/lowcode';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

/**
 * MonthPicker — Flatpickr provider. `Create(id, configs, 'flatpickr')`.
 * Needs an `input.form-control` and a sibling `.osui-monthpicker-a11y`.
 * Requires `window.flatpickr`.
 */
interface MonthPickerArgs {
	dateFormat: string;
	extendedClass: string;
}

const meta: Meta<MonthPickerArgs> = {
	title: 'Patterns/Interaction/MonthPicker',
	argTypes: { dateFormat: { control: 'text', name: 'DateFormat' }, extendedClass: extendedClassArgType },
	args: { dateFormat: 'MM/YYYY', extendedClass: '' },
};
export default meta;

type Story = StoryObj<MonthPickerArgs>;

export const Default: Story = {
	render: (args) => {
		const id = uid('monthpicker');
		const template = `
			<div ${osuiRoot(id)} class="osui-monthpicker" style="max-width:280px;">
				<label for="${id}-input">Pick a month</label>
				<input id="${id}-input" class="form-control" type="text" placeholder="Select a month" />
			</div>
			<div class="osui-monthpicker-a11y"></div>`;
		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			P.MonthPickerAPI.Create(
				id,
				cfg({
					DateFormat: args.dateFormat,
					// MonthYear objects use { Month, Year }; empty Month / Year < 1900 means "unset"
					InitialMonth: { Month: '', Year: -1 },
					MaxMonth: { Month: '', Year: -1 },
					MinMonth: { Month: '', Year: -1 },
					ExtendedClass: args.extendedClass,
				}),
				'flatpickr'
			);
			P.MonthPickerAPI.Initialize(id);
			register(() => P.MonthPickerAPI.Dispose?.(id));
		});
	},
};
