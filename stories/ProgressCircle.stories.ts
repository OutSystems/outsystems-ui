import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid, type Register } from './_helpers/osui';

/**
 * Progress Circle — `Create(id, 'Circle', configs)`.
 * Markup: an SVG with trail-path and progress-path circles inside
 * `.osui-progress-circle__container > .osui-inline-svg.svg-wrapper`.
 * `auto` size follows the parent; any other size is a CSS length on `--progress-circle-size`.
 */
interface ProgressCircleArgs {
	progress: number;
	thickness: number;
	shape: string;
}

const meta: Meta<ProgressCircleArgs> = {
	title: 'Patterns/Numbers/Progress Circle',
	argTypes: {
		progress: { control: { type: 'range', min: 0, max: 100 }, name: 'Progress' },
		thickness: { control: { type: 'number', min: 1, max: 24 }, name: 'Thickness' },
		shape: { control: 'inline-radio', options: ['sharp', 'soft', 'rounded', 'round'], name: 'Shape' },
	},
	args: { progress: 60, thickness: 8, shape: 'rounded' },
};
export default meta;

type Story = StoryObj<ProgressCircleArgs>;

function circleMarkup(id: string): string {
	return `
		<div ${osuiRoot(id)} class="osui-progress-circle" role="progressbar" aria-valuemin="0" aria-valuemax="100">
			<div class="osui-progress-circle__container">
				<div class="osui-inline-svg svg-wrapper">
					<svg>
						<defs></defs>
						<circle class="osui-progress-circle__container__trail-path"></circle>
						<circle class="osui-progress-circle__container__progress-path"></circle>
					</svg>
				</div>
			</div>
			<div class="osui-progress-circle__content" id="${id}-label"></div>
		</div>`;
}

function initCircle(
	id: string,
	configs: {
		progress: number;
		thickness: number;
		shape: string;
		animate: boolean;
		progressColor?: string;
		trailColor?: string;
		size?: string;
	},
	register: Register
): void {
	const P = Patterns();
	P.ProgressAPI.Create(
		id,
		'Circle',
		cfg({
			Progress: configs.progress,
			Thickness: configs.thickness,
			Shape: configs.shape,
			ProgressColor: configs.progressColor ?? 'primary',
			TrailColor: configs.trailColor ?? 'neutral-2',
			AnimateInitialProgress: configs.animate,
			InitialProgress: 0,
			ProgressCircleSize: configs.size ?? 'auto',
		})
	);
	P.ProgressAPI.Initialize(id);
	// The circle applies its value on a timeout, and SetProgressValue then transitions
	// the stroke for 0.35s. Set the value and drop that class before paint so a snapshot
	// shows the arc.
	if (!configs.animate) {
		P.ProgressAPI.SetProgressValue(id, configs.progress);
		document
			.getElementById(id)
			?.querySelector('.osui-progress-circle__container__progress-path')
			?.classList.remove('animate-progress-change');
	}
	register(() => P.ProgressAPI.Dispose?.(id));
}

const labelStyle = 'color:var(--color-text-subtle);font-family:monospace;font-size:0.8125rem;margin-bottom:8px;';

export const Default: Story = {
	render: (args) => {
		const id = uid('progress-circle');
		const template = `
			<div ${osuiRoot(id)} class="osui-progress-circle" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width:140px;height:140px;">
				<div class="osui-progress-circle__container">
					<div class="osui-inline-svg svg-wrapper">
						<svg>
							<defs></defs>
							<circle class="osui-progress-circle__container__trail-path"></circle>
							<circle class="osui-progress-circle__container__progress-path"></circle>
						</svg>
					</div>
				</div>
				<div class="osui-progress-circle__content" id="${id}-label"></div>
			</div>`;
		return renderPattern(template, (_root, register) =>
			initCircle(
				id,
				{ progress: args.progress, thickness: args.thickness, shape: args.shape, animate: true },
				register
			)
		);
	},
};

/** The same arc at thickness 1, 8 and 20, so only the stroke width changes. */
export const Thickness: Story = {
	parameters: { controls: { disable: true } },
	render: () => {
		const thicknesses = [1, 8, 20] as const;
		const cells = thicknesses.map((thickness) => ({ thickness, id: uid('progress-circle') }));
		const board = document.createElement('div');
		board.style.cssText = 'align-items:flex-start;display:flex;gap:24px;';
		for (const cell of cells) {
			const item = document.createElement('div');
			const label = document.createElement('div');
			label.textContent = String(cell.thickness);
			label.style.cssText = labelStyle;
			const box = document.createElement('div');
			box.style.cssText = 'height:140px;width:140px;';
			box.insertAdjacentHTML('beforeend', circleMarkup(cell.id));
			item.append(label, box);
			board.append(item);
		}
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const cell of cells) {
				initCircle(
					cell.id,
					{ progress: 60, thickness: cell.thickness, shape: 'rounded', animate: false, size: 'auto' },
					register
				);
			}
		});
	},
};

/**
 * Sharp (`none`, butt caps), Soft and Rounded (round caps) at the same arc.
 * Anything other than Sharp is stored as `stroke-linecap: round`.
 */
export const Shapes: Story = {
	parameters: { controls: { disable: true } },
	render: () => {
		const shapes = [
			{ label: 'Sharp', shape: 'none' },
			{ label: 'Soft', shape: 'soft' },
			{ label: 'Rounded', shape: 'rounded' },
		] as const;
		const cells = shapes.map((shape) => ({ ...shape, id: uid('progress-circle') }));
		const board = document.createElement('div');
		board.style.cssText = 'align-items:flex-start;display:flex;gap:24px;';
		for (const cell of cells) {
			const item = document.createElement('div');
			const label = document.createElement('div');
			label.textContent = cell.label;
			label.style.cssText = labelStyle;
			const box = document.createElement('div');
			box.style.cssText = 'height:140px;width:140px;';
			box.insertAdjacentHTML('beforeend', circleMarkup(cell.id));
			item.append(label, box);
			board.append(item);
		}
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const cell of cells) {
				initCircle(
					cell.id,
					{ progress: 60, thickness: 20, shape: cell.shape, animate: false, size: 'auto' },
					register
				);
			}
		});
	},
};

/**
 * Progress color keeps the stroke on each swatch and the trail on `neutral-2`.
 * Trail color uses the same swatches on the unfilled ring, with a primary stroke.
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
			colors.map((color) => ({ ...color, ...section, id: uid('progress-circle') }))
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
			const row = document.createElement('div');
			row.style.cssText = 'align-items:flex-start;display:flex;flex-wrap:wrap;gap:24px;';
			for (const cell of cells.filter((entry) => entry.target === section.target)) {
				const item = document.createElement('div');
				const label = document.createElement('div');
				label.textContent = cell.label;
				label.style.cssText = labelStyle;
				const box = document.createElement('div');
				box.style.cssText = 'height:140px;width:140px;';
				box.insertAdjacentHTML('beforeend', circleMarkup(cell.id));
				item.append(label, box);
				row.append(item);
			}
			group.append(row);
			board.append(group);
		}
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const cell of cells) {
				initCircle(
					cell.id,
					{
						progress: 60,
						thickness: 8,
						shape: 'rounded',
						animate: false,
						size: 'auto',
						progressColor: cell.target === 'progress' ? cell.color : 'primary',
						trailColor: cell.target === 'trail' ? cell.color : 'neutral-2',
					},
					register
				);
			}
		});
	},
};

/**
 * Auto follows a 140px parent. Explicit sizes are CSS lengths on `--progress-circle-size`
 * and must not set an inline width, which would override that variable.
 */
export const Sizes: Story = {
	parameters: { controls: { disable: true } },
	render: () => {
		const sizes = [
			{ label: 'Auto', size: 'auto', box: '140px' },
			{ label: '80px', size: '80px', box: '' },
			{ label: '200px', size: '200px', box: '' },
		] as const;
		const cells = sizes.map((size) => ({ ...size, id: uid('progress-circle') }));
		const board = document.createElement('div');
		board.style.cssText = 'align-items:flex-start;display:flex;gap:32px;';
		for (const cell of cells) {
			const item = document.createElement('div');
			const label = document.createElement('div');
			label.textContent = cell.label;
			label.style.cssText = labelStyle;
			const box = document.createElement('div');
			if (cell.box) {
				box.style.cssText = `height:${cell.box};width:${cell.box};`;
			}
			box.insertAdjacentHTML('beforeend', circleMarkup(cell.id));
			item.append(label, box);
			board.append(item);
		}
		return renderPattern(board.outerHTML, (_root, register) => {
			for (const cell of cells) {
				initCircle(
					cell.id,
					{ progress: 60, thickness: 8, shape: 'rounded', animate: false, size: cell.size },
					register
				);
			}
		});
	},
};
