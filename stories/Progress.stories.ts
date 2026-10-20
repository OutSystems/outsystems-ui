import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid, type Register } from './_helpers/osui';

/**
 * Progress Bar — `Create(id, 'Bar', configs)`.
 * Markup: `.osui-progress-bar__container > .osui-progress-bar__value`.
 * Thickness is the `--thickness` inline length, in pixels.
 */
interface ProgressBarArgs {
	progress: number;
	thickness: number;
	shape: string;
}

const meta: Meta<ProgressBarArgs> = {
	title: 'Patterns/Numbers/Progress Bar',
	argTypes: {
		progress: { control: { type: 'range', min: 0, max: 100 }, name: 'Progress' },
		thickness: { control: { type: 'number', min: 1, max: 24 }, name: 'Thickness' },
		shape: { control: 'inline-radio', options: ['sharp', 'soft', 'rounded', 'round'], name: 'Shape' },
	},
	args: { progress: 60, thickness: 8, shape: 'rounded' },
};
export default meta;

type Story = StoryObj<ProgressBarArgs>;

function barMarkup(id: string): string {
	return `
		<div ${osuiRoot(id)} class="osui-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width:360px;">
			<div class="osui-progress-bar__container">
				<div class="osui-progress-bar__value"></div>
			</div>
			<div class="osui-progress-bar__content" id="${id}-label"></div>
		</div>`;
}

function initBar(
	id: string,
	configs: {
		progress: number;
		thickness: number;
		shape: string;
		animate: boolean;
		progressColor?: string;
		trailColor?: string;
	},
	register: Register
): void {
	const P = Patterns();
	P.ProgressAPI.Create(
		id,
		'Bar',
		cfg({
			Progress: configs.progress,
			Thickness: configs.thickness,
			Shape: configs.shape,
			ProgressColor: configs.progressColor ?? 'primary',
			TrailColor: configs.trailColor ?? 'border-subtle',
			AnimateInitialProgress: configs.animate,
			InitialProgress: 0,
		})
	);
	P.ProgressAPI.Initialize(id);
	// The bar applies its value on a timeout. Set it now so a snapshot shows the fill.
	if (!configs.animate) {
		P.ProgressAPI.SetProgressValue(id, configs.progress);
	}
	register(() => P.ProgressAPI.Dispose?.(id));
}

export const Default: Story = {
	render: (args) => {
		const id = uid('progress-bar');
		return renderPattern(barMarkup(id), (_root, register) =>
			initBar(
				id,
				{ progress: args.progress, thickness: args.thickness, shape: args.shape, animate: true },
				register
			)
		);
	},
};

/** The same fill at thickness 1, 8 and 20, so only the track height changes. */
export const Thickness: Story = {
	parameters: { controls: { disable: true } },
	render: () => {
		const thicknesses = [1, 8, 20] as const;
		const cells = thicknesses.map((thickness) => ({ thickness, id: uid('progress-bar') }));
		const board = document.createElement('div');
		board.style.cssText = 'align-items:flex-start;display:flex;flex-direction:column;gap:24px;';
		for (const cell of cells) {
			const item = document.createElement('div');
			const label = document.createElement('div');
			label.textContent = String(cell.thickness);
			label.style.cssText =
				'color:var(--color-text-subtle);font-family:monospace;font-size:0.8125rem;margin-bottom:8px;';
			item.append(label);
			item.insertAdjacentHTML('beforeend', barMarkup(cell.id));
			board.append(item);
		}
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const cell of cells) {
				initBar(
					cell.id,
					{ progress: 60, thickness: cell.thickness, shape: 'rounded', animate: false },
					register
				);
			}
		});
	},
};

/**
 * Sharp (`none`, square ends), Soft and Rounded (pill) at the same fill.
 * Shape is read from `--border-radius-{shape}` and applied as `--shape`.
 */
export const Shapes: Story = {
	parameters: { controls: { disable: true } },
	render: () => {
		const shapes = [
			{ label: 'Sharp', shape: 'none' },
			{ label: 'Soft', shape: 'soft' },
			{ label: 'Rounded', shape: 'rounded' },
		] as const;
		const cells = shapes.map((shape) => ({ ...shape, id: uid('progress-bar') }));
		const board = document.createElement('div');
		board.style.cssText = 'align-items:flex-start;display:flex;flex-direction:column;gap:24px;';
		for (const cell of cells) {
			const item = document.createElement('div');
			const label = document.createElement('div');
			label.textContent = cell.label;
			label.style.cssText =
				'color:var(--color-text-subtle);font-family:monospace;font-size:0.8125rem;margin-bottom:8px;';
			item.append(label);
			item.insertAdjacentHTML('beforeend', barMarkup(cell.id));
			board.append(item);
		}
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const cell of cells) {
				initBar(cell.id, { progress: 60, thickness: 20, shape: cell.shape, animate: false }, register);
			}
		});
	},
};

/**
 * Progress color keeps the fill on each swatch and the trail on `border-subtle`.
 * Trail color uses the same swatches on the unfilled track, with a primary fill.
 * `GetColorValueFromColorType` resolves a known name and otherwise uses the string as a CSS color.
 */
export const Colors: Story = {
	parameters: { controls: { disable: true } },
	render: () => {
		const colors = [
			{ label: 'Primary', color: 'primary' },
			{ label: 'Success', color: 'success' },
			{ label: 'Warning', color: 'warning' },
			{ label: 'Error', color: 'error' },
			{ label: 'Info', color: 'info' },
			{ label: 'rgb(124, 58, 237)', color: 'rgb(124, 58, 237)' },
			{ label: '#0F766E', color: '#0F766E' },
		] as const;
		const sections = [
			{ title: 'Progress color', target: 'progress' },
			{ title: 'Trail color', target: 'trail' },
		] as const;
		const cells = sections.flatMap((section) =>
			colors.map((color) => ({ ...color, ...section, id: uid('progress-bar') }))
		);
		const board = document.createElement('div');
		board.style.cssText = 'align-items:flex-start;display:flex;flex-direction:column;gap:40px;';
		for (const section of sections) {
			const group = document.createElement('div');
			group.style.cssText = 'display:flex;flex-direction:column;gap:24px;';
			const heading = document.createElement('div');
			heading.textContent = section.title;
			heading.style.cssText = 'font-size:0.875rem;font-weight:600;';
			group.append(heading);
			for (const cell of cells.filter((entry) => entry.target === section.target)) {
				const item = document.createElement('div');
				const label = document.createElement('div');
				label.textContent = cell.label;
				label.style.cssText =
					'color:var(--color-text-subtle);font-family:monospace;font-size:0.8125rem;margin-bottom:8px;';
				item.append(label);
				item.insertAdjacentHTML('beforeend', barMarkup(cell.id));
				group.append(item);
			}
			board.append(group);
		}
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const cell of cells) {
				initBar(
					cell.id,
					{
						progress: 60,
						thickness: 8,
						shape: 'rounded',
						animate: false,
						progressColor: cell.target === 'progress' ? cell.color : 'primary',
						trailColor: cell.target === 'trail' ? cell.color : 'border-subtle',
					},
					register
				);
			}
		});
	},
};
