import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from '../_helpers/osui';

/**
 * Button — the OutSystems platform **widget**, transcribed to static markup.
 *
 * This is not the real React component. The platform widget packages
 * (`@outsystems/runtime-*-js`) ship only on the internal Azure Artifacts feed and
 * this repository is public, so every Widgets story renders the exact DOM the
 * widget emits rather than mounting it — see docs-internal/adr/ADR-0009 for the
 * capture method and the refresh trigger.
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17:
 *   `button[data-button][type=button].<style>` — the `style` property becomes the
 *   className verbatim, and `enabled: false` becomes the `disabled` attribute.
 *
 * CSS contract: `.btn` and its variants from src/scss/03-widgets/_btn.scss.
 */
const meta: Meta = { title: 'Widgets/Button' };
export default meta;
type Story = StoryObj;

const btn = (style: string, label: string, disabled = false) =>
	`<button data-button="" class="${style}" type="button"${disabled ? ' disabled=""' : ''}>${label}</button>`;

export const Variants: Story = {
	render: () =>
		renderStatic(`
			<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
				${btn('btn btn-primary', 'Primary')}
				${btn('btn', 'Secondary')}
				${btn('btn btn-cancel', 'Cancel')}
				${btn('btn btn-success', 'Confirm')}
				${btn('btn btn-error', 'Delete')}
				${btn('btn btn-primary', 'Disabled', true)}
			</div>`),
};
