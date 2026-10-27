import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid, type Register } from './_helpers/osui';

interface BottomSheetArgs {
	showHandler: boolean;
	shape: string;
}

const meta: Meta<BottomSheetArgs> = {
	title: 'Patterns/Interaction/BottomSheet',
	tags: ['!ui-pending', 'ui-reviewed'],
	argTypes: {
		showHandler: {
			control: 'boolean',
			name: 'ShowHandler',
			description: 'Shows the drag handler bar at the top of the sheet.',
		},
		shape: {
			// ShapeTypes values are soft / rounded / none. The low-code names fail
			// validateInRange and every option falls back to soft.
			control: { type: 'inline-radio', labels: { soft: 'SoftRounded', rounded: 'Rounded', none: 'Sharp' } },
			options: ['soft', 'rounded', 'none'],
			name: 'Shape',
			description: 'Corner shape of the sheet: SoftRounded (default), Rounded or Sharp.',
		},
	},
	args: { showHandler: true, shape: 'rounded' },
};
export default meta;

type Story = StoryObj<BottomSheetArgs>;

export const Playground: Story = {
	tags: ['docs-example'],
	render: (args) => {
		const id = uid('bottom-sheet');
		const template = `
			<div style="min-height:320px;">
				<button class="btn btn-primary" data-open type="button">Open bottom sheet</button>
				<div ${osuiRoot(id)} class="osui-bottom-sheet" aria-hidden="true" tabindex="-1">
					<div class="osui-bottom-sheet__header">
						<div class="osui-bottom-sheet__header__top-bar"><strong>Sheet title</strong></div>
					</div>
					<div class="osui-bottom-sheet__content" style="padding:16px;">
						<p>Bottom-sheet content slides up from the bottom edge.</p>
						<button class="btn" data-close type="button">Close</button>
					</div>
				</div>
			</div>`;
		return renderPattern(template, (root, register) => {
			const P = Patterns();
			P.BottomSheetAPI.Create(id, cfg({ ShowHandler: args.showHandler, Shape: args.shape }));
			P.BottomSheetAPI.Initialize(id);
			root.querySelector('[data-open]')?.addEventListener('click', () => P.BottomSheetAPI.Open(id));
			root.querySelector('[data-close]')?.addEventListener('click', () => P.BottomSheetAPI.Close(id));
			register(() => P.BottomSheetAPI.Dispose?.(id));
		});
	},
};

function sheetMarkup(id: string): string {
	return `
		<div ${osuiRoot(id)} class="osui-bottom-sheet" aria-hidden="true" tabindex="-1">
			<div class="osui-bottom-sheet__header">
				<div class="osui-bottom-sheet__header__top-bar"><strong>Sheet title</strong></div>
			</div>
			<div class="osui-bottom-sheet__content" style="padding:16px;">
				<p>Bottom-sheet content slides up from the bottom edge.</p>
			</div>
		</div>`;
}

function initSheet(id: string, shape: string, showHandler: boolean, register: Register): void {
	const P = Patterns();
	P.BottomSheetAPI.Create(id, cfg({ ShowHandler: showHandler, Shape: shape }));
	P.BottomSheetAPI.Initialize(id);
	P.BottomSheetAPI.Open(id);
	register(() => P.BottomSheetAPI.Dispose?.(id));
}

const labelStyle = 'color:var(--color-text-subtle);font-family:monospace;font-size:0.8125rem;margin-bottom:8px;';

/** Sheets sit in the page so a gallery can show the top edge instead of the fixed bottom. */
function sheetGallery(cells: Array<{ id: string; label: string }>): HTMLElement {
	const board = document.createElement('div');
	board.className = 'bottom-sheet-shapes';
	board.style.cssText = 'align-items:flex-start;display:flex;flex-wrap:wrap;gap:24px;padding:24px;';
	const style = document.createElement('style');
	style.textContent = `
		.bottom-sheet-shapes .osui-bottom-sheet {
			bottom: auto;
			inset-inline-start: auto;
			max-height: none;
			min-height: 180px;
			position: relative;
			transform: none;
			width: 280px;
		}
		/* Open adds a sheet-colored ::before one full height below the sheet.
		   In a wrapped row that slab covers the next sheet's title. */
		.bottom-sheet-shapes .osui-bottom-sheet--is-open::before {
			content: none;
		}`;
	board.append(style);
	for (const cell of cells) {
		const item = document.createElement('div');
		const label = document.createElement('div');
		label.textContent = cell.label;
		label.style.cssText = labelStyle;
		item.append(label);
		item.insertAdjacentHTML('beforeend', sheetMarkup(cell.id));
		board.append(item);
	}
	return board;
}

/**
 * Default omits a known shape, so validation falls back to SoftRounded (`soft`).
 * Then SoftRounded, Rounded (`rounded`) and Sharp (`none`).
 */
export const Shapes: Story = {
	parameters: { controls: { disable: true } },
	render: () => {
		const shapes = [
			{ label: 'Default', shape: '' },
			{ label: 'SoftRounded', shape: 'soft' },
			{ label: 'Rounded', shape: 'rounded' },
			{ label: 'Sharp', shape: 'none' },
		] as const;
		const cells = shapes.map((shape) => ({ ...shape, id: uid('bottom-sheet') }));
		return renderPattern(sheetGallery(cells).outerHTML, (_root, register) => {
			for (const cell of cells) {
				initSheet(cell.id, cell.shape, true, register);
			}
		});
	},
};

/** The drag bar is the `osui-bottom-sheet--has-handler` class. The block default is on. */
export const Handler: Story = {
	parameters: { controls: { disable: true } },
	render: () => {
		const handlers = [
			{ label: 'With handler', showHandler: true },
			{ label: 'Without handler', showHandler: false },
		] as const;
		const cells = handlers.map((handler) => ({ ...handler, id: uid('bottom-sheet') }));
		return renderPattern(sheetGallery(cells).outerHTML, (_root, register) => {
			for (const cell of cells) {
				initSheet(cell.id, 'soft', cell.showHandler, register);
			}
		});
	},
};
