import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid, type Register } from './_helpers/osui';

/**
 * TouchEvents — gesture utility (no visuals of its own). Attaches
 * touchstart/move/end listeners to the element named by `WidgetId`, exposing
 * raw coordinates/deltas. Best exercised on a touch device / device emulation.
 */
const meta: Meta = {
	title: 'Patterns/Utilities/TouchEvents',
};
export default meta;

type Story = StoryObj;

/**
 * The block's input parameters are `WidgetId` (the demo box, wired here) and
 * `PreventDefaults`, which the low-code block applies itself and the runtime config
 * does not expose — so the playground has no controls; it logs the Move deltas instead.
 */
export const Playground: Story = {
	render: () => {
		const id = uid('touch');
		const template = `
			<div ${osuiRoot(id)} style="display:flex;align-items:center;justify-content:center;min-height:200px;background:#efe;border-radius:8px;user-select:none;touch-action:none;">
				<span data-output>Touch &amp; drag inside this box (touch device / emulation)</span>
			</div>`;
		return renderPattern(template, (root, register) => {
			const P = Patterns();
			P.TouchEventsAPI.Create(id, cfg({ WidgetId: id }));
			P.TouchEventsAPI.Initialize(id);
			const out = root.querySelector('[data-output]')!;
			P.TouchEventsAPI.RegisterCallback?.(id, 'Move', (_x: number, _y: number, tx: number, ty: number) => {
				out.textContent = `Δx ${Math.round(tx)}, Δy ${Math.round(ty)}`;
			});
			register(() => P.TouchEventsAPI.Dispose?.(id));
		});
	},
};

type TouchHandlers = {
	onStart?: (x: number, y: number) => void;
	onMove?: (x: number, y: number, offsetX: number, offsetY: number) => void;
	onEnd?: (x: number, y: number, offsetX: number, offsetY: number, timeTaken: number) => void;
};

/**
 * Same Create/Initialize/RegisterCallback sequence as the Playground, for the element `targetId`.
 * The runtime resolves the pattern's own element by its instance id (`name=` attribute), so the
 * instance id must be the target element's id — the element carries `osuiRoot(targetId)`.
 */
function initTouchEvents(targetId: string, register: Register, handlers: TouchHandlers): void {
	const P = Patterns();
	const id = targetId;
	P.TouchEventsAPI.Create(id, cfg({ WidgetId: targetId }));
	P.TouchEventsAPI.Initialize(id);
	if (handlers.onStart) P.TouchEventsAPI.RegisterCallback?.(id, 'Start', handlers.onStart);
	if (handlers.onMove) P.TouchEventsAPI.RegisterCallback?.(id, 'Move', handlers.onMove);
	if (handlers.onEnd) P.TouchEventsAPI.RegisterCallback?.(id, 'End', handlers.onEnd);
	register(() => P.TouchEventsAPI.Dispose?.(id));
}

const px = (value: number) => `${Math.round(value)}px`;

export const BasicUsage: Story = {
	tags: ['docs-example'],
	name: 'Basic usage',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: 'The block points at a Container through <code>WidgetId</code>. <code>Start</code> reports where the finger lands, <code>Move</code> streams the current position plus the offset from the start point, and <code>End</code> adds the gesture duration. Use a touch device or browser device emulation.',
			},
		},
	},
	render: () => {
		const id = uid('touch-area');
		const row = (name: string) =>
			`<div style="display:contents;"><dt style="font-weight:600;">${name}</dt><dd data-${name.toLowerCase()} style="margin:0;font-variant-numeric:tabular-nums;color:var(--color-neutral-8, #445);">—</dd></div>`;
		const template = `
			<div style="display:grid;gap:12px;max-width:480px;">
				<div ${osuiRoot(id)} style="display:flex;align-items:center;justify-content:center;min-height:220px;background:var(--color-neutral-2, #efe);border:1px dashed var(--color-neutral-5, #ccd);border-radius:8px;user-select:none;touch-action:none;text-align:center;">
					<span>Touch and drag inside this box</span>
				</div>
				<dl style="display:grid;grid-template-columns:auto 1fr;gap:4px 16px;margin:0;font-size:13px;" aria-live="polite">
					${row('Start')}${row('Move')}${row('End')}
				</dl>
			</div>`;
		return renderPattern(template, (root, register) => {
			const start = root.querySelector('[data-start]')!;
			const move = root.querySelector('[data-move]')!;
			const end = root.querySelector('[data-end]')!;
			initTouchEvents(id, register, {
				onStart: (x, y) => {
					start.textContent = `X ${px(x)}, Y ${px(y)}`;
					move.textContent = '—';
					end.textContent = '—';
				},
				onMove: (x, y, offsetX, offsetY) => {
					move.textContent = `X ${px(x)}, Y ${px(y)} · OffsetX ${px(offsetX)}, OffsetY ${px(offsetY)}`;
				},
				onEnd: (x, y, offsetX, offsetY, timeTaken) => {
					end.textContent = `X ${px(x)}, Y ${px(y)} · OffsetX ${px(offsetX)}, OffsetY ${px(offsetY)} · TimeTaken ${Math.round(timeTaken)}ms`;
				},
			});
		});
	},
};

export const DragToReorder: Story = {
	tags: ['docs-example'],
	name: 'Drag a handle',
	parameters: {
		layout: 'padded',
		docs: {
			description: {
				story: '<code>WidgetId</code> targets a small handle instead of a whole area. The <code>Move</code> offsets drive a CSS transform so the handle follows the finger, and <code>End</code> snaps it back. <code>PreventDefaults</code> stays True so the page does not scroll while dragging.',
			},
		},
	},
	render: () => {
		const id = uid('touch-handle');
		const template = `
			<div style="display:grid;gap:12px;max-width:480px;">
				<div style="position:relative;min-height:220px;background:var(--color-neutral-2, #efe);border:1px dashed var(--color-neutral-5, #ccd);border-radius:8px;overflow:hidden;">
					<div ${osuiRoot(id)} style="position:absolute;left:calc(50% - 32px);top:calc(50% - 32px);width:64px;height:64px;display:flex;align-items:center;justify-content:center;background:var(--color-primary, #1d63ff);color:#fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.2);user-select:none;touch-action:none;transition:transform .2s ease;" aria-label="Drag handle">
						<span aria-hidden="true" style="font-size:22px;">⠿</span>
					</div>
				</div>
				<p data-output style="margin:0;font-size:13px;color:var(--color-neutral-8, #445);font-variant-numeric:tabular-nums;" aria-live="polite">Drag the handle around the box.</p>
			</div>`;
		return renderPattern(template, (root, register) => {
			const handle = root.querySelector<HTMLElement>(`#${id}`)!;
			const out = root.querySelector('[data-output]')!;
			initTouchEvents(id, register, {
				onStart: () => {
					handle.style.transition = 'none';
				},
				onMove: (_x, _y, offsetX, offsetY) => {
					handle.style.transform = `translate(${px(offsetX)}, ${px(offsetY)})`;
					out.textContent = `OffsetX ${px(offsetX)}, OffsetY ${px(offsetY)}`;
				},
				onEnd: (_x, _y, offsetX, offsetY, timeTaken) => {
					handle.style.transition = 'transform .2s ease';
					handle.style.transform = '';
					out.textContent = `Released after ${Math.round(timeTaken)}ms at OffsetX ${px(offsetX)}, OffsetY ${px(offsetY)} — snapped back.`;
				},
			});
		});
	},
};
