import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from '../_helpers/osui';

/**
 * Image — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17 with
 * `type: 1` (External):
 *   `img[data-image][src][alt=""]`
 *
 * The widget's three `type` values (Static 0, External 1, Binary 2) only change
 * how `src` is resolved — Binary builds a data URI from a runtime BinaryData
 * object — so they share this one DOM shape.
 *
 * The inline height is what the platform writes when the widget's Height is set; it keeps the 1292px-wide
 * logo SVG from overflowing the canvas (and the Chromatic snapshot).
 */
const meta: Meta = { title: 'Widgets/Image' };
export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () =>
		renderStatic(
			`<img data-image="" class="" src="/assets/logo_outsystems-ui-opaque-bg.svg" alt="" style="height: 80px;">`
		),
};
