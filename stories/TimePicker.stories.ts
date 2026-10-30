import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid, type Register } from './_helpers/osui';
import { labeledBoard } from './_helpers/showcase';

/**
 * TimePicker — Flatpickr provider. `Create(id, configs, 'flatpickr')`.
 * Needs an `input.form-control` (no a11y sibling required). Requires `window.flatpickr`.
 */
interface TimePickerArgs {
	is24Hours: boolean;
	timeFormat: string;
}

const meta: Meta<TimePickerArgs> = {
	title: 'Patterns/Interaction/TimePicker',
	argTypes: {
		is24Hours: {
			control: 'boolean',
			name: 'Is24Hours',
			description: 'Uses a 24-hour clock; False shows an AM/PM selector.',
		},
		timeFormat: {
			control: 'text',
			name: 'TimeFormat',
			description:
				'Passed raw to flatpickr as `altFormat`, so it takes flatpickr tokens (`H:i`, `h:i K` — `m` would mean month!). Leave empty to let Is24Hours pick the format.',
		},
	},
	args: { is24Hours: true, timeFormat: '' },
};
export default meta;

type Story = StoryObj<TimePickerArgs>;

function timePickerMarkup(id: string): string {
	return `
		<div ${osuiRoot(id)} class="osui-timepicker" style="max-width:280px;">
			<label for="${id}-input">Pick a time</label>
			<input id="${id}-input" class="form-control" type="text" placeholder="Select a time" />
		</div>`;
}

function initTimePicker(
	id: string,
	is24Hours: boolean,
	timeFormat: string,
	register: Register,
	initialTime = '',
	configs: Record<string, unknown> = {}
): void {
	const P = Patterns();
	P.TimePickerAPI.Create(
		id,
		// InitialTime must be omitted when unset: the config validator throws on
		// an empty string (Helper.Times.IsNull('') is an error, not "no time").
		cfg({
			Is24Hours: is24Hours,
			TimeFormat: timeFormat,
			...(initialTime ? { InitialTime: initialTime } : {}),
			...configs,
		}),
		'flatpickr'
	);
	P.TimePickerAPI.Initialize(id);
	register(() => P.TimePickerAPI.Dispose?.(id));
}

export const Playground: Story = {
	render: (args) => {
		const id = uid('timepicker');
		return renderPattern(timePickerMarkup(id), (_root, register) =>
			initTimePicker(id, args.is24Hours, args.timeFormat, register)
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
				story: 'Block defaults: Is24Hours True, no InitialTime. The input starts empty and opens an hour:minute spinner on focus or click.',
			},
		},
	},
	render: () => {
		const id = uid('timepicker');
		return renderPattern(timePickerMarkup(id), (_root, register) => initTimePicker(id, true, '', register));
	},
};

export const TwelveHour: Story = {
	tags: ['docs-example'],
	name: '12-hour clock',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'Set Is24Hours to False for an AM/PM selector. InitialTime 09:30 preselects the value so the h:i K format shows on render.',
			},
		},
	},
	render: () => {
		const id = uid('timepicker');
		return renderPattern(timePickerMarkup(id), (_root, register) =>
			initTimePicker(id, false, '', register, '09:30')
		);
	},
};

export const MinMaxTime: Story = {
	tags: ['docs-example'],
	name: 'Min and max time',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'OptionalConfigs.MinTime and MaxTime clamp the selectable range — business hours 09:00 to 18:00 here. The spinner refuses values outside the window.',
			},
		},
	},
	render: () => {
		const id = uid('timepicker');
		return renderPattern(timePickerMarkup(id), (_root, register) =>
			initTimePicker(id, true, '', register, '09:00', { MinTime: '09:00', MaxTime: '18:00' })
		);
	},
};

/**
 * 12h vs 24h time panels rendered inline (flatpickr `inline: true` via the
 * `SetProviderConfigs` extensibility API), both pinned to a fixed `InitialTime`
 * so the snapshot is deterministic. TimeFormat stays empty: `Is24Hours` picks
 * the right input format on its own.
 */
export const Formats: Story = {
	parameters: { controls: { disable: true }, chromatic: { delay: 300 } },
	render: () => {
		const entries = [
			{ label: '12h', is24Hours: false, id: uid('timepicker') },
			{ label: '24h', is24Hours: true, id: uid('timepicker') },
		];
		const board = labeledBoard(
			entries.map(({ label, id }) => ({
				label,
				html: `<div style="width:340px;">${timePickerMarkup(id)}</div>`,
			})),
			{ direction: 'row', gap: 24, wrap: true }
		);
		return renderPattern(board.outerHTML, (_root, register) => {
			const P = Patterns();
			for (const { id, is24Hours } of entries) {
				initTimePicker(id, is24Hours, '', register, '09:30');
				P.TimePickerAPI.SetProviderConfigs(id, { inline: true });
			}
		});
	},
};
