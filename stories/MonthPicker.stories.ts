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
	argTypes: {
		dateFormat: {
			control: 'text',
			name: 'DateFormat',
			description: 'Display format of the selected month (e.g. MM/YYYY).',
		},
	},
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

type MonthYear = { Month: string; Year: number };

// MonthYear objects use { Month, Year }; empty Month / Year < 1900 means "unset"
const UNSET_MONTH: MonthYear = { Month: '', Year: -1 };

function initMonthPicker(
	id: string,
	dateFormat: string,
	initialMonth: MonthYear,
	register: Register,
	limits: { MinMonth?: MonthYear; MaxMonth?: MonthYear } = {}
): void {
	const P = Patterns();
	P.MonthPickerAPI.Create(
		id,
		cfg({
			DateFormat: dateFormat,
			InitialMonth: initialMonth,
			MaxMonth: limits.MaxMonth ?? UNSET_MONTH,
			MinMonth: limits.MinMonth ?? UNSET_MONTH,
		}),
		'flatpickr'
	);
	P.MonthPickerAPI.Initialize(id);
	register(() => P.MonthPickerAPI.Dispose?.(id));
}

export const Playground: Story = {
	render: (args) => {
		const id = uid('monthpicker');
		return renderPattern(monthPickerMarkup(id), (_root, register) =>
			initMonthPicker(id, args.dateFormat, UNSET_MONTH, register)
		);
	},
};

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'The default MM/YYYY format with no InitialMonth: the input starts empty and opens a year-by-year month grid on focus or click.',
			},
		},
	},
	render: () => {
		const id = uid('monthpicker');
		return renderPattern(monthPickerMarkup(id), (_root, register) =>
			initMonthPicker(id, 'MM/YYYY', UNSET_MONTH, register)
		);
	},
};

export const MonthNameFormat: Story = {
	tags: ['docs-example'],
	name: 'Month name format',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Set DateFormat to MMM YYYY to display the abbreviated month name (Mar 2024) instead of its number. InitialMonth preselects March 2024 so the format is visible on render.',
			},
		},
	},
	render: () => {
		const id = uid('monthpicker');
		return renderPattern(monthPickerMarkup(id), (_root, register) =>
			initMonthPicker(id, 'MMM YYYY', { Month: 'March', Year: 2024 }, register)
		);
	},
};

export const MinMaxMonth: Story = {
	tags: ['docs-example'],
	name: 'Min and max month',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'MinMonth and MaxMonth bound the selectable range — here the 2024 fiscal year. Open the picker: months outside January–December 2024 are disabled and the year arrows stop at the limits.',
			},
		},
	},
	render: () => {
		const id = uid('monthpicker');
		return renderPattern(monthPickerMarkup(id), (_root, register) =>
			initMonthPicker(id, 'MM/YYYY', { Month: 'June', Year: 2024 }, register, {
				MinMonth: { Month: 'January', Year: 2024 },
				MaxMonth: { Month: 'December', Year: 2024 },
			})
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
