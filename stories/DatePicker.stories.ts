import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

/**
 * DatePicker — provider pattern backed by Flatpickr.
 *
 * Runtime contract (Providers/OSUI/Datepicker/Flatpickr/AbstractFlatpickr.ts):
 *  • Root `.osui-datepicker` (located by `name=<id>`) containing an
 *    `input.form-control` — the provider reads it via
 *    `selfElement.querySelector('input.form-control')` and hands it to
 *    `window.flatpickr(input, opts)`.
 *  • API: `DatePickerAPI.Create(id, configs, mode, provider)` where
 *    mode ∈ {'single','range'} and provider === 'flatpickr'.
 *  • VENDOR: requires `window.flatpickr` (+ flatpickr.css) — loaded in
 *    `.storybook/preview-head.html`.
 */

interface DatePickerArgs {
	mode: 'single' | 'range';
	dateFormat: string;
	firstWeekDay: number;
	showTodayButton: boolean;
	showWeekNumbers: boolean;
}

const meta: Meta<DatePickerArgs> = {
	title: 'Patterns/Interaction/DatePicker',
	argTypes: {
		mode: { control: 'inline-radio', options: ['single', 'range'] },
		dateFormat: { control: 'text', name: 'DateFormat' },
		firstWeekDay: { control: { type: 'number', min: 0, max: 6 }, name: 'FirstWeekDay' },
		showTodayButton: { control: 'boolean', name: 'ShowTodayButton' },
		showWeekNumbers: { control: 'boolean', name: 'ShowWeekNumbers' },
	},
	args: {
		mode: 'single',
		dateFormat: 'YYYY-MM-DD',
		firstWeekDay: 1,
		showTodayButton: true,
		showWeekNumbers: false,
	},
};
export default meta;

type Story = StoryObj<DatePickerArgs>;

function renderDatePicker(args: DatePickerArgs): HTMLElement {
	const id = uid('datepicker');
	const range = args.mode === 'range';
	const template = `
		<div ${osuiRoot(id)} class="osui-datepicker" data-uniqueid="${id}" style="max-width: 280px;">
			<label for="${id}-input">${range ? 'Pick a date range' : 'Pick a date'}</label>
			<input id="${id}-input" class="form-control" type="text" placeholder="${range ? 'Select a date range' : 'Select a date'}" />
		</div>
		<!-- a11y keyboard-instructions container; the provider finds it via
		     TagSelector(selfElement.parentElement, '.osui-datepicker-a11y') -->
		<div class="osui-datepicker-a11y"></div>`;

	return renderPattern(template, (_root, register) => {
		const P = Patterns();
		P.DatePickerAPI.Create(
			id,
			cfg({
				DateFormat: args.dateFormat,
				FirstWeekDay: args.firstWeekDay,
				ShowTodayButton: args.showTodayButton,
				ShowWeekNumbers: args.showWeekNumbers,
				TimeFormat: 'disabled',
			}),
			args.mode,
			'flatpickr'
		);
		P.DatePickerAPI.Initialize(id);
		register(() => P.DatePickerAPI.Dispose?.(id));
	});
}

export const Default: Story = {
	render: renderDatePicker,
};

export const Range: Story = {
	args: { mode: 'range' },
	render: renderDatePicker,
};
