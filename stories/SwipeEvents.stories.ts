import type { Meta, StoryObj } from '@storybook/html-vite';
import { cfg, osuiRoot, Patterns, renderPattern, uid } from './_helpers/osui';

/**
 * SwipeEvents — a gesture utility (no visuals of its own). It attaches touch
 * listeners to the element named by `WidgetId`. Best exercised on a touch
 * device / device-emulation; here we wire it to the demo box and log swipes.
 */
const meta: Meta = {
	title: 'Patterns/Utilities/SwipeEvents',
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => {
		const id = uid('swipe');
		const template = `
			<div ${osuiRoot(id)} style="display:flex;align-items:center;justify-content:center;min-height:200px;background:#eef;border-radius:8px;user-select:none;touch-action:none;">
				<span data-output>Swipe inside this box (touch device / emulation)</span>
			</div>`;
		return renderPattern(template, (root, register) => {
			const P = Patterns();
			P.SwipeEventsAPI.Create(id, cfg({ WidgetId: id }));
			P.SwipeEventsAPI.Initialize(id);
			const out = root.querySelector('[data-output]')!;
			['SwipeUp', 'SwipeDown', 'SwipeLeft', 'SwipeRight'].forEach((evt) =>
				P.SwipeEventsAPI.RegisterCallback?.(id, evt, () => (out.textContent = `${evt} 👆`))
			);
			register(() => P.SwipeEventsAPI.Dispose?.(id));
		});
	},
};
