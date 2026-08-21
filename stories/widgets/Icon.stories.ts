import type { Meta, StoryObj } from '@storybook/html-vite';
import { renderStatic } from '../_helpers/osui';

/**
 * Icon — the OutSystems platform **widget**, transcribed to static markup
 * (see Widgets/Button for why the Widgets group is static; ADR-0009).
 *
 * Captured from @outsystems/runtime-widgets-js@6.25.4 under React 17:
 *   `i[data-icon][aria-hidden=true].fa.fa-<name>`
 *
 * Worth knowing: the widget's `iconSize` property produced **no DOM difference**
 * at capture time — sizes 1, 2 and 3 all emitted the same `class="fa fa-<name>"`
 * with no size class and no inline `font-size`. The sizes are therefore not
 * represented below; adding `fa-2x`-style classes would be inventing markup the
 * widget does not emit. If a future package version starts emitting a size
 * class, re-capture and extend this story.
 *
 * The glyphs come from FontAwesome 4.7, served at /vendor/font-awesome.
 */
const meta: Meta = { title: 'Widgets/Icon' };
export default meta;
type Story = StoryObj;

const icon = (name: string) => `<i class="fa fa-${name}" aria-hidden="true" data-icon=""></i>`;

export const Default: Story = {
	render: () =>
		renderStatic(`
			<div style="display:flex;gap:20px;align-items:center;">
				${icon('star')}
				${icon('bell')}
				${icon('check')}
				${icon('cog')}
			</div>`),
};
