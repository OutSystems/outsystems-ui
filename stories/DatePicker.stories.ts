import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid, type Register } from './_helpers/osui';
import { labeledBoard } from './_helpers/showcase';

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
	timeFormat: 'disabled' | '12' | '24';
}

const meta: Meta<DatePickerArgs> = {
	title: 'Patterns/Interaction/DatePicker',
	argTypes: {
		mode: { control: 'inline-radio', options: ['single', 'range'] },
		dateFormat: { control: 'text', name: 'DateFormat' },
		firstWeekDay: { control: { type: 'number', min: 0, max: 6 }, name: 'FirstWeekDay' },
		showTodayButton: { control: 'boolean', name: 'ShowTodayButton' },
		showWeekNumbers: { control: 'boolean', name: 'ShowWeekNumbers' },
		timeFormat: {
			control: 'inline-radio',
			options: ['disabled', '12', '24'],
			name: 'TimeFormat',
		},
	},
	args: {
		mode: 'single',
		dateFormat: 'YYYY-MM-DD',
		firstWeekDay: 1,
		showTodayButton: true,
		showWeekNumbers: false,
		timeFormat: 'disabled',
	},
};
export default meta;

type Story = StoryObj<DatePickerArgs>;

function datePickerMarkup(id: string, range: boolean): string {
	return `
		<div ${osuiRoot(id)} class="osui-datepicker" data-uniqueid="${id}" style="max-width: 280px;">
			<input id="${id}-input" class="form-control" type="text" placeholder="${range ? 'Select a date range' : 'Select a date'}" />
		</div>
		<!-- a11y keyboard-instructions container; the provider finds it via
		     TagSelector(selfElement.parentElement, '.osui-datepicker-a11y') -->
		<div class="osui-datepicker-a11y"></div>`;
}

function initDatePicker(
	id: string,
	mode: 'single' | 'range',
	configs: Record<string, unknown>,
	register: Register
): void {
	// The platform calls this once at app start; without it ServerDateFormat is ''
	// and flatpickr cannot parse the Initial*Date strings (defaultDate is dropped).
	window.OutSystems.OSUI.Dates.SetServerDateFormat('1900-10-13');
	const P = Patterns();
	P.DatePickerAPI.Create(
		id,
		cfg({
			DateFormat: 'YYYY-MM-DD',
			FirstWeekDay: 1,
			ShowTodayButton: true,
			ShowWeekNumbers: false,
			TimeFormat: 'disabled',
			...configs,
		}),
		mode,
		'flatpickr'
	);
	P.DatePickerAPI.Initialize(id);
	register(() => P.DatePickerAPI.Dispose?.(id));
}

function renderDatePicker(args: DatePickerArgs): HTMLElement {
	const id = uid('datepicker');
	return renderPattern(datePickerMarkup(id, args.mode === 'range'), (_root, register) =>
		initDatePicker(
			id,
			args.mode,
			{
				DateFormat: args.dateFormat,
				FirstWeekDay: args.firstWeekDay,
				ShowTodayButton: args.showTodayButton,
				ShowWeekNumbers: args.showWeekNumbers,
				TimeFormat: args.timeFormat,
			},
			register
		)
	);
}

export const Default: Story = {
	render: renderDatePicker,
};

export const Range: Story = {
	args: { mode: 'range' },
	render: renderDatePicker,
};

/**
 * Calendar rendered inline in every cell (flatpickr `inline: true`, injected via
 * the `SetProviderConfigs` extensibility API) — an open()-based approach does not
 * work for a board because each open steals focus and closes the previous one.
 * Dates are pinned to March 2024 through the `Initial*Date` configs so the
 * visible month — and therefore the Chromatic snapshot — never drifts.
 */
export const OpenStates: Story = {
	parameters: { controls: { disable: true }, chromatic: { delay: 300 } },
	render: () => {
		const variants: Array<{
			label: string;
			mode: 'single' | 'range';
			configs: Record<string, unknown>;
		}> = [
			{ label: 'single', mode: 'single', configs: { InitialDate: '2024-03-15' } },
			{
				label: 'range',
				mode: 'range',
				configs: { InitialStartDate: '2024-03-08', InitialEndDate: '2024-03-19' },
			},
			{
				label: 'week numbers',
				mode: 'single',
				configs: { InitialDate: '2024-03-15', ShowWeekNumbers: true },
			},
			{
				// DateFormat must stay date-only: the provider appends ' - H:i' /
				// ' - h:i K' itself per TimeFormat (AbstractFlatpickrConfig._checkAltFormat).
				label: 'with time (24h)',
				mode: 'single',
				configs: { InitialDate: '2024-03-15 09:30:00', TimeFormat: '24' },
			},
			{
				label: 'with time (12h)',
				mode: 'single',
				configs: { InitialDate: '2024-03-15 09:30:00', TimeFormat: '12' },
			},
			{
				label: 'no today button',
				mode: 'single',
				configs: { InitialDate: '2024-03-15', ShowTodayButton: false },
			},
			{
				// FirstWeekDay: 0 = Sunday (the board default is 1 = Monday)
				label: 'week starts Sunday',
				mode: 'single',
				configs: { InitialDate: '2024-03-15', FirstWeekDay: 0 },
			},
			{
				// DateFormat only changes the displayed value; InitialDate strings are
				// always parsed with the server date format (YYYY-MM-DD here).
				label: 'format DD/MM/YYYY',
				mode: 'single',
				configs: { InitialDate: '2024-03-15', DateFormat: 'DD/MM/YYYY' },
			},
			{
				label: 'format MM/DD/YYYY',
				mode: 'single',
				configs: { InitialDate: '2024-03-15', DateFormat: 'MM/DD/YYYY' },
			},
		];
		const entries = variants.map((v) => ({ ...v, id: uid('datepicker') }));
		const board = labeledBoard(
			entries.map(({ label, id, mode }) => ({
				label,
				html: `<div style="width:340px;">${datePickerMarkup(id, mode === 'range')}</div>`,
			})),
			// zoom 0.5: nine open calendars are a lot of surface — show the whole
			// grid at half size so it fits the canvas (and Chromatic snapshot).
			{ direction: 'row', gap: 24, wrap: true, zoom: 0.5 }
		);
		return renderPattern(board.outerHTML, (_root, register) => {
			const P = Patterns();
			for (const { id, mode, configs } of entries) {
				initDatePicker(id, mode, configs, register);
				P.DatePickerAPI.SetProviderConfigs(id, { inline: true });
			}
		});
	},
};
