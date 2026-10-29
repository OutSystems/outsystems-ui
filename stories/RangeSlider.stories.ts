import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid, type Register } from './_helpers/osui';
import { labeledBoard } from './_helpers/showcase';

/**
 * RangeSlider — noUiSlider provider. `Create(id, configs, mode, 'noUiSlider')`
 * where mode ∈ {'single','interval'}. noUiSlider mounts on
 * `.osui-range-slider__provider`. Requires `window.noUiSlider`.
 */
interface RangeSliderArgs {
	mode: 'single' | 'interval';
	minValue: number;
	maxValue: number;
	step: number;
	showFloatingLabel: boolean;
	showTickMarks: boolean;
}

const meta: Meta<RangeSliderArgs> = {
	title: 'Patterns/Interaction/RangeSlider',
	tags: ['!ui-pending', 'ui-reviewed'],
	argTypes: {
		mode: { control: 'inline-radio', options: ['single', 'interval'] },
		minValue: { control: 'number', name: 'MinValue' },
		maxValue: { control: 'number', name: 'MaxValue' },
		step: { control: 'number', name: 'Step' },
		showFloatingLabel: { control: 'boolean', name: 'ShowFloatingLabel' },
		showTickMarks: { control: 'boolean', name: 'ShowTickMarks' },
	},
	args: { mode: 'single', minValue: 0, maxValue: 100, step: 1, showFloatingLabel: true, showTickMarks: false },
};
export default meta;

type Story = StoryObj<RangeSliderArgs>;

function rangeSliderMarkup(id: string, style: string): string {
	return `
		<div ${osuiRoot(id)} class="osui-range-slider" style="${style}">
			<div class="osui-range-slider__provider"></div>
		</div>`;
}

/** Create → Initialize → register Dispose; `configs` merge over the single-mode defaults. */
function initRangeSlider(
	id: string,
	mode: 'single' | 'interval',
	configs: Record<string, unknown>,
	register: Register
): void {
	const P = Patterns();
	P.RangeSliderAPI.Create(
		id,
		cfg({
			MinValue: 0,
			MaxValue: 100,
			Step: 1,
			IsInterval: mode === 'interval',
			ShowFloatingLabel: false,
			ShowTickMarks: false,
			StartingValueFrom: 50,
			StartingValueTo: 0,
			Orientation: 'horizontal',
			Size: '100%',
			...configs,
		}),
		mode,
		'noUiSlider'
	);
	P.RangeSliderAPI.Initialize(id);
	register(() => P.RangeSliderAPI.Dispose?.(id));
}

function renderRangeSlider(args: RangeSliderArgs): HTMLElement {
	const id = uid('range-slider');
	const interval = args.mode === 'interval';
	return renderPattern(rangeSliderMarkup(id, 'max-width:360px;padding:24px 8px;'), (_root, register) =>
		initRangeSlider(
			id,
			args.mode,
			{
				MinValue: args.minValue,
				MaxValue: args.maxValue,
				Step: args.step,
				ShowFloatingLabel: args.showFloatingLabel,
				ShowTickMarks: args.showTickMarks,
				StartingValueFrom: interval ? args.minValue + (args.maxValue - args.minValue) * 0.25 : args.minValue,
				StartingValueTo: interval ? args.minValue + (args.maxValue - args.minValue) * 0.75 : 0,
			},
			register
		)
	);
}

export const Default: Story = {
	render: renderRangeSlider,
};

export const Interval: Story = {
	args: { mode: 'interval' },
	render: renderRangeSlider,
};

/**
 * Step snapping, tick marks and the floating value label, side by side:
 * the bare track, `ShowFloatingLabel: true` (value tooltip above the handle),
 * `ShowTickMarks: true` (pips every `TickMarksInterval` values), and a
 * `Step: 25` track with ticks aligned to the snap points.
 */
export const StepsAndLabels: Story = {
	parameters: { controls: { disable: true }, chromatic: { delay: 300 } },
	render: () => {
		const variants: Array<{ label: string; configs: Record<string, unknown> }> = [
			{ label: 'default (no ticks, no label)', configs: {} },
			{ label: 'ShowFloatingLabel: true', configs: { ShowFloatingLabel: true } },
			{
				label: 'ShowTickMarks: true (interval 25)',
				configs: { ShowTickMarks: true, TickMarksInterval: 25 },
			},
			{
				label: 'Step: 25 + tick marks',
				configs: { Step: 25, ShowTickMarks: true, TickMarksInterval: 25 },
			},
		];
		const entries = variants.map((v) => ({ ...v, id: uid('range-slider') }));
		const board = labeledBoard(
			entries.map(({ label, id }) => ({
				// Top padding for the floating label, bottom padding for the pips —
				// both render outside the track's own box.
				label,
				html: `<div style="width:320px;">${rangeSliderMarkup(id, 'padding:28px 8px 48px;')}</div>`,
			})),
			{ direction: 'row', gap: 24, wrap: true }
		);
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const { id, configs } of entries) {
				initRangeSlider(id, 'single', configs, register);
			}
		});
	},
};

/* ── Spec matrix ────────────────────────────────────────────────────────────── */

// The design frame: a 1–12 scale with end pips, floating value labels, single handle at
// 3 and interval 3–9. `TickMarksInterval: 11` puts pips at the two ends only.
const SPEC = { min: 1, max: 12, from: 3, to: 9, tickInterval: 11 };

const CELLS = [
	{ row: 'Regular', col: 'Default', interval: false, disabled: false },
	{ row: 'Regular', col: 'Disabled', interval: false, disabled: true },
	{ row: 'Interval', col: 'Default', interval: true, disabled: false },
	{ row: 'Interval', col: 'Disabled', interval: true, disabled: true },
] as const;

/**
 * Every mode × state combination from the design frame, as a matrix.
 *
 * Each cell is a real pattern instance — four `Create`/`Initialize` pairs driving
 * noUiSlider — rather than static markup, so tooltips and pips are produced by the
 * provider exactly as they are at runtime.
 */
export const SpecMatrix: Story = {
	name: 'Spec matrix (mode × state)',
	parameters: { controls: { disable: true } },
	render: () => {
		const ids = CELLS.map(() => uid('range-slider'));
		const template = `
			<style>
				.osui-rs-matrix {
					align-items: center;
					display: grid;
					gap: 24px 40px;
					grid-template-columns: max-content repeat(2, minmax(240px, 1fr));
				}
				.osui-rs-matrix__head { color: var(--color-text-subtle); font-family: monospace; font-size: 0.8125rem; }
				/* Room for the floating label above and the pips below, which both sit
				   outside the track's own box. */
				.osui-rs-cell { padding: 28px 8px 8px; }
			</style>
			<div class="osui-rs-matrix">
				<div></div>
				<div class="osui-rs-matrix__head">Default</div>
				<div class="osui-rs-matrix__head">Disabled</div>
				${['Regular', 'Interval']
					.map(
						(row) => `
					<div class="osui-rs-matrix__head">${row}</div>
					${CELLS.filter((c) => c.row === row)
						.map((c) => {
							const id = ids[CELLS.indexOf(c)];
							return `
							<div class="osui-rs-cell">
								<div ${osuiRoot(id)} class="osui-range-slider">
									<div class="osui-range-slider__provider"></div>
								</div>
							</div>`;
						})
						.join('')}`
					)
					.join('')}
			</div>`;

		return renderPattern(template, (_root, register) => {
			const P = Patterns();
			CELLS.forEach((c, i) => {
				const id = ids[i];
				P.RangeSliderAPI.Create(
					id,
					cfg({
						MinValue: SPEC.min,
						MaxValue: SPEC.max,
						Step: 1,
						IsInterval: c.interval,
						IsDisabled: c.disabled,
						ShowFloatingLabel: true,
						ShowTickMarks: true,
						TickMarksInterval: SPEC.tickInterval,
						StartingValueFrom: SPEC.from,
						StartingValueTo: c.interval ? SPEC.to : 0,
						Orientation: 'horizontal',
						Size: '100%',
					}),
					c.interval ? 'interval' : 'single',
					'noUiSlider'
				);
				P.RangeSliderAPI.Initialize(id);
				register(() => P.RangeSliderAPI.Dispose?.(id));
			});
		});
	},
};
