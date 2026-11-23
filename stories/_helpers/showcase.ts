/**
 * Showcase-board builders shared by the per-component variant stories
 * (Colors, Shapes, Sizes, States, Positions boards). A board is a flex layout
 * of labeled cells; callers pass `board.outerHTML` to `renderPattern` /
 * `renderStatic`.
 */

import { PALETTE_COLOR_OPTIONS } from './lowcode';

/** One cell of a showcase board: a monospace label above the pattern's markup. */
export interface BoardCell {
	label: string;
	html: string;
}

/** Layout of a showcase board. */
export interface BoardOptions {
	/** Main axis; defaults to `column`. */
	direction?: 'row' | 'column';
	/** Gap between cells in px; defaults to 24. */
	gap?: number;
	/** Allow cells to wrap (row boards only); defaults to false. */
	wrap?: boolean;
	/**
	 * CSS `zoom` on the board (e.g. 0.5 to show a large grid at half size).
	 * Unlike `transform: scale`, `zoom` reflows layout, so the board stays
	 * compact instead of scaled-and-overflowing. Unset by default.
	 */
	zoom?: number;
}

const LABEL_STYLE = 'color:var(--color-text-subtle);font-family:monospace;font-size:0.8125rem;margin-bottom:8px;';

/**
 * Build a flex board of labeled cells — the layout every showcase story
 * (`Thickness`, `Shapes`, `Colors`, `Sizes`, …) uses.
 *
 * @param cells the labeled markup cells
 * @param options row/column, gap and wrap; defaults to a 24px column
 * @returns the detached board element (callers pass `board.outerHTML` to the renderer)
 */
export function labeledBoard(cells: readonly BoardCell[], options: BoardOptions = {}): HTMLElement {
	const { direction = 'column', gap = 24, wrap = false, zoom } = options;
	const board = document.createElement('div');
	board.style.cssText =
		'align-items:flex-start;display:flex;' +
		(direction === 'column' ? 'flex-direction:column;' : '') +
		(wrap ? 'flex-wrap:wrap;' : '') +
		(zoom !== undefined ? `zoom:${zoom};` : '') +
		`gap:${gap}px;`;
	for (const cell of cells) {
		const item = document.createElement('div');
		const label = document.createElement('div');
		label.textContent = cell.label;
		label.style.cssText = LABEL_STYLE;
		item.append(label);
		item.insertAdjacentHTML('beforeend', cell.html);
		board.append(item);
	}
	return board;
}

/**
 * Stack titled sections (a bold heading above a board) in a 40px column —
 * the layout of multi-group showcase stories.
 *
 * @param sections each section's heading text and its already-built board
 * @returns the detached root element
 */
export function sectionedBoard(sections: ReadonlyArray<{ title: string; board: HTMLElement }>): HTMLElement {
	const root = document.createElement('div');
	root.style.cssText = 'align-items:flex-start;display:flex;flex-direction:column;gap:40px;';
	for (const section of sections) {
		const group = document.createElement('div');
		group.style.cssText = 'display:flex;flex-direction:column;gap:24px;';
		const heading = document.createElement('div');
		heading.textContent = section.title;
		heading.style.cssText = 'font-size:0.875rem;font-weight:600;';
		group.append(heading, section.board);
		root.append(group);
	}
	return root;
}

/** The low-code `Color` swatches worth a board: primary, secondary and the 12 palette families. */
export const SWATCH_COLORS = ['primary', 'secondary', ...PALETTE_COLOR_OPTIONS] as const;

/**
 * Two-section Color showcase (Solid and IsLight rows over `SWATCH_COLORS`) for the
 * low-code patterns whose Color param maps to `background-*` utility classes
 * (Badge, Tag, UserAvatar, IconBadge, …).
 *
 * @param markup renders one instance for a color and its IsLight flag
 * @returns the detached board element
 */
export function colorBoard(markup: (color: string, isLight: boolean) => string): HTMLElement {
	const row = (isLight: boolean) =>
		labeledBoard(
			SWATCH_COLORS.map((color) => ({ label: color, html: markup(color, isLight) })),
			{ direction: 'row', wrap: true }
		);
	return sectionedBoard([
		{ title: 'Solid', board: row(false) },
		{ title: 'IsLight', board: row(true) },
	]);
}
