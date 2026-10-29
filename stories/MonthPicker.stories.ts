import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid, type Register } from './_helpers/osui';
import { labeledBoard } from './_helpers/showcase';

/**
 * MonthPicker — Flatpickr provider. `Create(id, configs, 'flatpickr')`.
 * Needs an `input.form-control` and a sibling `.osui-monthpicker-a11y`.
 * Requires `window.flatpickr`.
 */
interface MonthPickerArgs {
	dateFormat: string;
}

const meta: Meta<MonthPickerArgs> = {
	title: 'Patterns/Interaction/MonthPicker',
	argTypes: { dateFormat: { control: 'text', name: 'DateFormat' } },
	args: { dateFormat: 'MM/YYYY' },
};
export default meta;

type Story = StoryObj<MonthPickerArgs>;

function monthPickerMarkup(id: string): string {
	return `
		<div ${osuiRoot(id)} class="osui-monthpicker" style="max-width:280px;">
			<label for="${id}-input">Pick a month</label>
			<input id="${id}-input" class="form-control" type="text" placeholder="Select a month" />
		</div>
		<div class="osui-monthpicker-a11y"></div>`;
}

function initMonthPicker(
	id: string,
	dateFormat: string,
	initialMonth: { Month: string; Year: number },
	register: Register
): void {
	const P = Patterns();
	P.MonthPickerAPI.Create(
		id,
		cfg({
			DateFormat: dateFormat,
			// MonthYear objects use { Month, Year }; empty Month / Year < 1900 means "unset"
			InitialMonth: initialMonth,
			MaxMonth: { Month: '', Year: -1 },
			MinMonth: { Month: '', Year: -1 },
		}),
		'flatpickr'
	);
	P.MonthPickerAPI.Initialize(id);
	register(() => P.MonthPickerAPI.Dispose?.(id));
}

export const Default: Story = {
	render: (args) => {
		const id = uid('monthpicker');
		return renderPattern(monthPickerMarkup(id), (_root, register) =>
			initMonthPicker(id, args.dateFormat, { Month: '', Year: -1 }, register)
		);
	},
};

/**
 * The month-grid calendar rendered inline (flatpickr `inline: true` via the
 * `SetProviderConfigs` extensibility API), with the selection pinned to
 * March 2024 so the snapshot is deterministic.
 */
export const Open: Story = {
	parameters: { controls: { disable: true }, chromatic: { delay: 300 } },
	render: () => {
		const id = uid('monthpicker');
		const board = labeledBoard([
			{ label: 'open', html: `<div style="width:340px;">${monthPickerMarkup(id)}</div>` },
		]);
		return renderPattern(board.outerHTML, (_root, register) => {
			initMonthPicker(id, 'MM/YYYY', { Month: 'March', Year: 2024 }, register);
			Patterns().MonthPickerAPI.SetProviderConfigs(id, { inline: true });
		});
	},
};
