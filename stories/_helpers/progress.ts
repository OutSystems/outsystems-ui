/**
 * Shared scaffolding for the Progress Bar and Progress Circle stories.
 *
 * Both patterns sit behind the same `ProgressAPI` (`Create(id, 'Bar' | 'Circle', configs)`)
 * and their stories lay out the same showcase boards (labeled cells, color-swatch
 * sections), so the controls, the init path and the board builders live here once.
 */
import type { Meta } from '@storybook/html-vite';
import { cfg, Patterns, type Register } from './osui';

/** Storybook controls shared by the Progress Bar and Progress Circle `Default` stories. */
export interface ProgressArgs {
	progress: number;
	thickness: number;
	shape: string;
}

/** `argTypes` for `ProgressArgs` — a progress range, a thickness number and a shape radio. */
export const progressArgTypes: Meta<ProgressArgs>['argTypes'] = {
	progress: { control: { type: 'range', min: 0, max: 100 }, name: 'Progress' },
	thickness: { control: { type: 'number', min: 1, max: 24 }, name: 'Thickness' },
	shape: { control: 'inline-radio', options: ['sharp', 'soft', 'rounded', 'round'], name: 'Shape' },
};

/** Default `args` for `ProgressArgs`. */
export const progressDefaultArgs: ProgressArgs = { progress: 60, thickness: 8, shape: 'rounded' };

/** The shape swatches of the `Shapes` stories. */
export const PROGRESS_SHAPES = [
	{ label: 'Sharp', shape: 'none' },
	{ label: 'Soft', shape: 'soft' },
	{ label: 'Rounded', shape: 'rounded' },
] as const;

/** The thickness swatches of the `Thickness` stories. */
export const PROGRESS_THICKNESSES = [1, 8, 20] as const;

/**
 * The color swatches of the `Colors` stories: the five named types plus two raw
 * CSS colors (`GetColorValueFromColorType` resolves a known name and otherwise
 * uses the string as a CSS color).
 */
export const COLOR_SWATCHES = [
	{ label: 'Primary', color: 'primary' },
	{ label: 'Success', color: 'success' },
	{ label: 'Warning', color: 'warning' },
	{ label: 'Error', color: 'error' },
	{ label: 'Info', color: 'info' },
	{ label: 'rgb(124, 58, 237)', color: 'rgb(124, 58, 237)' },
	{ label: '#0F766E', color: '#0F766E' },
] as const;

/** The two groups of the `Colors` stories: swatches on the fill, swatches on the trail. */
export const COLOR_SECTIONS = [
	{ title: 'Progress color', target: 'progress' },
	{ title: 'Trail color', target: 'trail' },
] as const;

/** What a progress story varies per instance; everything else defaults. */
export interface ProgressConfigs {
	progress: number;
	thickness: number;
	shape: string;
	animate: boolean;
	progressColor?: string;
	trailColor?: string;
	/** Circle only: `ProgressCircleSize`, `auto` or a CSS length. */
	size?: string;
}

/**
 * Create + Initialize one Progress instance (`Bar` or `Circle`) and register its
 * Dispose. Both shapes apply their value on a timeout, so non-animated stories set
 * it immediately so a snapshot shows the fill; the circle's `SetProgressValue`
 * also transitions the stroke for 0.35s, so its transition class is dropped
 * before paint.
 *
 * @param id the pattern root id (from `uid`)
 * @param type the Progress mode, `Bar` or `Circle`
 * @param configs the per-instance configs; trail defaults to the pattern's own default
 * @param register teardown registry from `renderPattern`
 */
export function initProgress(id: string, type: 'Bar' | 'Circle', configs: ProgressConfigs, register: Register): void {
	const P = Patterns();
	const shared = {
		Progress: configs.progress,
		Thickness: configs.thickness,
		Shape: configs.shape,
		ProgressColor: configs.progressColor ?? 'primary',
		TrailColor: configs.trailColor ?? (type === 'Bar' ? 'border-subtle' : 'neutral-2'),
		AnimateInitialProgress: configs.animate,
		InitialProgress: 0,
	};
	P.ProgressAPI.Create(
		id,
		type,
		cfg(type === 'Circle' ? { ...shared, ProgressCircleSize: configs.size ?? 'auto' } : shared)
	);
	P.ProgressAPI.Initialize(id);
	if (!configs.animate) {
		P.ProgressAPI.SetProgressValue(id, configs.progress);
		if (type === 'Circle') {
			document
				.getElementById(id)
				?.querySelector('.osui-progress-circle__container__progress-path')
				?.classList.remove('animate-progress-change');
		}
	}
	register(() => P.ProgressAPI.Dispose?.(id));
}

// The board builders (labeledBoard, sectionedBoard) the progress stories use
// live in ./showcase — shared by every component's showcase stories.
