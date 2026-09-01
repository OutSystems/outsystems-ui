import type { Meta, StoryObj } from '@storybook/html-vite';
import { extendedClassArgType } from './_helpers/lowcode';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

/**
 * TouchEvents — gesture utility (no visuals of its own). Attaches
 * touchstart/move/end listeners to the element named by `WidgetId`, exposing
 * raw coordinates/deltas. Best exercised on a touch device / device emulation.
 */
type TouchEventsArgs = { extendedClass: string };

const meta: Meta<TouchEventsArgs> = {
	title: 'Patterns/Utilities/TouchEvents',
	args: { extendedClass: '' },
	argTypes: { extendedClass: extendedClassArgType },
};
export default meta;

type Story = StoryObj<TouchEventsArgs>;

export const Default: Story = {
	render: ({ extendedClass }) => {
		const id = uid('touch');
		const template = `
			<div ${osuiRoot(id)} style="display:flex;align-items:center;justify-content:center;min-height:200px;background:#efe;border-radius:8px;user-select:none;touch-action:none;">
				<span data-output>Touch &amp; drag inside this box (touch device / emulation)</span>
			</div>`;
		return renderPattern(template, (root, register) => {
			const P = Patterns();
			P.TouchEventsAPI.Create(id, cfg({ WidgetId: id, ExtendedClass: extendedClass }));
			P.TouchEventsAPI.Initialize(id);
			const out = root.querySelector('[data-output]')!;
			P.TouchEventsAPI.RegisterCallback?.(id, 'Move', (_x: number, _y: number, tx: number, ty: number) => {
				out.textContent = `Δx ${Math.round(tx)}, Δy ${Math.round(ty)}`;
			});
			register(() => P.TouchEventsAPI.Dispose?.(id));
		});
	},
};
